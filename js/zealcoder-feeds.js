/*
 * zealcoder-feeds.js
 * -------------------
 * Pulls live signal from public, keyless APIs so the site reflects
 * real activity instead of hand-edited copy:
 *   - GitHub REST API  (public events / repos, no auth required)
 *   - Medium RSS via rss2json (Medium has no public JSON API / CORS)
 *   - Kaggle kernels via assets/kaggle-feed.json, a static file refreshed
 *     daily by a GitHub Action (see .github/workflows/kaggle-feed.yml).
 *     Kaggle's API requires an authenticated request, which can never be
 *     made safely from a visitor's browser, so the Action calls it
 *     server-side with a repo secret and commits the result as plain JSON.
 *
 * All calls are read-only, cached by the browser, and fail silently
 * into a static fallback card if the source is unreachable or rate-limited.
 * No LinkedIn call is made here — LinkedIn's API does not expose a
 * personal activity feed to third-party sites; see the profile badge
 * embed on the Contact page for the closest live equivalent.
 *
 * Renders bilingually: reads the current language from <html lang>
 * (set by zealcoder-i18n.js) and re-renders whenever the person
 * switches language via the zc:langchange event.
 */

const ZC_GITHUB_USER = 'zealcoder95';
const ZC_MEDIUM_USER = 'zealcoder';
const ZC_KAGGLE_USER = 'gizemglc';
const ZC_CACHE_TTL_MS = 15 * 60 * 1000; // 15 min: keeps us well under GitHub's 60 req/hr
                                          // unauthenticated limit and rss2json's free-tier
                                          // rate limit even if several tabs/visitors overlap.

/* Books & Courses: primary source is a Google Sheet (edited without touching
   code or Git), same keyless-fetch spirit as the GitHub/Medium feeds above.
   Google Sheets has no anonymous "list rows as JSON" endpoint, but a sheet
   shared as "Anyone with the link — Viewer" can be read as CSV via the
   gviz endpoint below with no API key and no auth. If the sheet is
   unreachable, empty, or a tab was renamed, we fall back to the bundled
   assets/books.json / assets/courses.json — so editing the sheet is
   optional, not a new single point of failure. */
const ZC_SHEET_ID = '1l3Ya1x8NLN4NpnRk8Nq-SonQt_k4Ag51tM480spN12U';
const ZC_BOOKS_SHEET_TAB = 'Kitaplar';
const ZC_COURSES_SHEET_TAB = 'Sertifikalar';
function zcSheetCsvUrl(tab) {
  return `https://docs.google.com/spreadsheets/d/${ZC_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tab)}`;
}
/* Minimal RFC4180-ish CSV parser: handles quoted fields, escaped ""
   quotes inside a field, commas and newlines inside quoted fields.
   Good enough for a hand-edited Sheet; not a general-purpose library. */
function zcParseCSV(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  const s = text.replace(/\r\n/g, '\n');
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inQuotes) {
      if (c === '"') {
        if (s[i + 1] === '"') { field += '"'; i++; }
        else { inQuotes = false; }
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
      else field += c;
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => !(r.length === 1 && r[0].trim() === ''));
}
function zcCSVToObjects(text) {
  const rows = zcParseCSV(text);
  if (!rows.length) return [];
  const header = rows[0].map(h => h.trim());
  return rows.slice(1).map(r => {
    const obj = {};
    header.forEach((h, idx) => { obj[h] = (r[idx] || '').trim(); });
    return obj;
  });
}
async function zcFetchSheetTab(tab) {
  const res = await fetch(zcSheetCsvUrl(tab), { cache: 'no-store' });
  if (!res.ok) throw new Error(`sheet fetch failed: ${tab}`);
  const text = await res.text();
  // A private/unshared sheet returns an HTML sign-in page with a 200
  // status, not CSV — detect that case explicitly instead of rendering it.
  if (/^\s*</.test(text)) throw new Error(`sheet not public: ${tab}`);
  const rows = zcCSVToObjects(text);
  if (!rows.length) throw new Error(`sheet empty: ${tab}`);
  return rows;
}
async function zcFetchBooksFromSheet() {
  const rows = await zcFetchSheetTab(ZC_BOOKS_SHEET_TAB);
  return rows.filter(r => r.title_tr || r.title_en).map(r => ({
    id: r.id, category: r.category, link: r.link,
    tag: { tr: r.tag_tr, en: r.tag_en || r.tag_tr },
    title: { tr: r.title_tr || r.title_en, en: r.title_en || r.title_tr },
    desc: { tr: r.desc_tr, en: r.desc_en || r.desc_tr },
  }));
}
async function zcFetchCoursesFromSheet() {
  const rows = await zcFetchSheetTab(ZC_COURSES_SHEET_TAB);
  return rows.filter(r => r.provider).map(r => ({
    provider: r.provider,
    desc: { tr: r.desc_tr, en: r.desc_en || r.desc_tr },
  }));
}

/* A Medium post tagged with this word on medium.com is treated as a
   "günlük" (journal) entry instead of a regular article: it is pulled
   into gunluk.html and excluded from yazilar.html. Add the tag when
   publishing on Medium — nothing else to configure. */
const ZC_JOURNAL_TAG_WORDS = ['gunluk', 'günlük', 'journal'];
function zcHasJournalTag(item) {
  const cats = (item.categories || []).map(c => String(c).toLowerCase().trim());
  return cats.some(c => ZC_JOURNAL_TAG_WORDS.includes(c));
}

/* Tiny cache wrapper around localStorage. We store the already-rendered
   HTML plus a timestamp, keyed by source+lang, so a cache hit is a pure
   synchronous render with zero network round-trip. On a cache miss (or an
   expired entry) we still render instantly from whatever we have and kick
   off a background refresh — the visitor never sees a loading skeleton
   twice in the same session, and the feed self-heals the moment any one
   visitor's request succeeds. */
function zcCacheGet(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) { return null; }
}
function zcCacheSet(key, html) {
  try {
    localStorage.setItem(key, JSON.stringify({ html, ts: Date.now() }));
  } catch (err) { /* storage disabled/full: fail silently, just skip caching */ }
}

const ZC_FEED_STRINGS = {
  tr: {
    justNow: 'az önce',
    minsAgo: n => `${n} dk önce`,
    hrsAgo: n => `${n} sa önce`,
    daysAgo: n => `${n} gün önce`,
    monthsAgo: n => `${n} ay önce`,
    yearsAgo: n => `${n} yıl önce`,
    updated: 'güncellendi',
    noDesc: 'Açıklama eklenmemiş.',
    ghUnavailable: 'GitHub etkinlik akışı şu an alınamadı.',
    viewProfile: 'Profili doğrudan görüntüle →',
    mediumPreparing: 'Yeni içerikler hazırlanıyor. Medium profilimi takip ederek ilk yazıyı kaçırmayabilirsiniz.',
    viewMediumProfile: 'Medium profilimi gör →',
    kgUnavailable: 'Kaggle akışı şu an alınamadı.',
    viewKaggleProfile: 'Kaggle profilimi gör →',
    votes: n => `${n} oy`,
    noRun: 'çalıştırılmadı',
    kgSynced: t => `Kaggle verileri ${t} güncellendi`,
    bookLink: 'Yayıncı sayfası →',
    booksUnavailable: 'Kitap listesi şu an yüklenemedi.',
    skillsUnavailable: 'Yetenek listesi şu an yüklenemedi.',
    ghLangsUnavailable: 'GitHub·dil verisi şu an alınamadı.',
    journalPreparing: 'Yeni günlük girişleri hazırlanıyor. Medium profilimi takip ederek ilk yazıyı kaçırmayabilirsiniz.',
    viewMediumJournal: 'Medium profilimi gör →',
    readOnMedium: 'Medium\u2019da oku →',
    showMore: n => `Daha fazla göster (+${n})`,
    projectsUnavailable: 'Proje listesi şu an yüklenemedi.',
    coursesUnavailable: 'Kurs/sertifika listesi şu an yüklenemedi.',
    viewOnKaggle: "Kaggle'da incele →",
    viewOnGithub: "GitHub'da incele →",
    viewProject: 'İncele →',
    events: {
      push: n => `reposuna ${n} commit gönderdi`,
      createRepo: 'reposunu oluşturdu',
      createRef: ref => `içinde "${ref}" oluşturdu`,
      pr: action => `üzerinde pull request ${action === 'opened' ? 'açtı' : action}`,
      issue: action => `içinde issue ${action === 'opened' ? 'açtı' : action}`,
      release: 'için yeni sürüm yayınladı',
      public: 'reposunu herkese açtı',
      watch: 'reposunu yıldızladı',
      fork: 'reposunu forkladı',
      other: type => `üzerinde çalıştı (${type})`
    },
    tags: {
      push: 'push', createRepo: 'yeni repo', createRef: 'branch', pr: 'pull request',
      issue: 'issue', release: 'release', public: 'public', watch: 'star', fork: 'fork'
    }
  },
  en: {
    justNow: 'just now',
    minsAgo: n => `${n}m ago`,
    hrsAgo: n => `${n}h ago`,
    daysAgo: n => `${n}d ago`,
    monthsAgo: n => `${n}mo ago`,
    yearsAgo: n => `${n}y ago`,
    updated: 'updated',
    noDesc: 'No description yet.',
    ghUnavailable: 'The GitHub activity feed could not be loaded right now.',
    viewProfile: 'View the profile directly →',
    mediumPreparing: 'New content is on the way. Follow my Medium profile so you don\u2019t miss the first post.',
    viewMediumProfile: 'View my Medium profile →',
    kgUnavailable: 'The Kaggle feed could not be loaded right now.',
    viewKaggleProfile: 'View my Kaggle profile →',
    votes: n => `${n} vote${n === 1 ? '' : 's'}`,
    noRun: 'not run yet',
    kgSynced: t => `Kaggle data synced ${t}`,
    bookLink: "Publisher's page →",
    booksUnavailable: 'The book list could not be loaded right now.',
    skillsUnavailable: 'The skills list could not be loaded right now.',
    ghLangsUnavailable: 'GitHub language data could not be loaded right now.',
    journalPreparing: 'New journal entries are on the way. Follow my Medium profile so you don\u2019t miss the first one.',
    viewMediumJournal: 'View my Medium profile →',
    readOnMedium: 'Read on Medium →',
    showMore: n => `Show more (+${n})`,
    projectsUnavailable: 'The project list could not be loaded right now.',
    coursesUnavailable: 'The courses/certificates list could not be loaded right now.',
    viewOnKaggle: 'View on Kaggle →',
    viewOnGithub: 'View on GitHub →',
    viewProject: 'View →',
    events: {
      push: n => `pushed ${n} commit${n === 1 ? '' : 's'} to`,
      createRepo: 'created the repo',
      createRef: ref => `created "${ref}" in`,
      pr: action => `${action === 'opened' ? 'opened' : action} a pull request on`,
      issue: action => `${action === 'opened' ? 'opened' : action} an issue in`,
      release: 'published a new release for',
      public: 'made public the repo',
      watch: 'starred',
      fork: 'forked',
      other: type => `worked on (${type})`
    },
    tags: {
      push: 'push', createRepo: 'new repo', createRef: 'branch', pr: 'pull request',
      issue: 'issue', release: 'release', public: 'public', watch: 'star', fork: 'fork'
    }
  }
};

function zcLang() {
  return (document.documentElement.lang === 'en') ? 'en' : 'tr';
}

function zcTimeAgo(dateStr, S) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return S.justNow;
  if (mins < 60) return S.minsAgo(mins);
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return S.hrsAgo(hrs);
  const days = Math.floor(hrs / 24);
  if (days < 30) return S.daysAgo(days);
  const months = Math.floor(days / 30);
  if (months < 12) return S.monthsAgo(months);
  return S.yearsAgo(Math.floor(months / 12));
}

function zcEscape(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

function zcDescribeGithubEvent(evt, S) {
  const repo = evt.repo && evt.repo.name ? evt.repo.name.split('/').slice(1).join('/') : evt.repo.name;
  const repoUrl = `https://github.com/${evt.repo.name}`;
  const lang = zcLang();
  const sep = lang === 'en' ? ' ' : ' ';
  function line(verbBeforeRepo, verbAfterRepo, tag) {
    // TR keeps "repo <fiil>" order; EN reads more naturally as "<fiil> repo"
    const label = lang === 'en' ? `${verbBeforeRepo} ${repo}` : `${repo} ${verbAfterRepo}`;
    return { label, url: repoUrl, tag };
  }
  switch (evt.type) {
    case 'PushEvent': {
      const n = evt.payload && evt.payload.commits ? evt.payload.commits.length : 1;
      return line(S.events.push(n), S.events.push(n), S.tags.push);
    }
    case 'CreateEvent':
      if (evt.payload && evt.payload.ref_type === 'repository') {
        return line(S.events.createRepo, S.events.createRepo, S.tags.createRepo);
      }
      return line(S.events.createRef(evt.payload.ref || ''), S.events.createRef(evt.payload.ref || ''), S.tags.createRef);
    case 'PullRequestEvent':
      return line(S.events.pr(evt.payload.action), S.events.pr(evt.payload.action), S.tags.pr);
    case 'IssuesEvent':
      return line(S.events.issue(evt.payload.action), S.events.issue(evt.payload.action), S.tags.issue);
    case 'ReleaseEvent':
      return line(S.events.release, S.events.release, S.tags.release);
    case 'PublicEvent':
      return line(S.events.public, S.events.public, S.tags.public);
    case 'WatchEvent':
      return line(S.events.watch, S.events.watch, S.tags.watch);
    case 'ForkEvent':
      return line(S.events.fork, S.events.fork, S.tags.fork);
    default:
      return line(S.events.other(evt.type), S.events.other(evt.type), evt.type.replace('Event', '').toLowerCase());
  }
}

function zcRenderGithubFallback(container) {
  const S = ZC_FEED_STRINGS[zcLang()];
  container.innerHTML = `
    <div class="feed-empty">
      ${S.ghUnavailable}
      <a href="https://github.com/${ZC_GITHUB_USER}" target="_blank" rel="noopener">${S.viewProfile}</a>
    </div>`;
}

async function zcLoadGithubActivity(elId, count) {
  const el = document.getElementById(elId);
  if (!el) return;
  const S = ZC_FEED_STRINGS[zcLang()];
  const cacheKey = `zc_cache_gh-activity_${zcLang()}_${count}`;
  const cached = zcCacheGet(cacheKey);
  if (cached) el.innerHTML = cached.html; // instant render, no skeleton flash
  if (cached && (Date.now() - cached.ts < ZC_CACHE_TTL_MS)) return; // fresh enough, skip network
  try {
    const res = await fetch(`https://api.github.com/users/${ZC_GITHUB_USER}/events/public?per_page=30`);
    if (!res.ok) throw new Error('github events request failed');
    const events = await res.json();
    const relevant = events
      .filter(e => e.repo && ['PushEvent', 'CreateEvent', 'PullRequestEvent', 'IssuesEvent', 'ReleaseEvent', 'PublicEvent'].includes(e.type))
      .slice(0, count);
    if (!relevant.length) { if (!cached) zcRenderGithubFallback(el); return; }
    const html = relevant.map(evt => {
      const d = zcDescribeGithubEvent(evt, S);
      return `<div class="feed-item">
        <a href="${d.url}" target="_blank" rel="noopener">${zcEscape(d.label)}</a>
        <div class="feed-meta"><span class="feed-tag">${zcEscape(d.tag)}</span><span>${zcTimeAgo(evt.created_at, S)}</span></div>
      </div>`;
    }).join('');
    el.innerHTML = html;
    zcCacheSet(cacheKey, html);
  } catch (err) {
    if (!cached) zcRenderGithubFallback(el); // only show the static fallback
                                              // if there is truly nothing,
                                              // cached or fresh, to display
  }
}

async function zcLoadGithubRepos(elId, count) {
  const el = document.getElementById(elId);
  if (!el) return;
  const S = ZC_FEED_STRINGS[zcLang()];
  const cacheKey = `zc_cache_gh-repos_${zcLang()}_${count}`;
  const cached = zcCacheGet(cacheKey);
  if (cached) el.innerHTML = cached.html;
  if (cached && (Date.now() - cached.ts < ZC_CACHE_TTL_MS)) return;
  try {
    const res = await fetch(`https://api.github.com/users/${ZC_GITHUB_USER}/repos?sort=pushed&per_page=${count}`);
    if (!res.ok) throw new Error('github repos request failed');
    const repos = await res.json();
    if (!Array.isArray(repos) || !repos.length) { if (!cached) zcRenderGithubFallback(el); return; }
    const html = repos.map(r => `
      <div class="feed-item">
        <a href="${r.html_url}" target="_blank" rel="noopener">${zcEscape(r.name)}</a>
        <p style="color:var(--text-muted);font-size:0.85rem;margin-top:0.3rem;">${zcEscape(r.description || S.noDesc)}</p>
        <div class="feed-meta">
          ${r.language ? `<span class="feed-tag">${zcEscape(r.language)}</span>` : ''}
          <span>★ ${r.stargazers_count}</span>
          <span>${S.updated}: ${zcTimeAgo(r.pushed_at, S)}</span>
        </div>
      </div>`).join('');
    el.innerHTML = html;
    zcCacheSet(cacheKey, html);
  } catch (err) {
    if (!cached) zcRenderGithubFallback(el);
  }
}

function zcStripHtml(html) {
  const div = document.createElement('div');
  div.innerHTML = html || '';
  return (div.textContent || div.innerText || '').trim();
}

function zcRenderMediumFallback(elId) {
  const el = document.getElementById(elId);
  if (!el) return;
  const S = ZC_FEED_STRINGS[zcLang()];
  el.innerHTML = `
    <div class="feed-empty">
      ${S.mediumPreparing}
      <a href="https://medium.com/@${ZC_MEDIUM_USER}" target="_blank" rel="noopener">${S.viewMediumProfile}</a>
    </div>`;
}

async function zcLoadMediumArticles(elId, count) {
  const el = document.getElementById(elId);
  if (!el) return;
  const S = ZC_FEED_STRINGS[zcLang()];
  const withComments = el.dataset.comments === '1';
  const cacheKey = `zc_cache_medium_${zcLang()}_${count}_${withComments ? 'c' : 'n'}`;
  const cached = zcCacheGet(cacheKey);
  if (cached) el.innerHTML = cached.html;
  if (cached && (Date.now() - cached.ts < ZC_CACHE_TTL_MS)) return;
  try {
    const feedUrl = encodeURIComponent(`https://medium.com/feed/@${ZC_MEDIUM_USER}`);
    const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${feedUrl}`);
    if (!res.ok) throw new Error('medium feed request failed');
    const data = await res.json();
    if (data.status !== 'ok' || !data.items || !data.items.length) throw new Error('medium feed empty');
    const articleItems = data.items.filter(item => !zcHasJournalTag(item));
    if (!articleItems.length) throw new Error('medium feed empty after journal filter');
    const html = articleItems.slice(0, count).map(item => {
      const snippet = zcStripHtml(item.description).slice(0, 110);
      return `<div class="feed-item">
        <a href="${item.link}" target="_blank" rel="noopener">${zcEscape(item.title)}</a>
        ${snippet ? `<p style="color:var(--text-muted);font-size:0.85rem;margin-top:0.3rem;">${zcEscape(snippet)}${snippet.length >= 110 ? '…' : ''}</p>` : ''}
        <div class="feed-meta"><span>${zcTimeAgo(item.pubDate, S)}</span></div>
        ${withComments && typeof zcCommentsWidgetHTML === 'function' ? zcCommentsWidgetHTML('post', item.link) : ''}
      </div>`;
    }).join('');
    el.innerHTML = html;
    zcCacheSet(cacheKey, html);
  } catch (err) {
    if (!cached) zcRenderMediumFallback(elId);
  }
}

function zcRenderJournalFallback(elId) {
  const el = document.getElementById(elId);
  if (!el) return;
  const S = ZC_FEED_STRINGS[zcLang()];
  el.innerHTML = `
    <div class="feed-empty">
      ${S.journalPreparing}
      <a href="https://medium.com/@${ZC_MEDIUM_USER}" target="_blank" rel="noopener">${S.viewMediumJournal}</a>
    </div>`;
}

/* Reads the same Medium RSS feed as zcLoadMediumArticles, but keeps only
   posts tagged with one of ZC_JOURNAL_TAG_WORDS on Medium — that's the
   entire "publish workflow" for adding a new günlük entry: write the
   post on Medium, add the tag, done. Rendered above the hand-written
   archive entries already in gunluk.html. */
async function zcLoadMediumJournal(elId, count) {
  const el = document.getElementById(elId);
  if (!el) return;
  const S = ZC_FEED_STRINGS[zcLang()];
  const cacheKey = `zc_cache_journal_${zcLang()}_${count}`;
  const cached = zcCacheGet(cacheKey);
  if (cached) el.innerHTML = cached.html;
  if (cached && (Date.now() - cached.ts < ZC_CACHE_TTL_MS)) return;
  try {
    const feedUrl = encodeURIComponent(`https://medium.com/feed/@${ZC_MEDIUM_USER}`);
    const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${feedUrl}`);
    if (!res.ok) throw new Error('medium feed request failed');
    const data = await res.json();
    if (data.status !== 'ok' || !data.items || !data.items.length) throw new Error('medium feed empty');
    const journalItems = data.items.filter(zcHasJournalTag);
    if (!journalItems.length) { if (!cached) zcRenderJournalFallback(elId); return; }
    const html = journalItems.slice(0, count).map(item => {
      const snippet = zcStripHtml(item.description).slice(0, 160);
      return `<article class="journal-entry">
        <div class="journal-entry-head">
          <h3><a href="${item.link}" target="_blank" rel="noopener">${zcEscape(item.title)}</a></h3>
          <span class="journal-entry-date">${zcTimeAgo(item.pubDate, S)}</span>
        </div>
        ${snippet ? `<p style="color:var(--text-muted);">${zcEscape(snippet)}${snippet.length >= 160 ? '…' : ''}</p>` : ''}
        <a class="project-link" href="${item.link}" target="_blank" rel="noopener">${S.readOnMedium}</a>
        ${typeof zcCommentsWidgetHTML === 'function' ? zcCommentsWidgetHTML('post', item.link) : ''}
      </article>`;
    }).join('');
    el.innerHTML = html;
    zcCacheSet(cacheKey, html);
  } catch (err) {
    if (!cached) zcRenderJournalFallback(elId);
  }
}

function zcRenderKaggleFallback(elId) {
  const el = document.getElementById(elId);
  if (!el) return;
  const S = ZC_FEED_STRINGS[zcLang()];
  el.innerHTML = `
    <div class="feed-empty">
      ${S.kgUnavailable}
      <a href="https://www.kaggle.com/${ZC_KAGGLE_USER}" target="_blank" rel="noopener">${S.viewKaggleProfile}</a>
    </div>`;
}

/* Unlike the GitHub/Medium feeds above, Kaggle's API requires an
   authenticated request, which can never happen safely from the visitor's
   browser (the key would be exposed to anyone). Instead, a scheduled
   GitHub Action calls the Kaggle API server-side and commits the result
   to assets/kaggle-feed.json — this function just reads that static,
   same-origin file. See .github/workflows/kaggle-feed.yml. */
async function zcLoadKaggleKernels(elId, count) {
  const el = document.getElementById(elId);
  if (!el) return;
  const S = ZC_FEED_STRINGS[zcLang()];
  const cacheKey = `zc_cache_kaggle_${zcLang()}_${count}`;
  const cached = zcCacheGet(cacheKey);
  if (cached) el.innerHTML = cached.html;
  if (cached && (Date.now() - cached.ts < ZC_CACHE_TTL_MS)) return;
  try {
    const res = await fetch('assets/kaggle-feed.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('kaggle feed request failed');
    const data = await res.json();
    if (!data.items || !data.items.length) throw new Error('kaggle feed empty');
    const html = data.items.slice(0, count).map(item => `
      <div class="feed-item">
        <a href="${item.url}" target="_blank" rel="noopener">${zcEscape(item.title)}</a>
        <div class="feed-meta">
          <span class="feed-tag">Kaggle</span>
          <span>${S.votes(item.totalVotes || 0)}</span>
          <span>${item.lastRunTime ? zcTimeAgo(item.lastRunTime, S) : S.noRun}</span>
        </div>
      </div>`).join('');
    el.innerHTML = html;
    zcCacheSet(cacheKey, html);
    const syncEl = document.getElementById('kaggle-sync-note');
    if (syncEl && data.updatedAt) syncEl.textContent = S.kgSynced(zcTimeAgo(data.updatedAt, S));
  } catch (err) {
    if (!cached) zcRenderKaggleFallback(elId);
  }
}

/* Books grid: reads assets/books.json (same static-file pattern as
   assets/kaggle-feed.json) and re-uses the existing .project-card markup
   so the filter chips / "show more" behaviour in kaynaklar.html keeps
   working unchanged. Adding a book going forward means editing that one
   JSON file on GitHub — no HTML or i18n edits needed. */
let zcBooksFilterAttached = false;
function zcBooksRender() {
  const grid = document.getElementById('booksGrid');
  const filterBar = document.getElementById('booksFilter');
  const showMoreBtn = document.getElementById('booksShowMore');
  if (!grid || !filterBar || !showMoreBtn) return;
  const S = ZC_FEED_STRINGS[zcLang()];
  const cards = Array.from(grid.querySelectorAll('.project-card'));
  const activeChip = filterBar.querySelector('.chip.is-active');
  const activeFilter = activeChip ? activeChip.dataset.filter : 'all';
  const expanded = filterBar.dataset.zcExpanded === '1';
  cards.forEach((card, i) => {
    const matches = activeFilter === 'all' || card.dataset.cat === activeFilter;
    if (!matches) { card.style.display = 'none'; return; }
    card.style.display = (activeFilter === 'all' && !expanded && i >= 6) ? 'none' : '';
  });
  const remaining = cards.length - 6;
  showMoreBtn.textContent = S.showMore(remaining);
  showMoreBtn.style.display = (activeFilter === 'all' && !expanded && remaining > 0) ? '' : 'none';
}
function zcInitBooksFilter() {
  const filterBar = document.getElementById('booksFilter');
  const showMoreBtn = document.getElementById('booksShowMore');
  if (!filterBar || !showMoreBtn) return;
  filterBar.dataset.zcExpanded = '0';
  zcBooksRender();
  if (zcBooksFilterAttached) return;
  zcBooksFilterAttached = true;
  filterBar.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      filterBar.dataset.zcExpanded = '0';
      filterBar.querySelectorAll('.chip').forEach(c => c.classList.toggle('is-active', c === chip));
      zcBooksRender();
    });
  });
  showMoreBtn.addEventListener('click', () => { filterBar.dataset.zcExpanded = '1'; zcBooksRender(); });
}
async function zcLoadBooks(elId) {
  const el = document.getElementById(elId);
  if (!el) return;
  const S = ZC_FEED_STRINGS[zcLang()];
  const lang = zcLang();
  const cacheKey = `zc_cache_books_${lang}`;
  const cached = zcCacheGet(cacheKey);
  if (cached) { el.innerHTML = cached.html; zcInitBooksFilter(); }
  if (cached && (Date.now() - cached.ts < ZC_CACHE_TTL_MS)) return;
  try {
    let items;
    try {
      items = await zcFetchBooksFromSheet();
    } catch (sheetErr) {
      const res = await fetch('assets/books.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('books fetch failed');
      const data = await res.json();
      if (!data.items || !data.items.length) throw new Error('books empty');
      items = data.items;
    }
    const html = items.map(b => `
      <div class="project-card" data-cat="${zcEscape(b.category)}">
        <span class="project-tag">${zcEscape((b.tag && (b.tag[lang] || b.tag.tr)) || '')}</span>
        <h3>${zcEscape((b.title && (b.title[lang] || b.title.tr)) || '')}</h3>
        <p>${zcEscape((b.desc && (b.desc[lang] || b.desc.tr)) || '')}</p>
        ${b.link ? `<a class="project-link" href="${b.link}" target="_blank" rel="noopener">${S.bookLink}</a>` : ''}
        ${typeof zcCommentsWidgetHTML === 'function' && b.id ? zcCommentsWidgetHTML('book', b.id) : ''}
      </div>`).join('');
    el.innerHTML = html;
    zcCacheSet(cacheKey, html);
    zcInitBooksFilter();
  } catch (err) {
    if (!cached) el.innerHTML = `<div class="feed-empty">${S.booksUnavailable}</div>`;
  }
}

/* Project card icons: a small fixed set of hand-drawn glyphs keyed by
   name, so assets/projects.json only needs to reference an icon by
   string (e.g. "chart") instead of embedding raw SVG markup. Unknown
   or missing icon keys fall back to a generic "code" glyph, so a new
   project entry always renders something reasonable even before
   anyone picks a matching icon. */
const ZC_PROJECT_ICONS = {
  survey: '<path d="M3 4h18l-7 8v6l-4 2v-8L3 4z"/>',
  network: '<path d="M3 21V3"/><path d="M3 21h18"/><circle cx="7" cy="15" r="1.4" fill="currentColor" stroke="none"/><circle cx="11" cy="9" r="1.4" fill="currentColor" stroke="none"/><circle cx="15" cy="13" r="1.4" fill="currentColor" stroke="none"/><circle cx="19" cy="6" r="1.4" fill="currentColor" stroke="none"/><path d="M6 17 L19 6" stroke-dasharray="2 2"/>',
  leaf: '<path d="M20 4C10 4 4 10 4 18c0 1.1.9 2 2 2 8 0 14-6 14-16z"/><path d="M6 20c4-6 8-10 14-14"/>',
  bars: '<path d="M3 21h18"/><rect x="5" y="14" width="3" height="7" fill="currentColor" stroke="none"/><rect x="10.5" y="10" width="3" height="11" fill="currentColor" stroke="none"/><rect x="16" y="5" width="3" height="16" fill="currentColor" stroke="none"/><path d="M4 12l5-4 4 2 6-6"/>',
  code: '<path d="M8 6 3 12l5 6"/><path d="M16 6l5 6-5 6"/>'
};
function zcProjectIconSvg(key) {
  const d = ZC_PROJECT_ICONS[key] || ZC_PROJECT_ICONS.code;
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
}
/* CTA label is derived from the link's domain rather than stored per
   item, so a new project entry in the JSON only needs a URL — no
   per-language button text to fill in. */
function zcProjectLinkLabel(link, S) {
  if (!link) return '';
  if (link.includes('kaggle.com')) return S.viewOnKaggle;
  if (link.includes('github.com')) return S.viewOnGithub;
  return S.viewProject;
}

/* Projects grid: reads assets/projects.json (same static-file pattern
   as assets/books.json). Adding a project going forward means editing
   that one JSON file on GitHub — no HTML edits needed. Shows the first
   6 by default with a "show more" button once there are more, mirroring
   the books section. */
let zcProjectsShowMoreAttached = false;
function zcProjectsRender() {
  const grid = document.getElementById('projectsGrid');
  const showMoreBtn = document.getElementById('projectsShowMore');
  if (!grid || !showMoreBtn) return;
  const S = ZC_FEED_STRINGS[zcLang()];
  const cards = Array.from(grid.querySelectorAll('.project-card'));
  const expanded = grid.dataset.zcExpanded === '1';
  cards.forEach((card, i) => { card.style.display = (!expanded && i >= 6) ? 'none' : ''; });
  const remaining = cards.length - 6;
  showMoreBtn.textContent = S.showMore(remaining);
  showMoreBtn.style.display = (!expanded && remaining > 0) ? '' : 'none';
}
function zcInitProjectsShowMore() {
  const grid = document.getElementById('projectsGrid');
  const showMoreBtn = document.getElementById('projectsShowMore');
  if (!grid || !showMoreBtn) return;
  grid.dataset.zcExpanded = '0';
  zcProjectsRender();
  if (zcProjectsShowMoreAttached) return;
  zcProjectsShowMoreAttached = true;
  showMoreBtn.addEventListener('click', () => { grid.dataset.zcExpanded = '1'; zcProjectsRender(); });
}
async function zcLoadProjects(elId) {
  const el = document.getElementById(elId);
  if (!el) return;
  const S = ZC_FEED_STRINGS[zcLang()];
  const lang = zcLang();
  const cacheKey = `zc_cache_projects_${lang}`;
  const cached = zcCacheGet(cacheKey);
  if (cached) { el.innerHTML = cached.html; zcInitProjectsShowMore(); }
  if (cached && (Date.now() - cached.ts < ZC_CACHE_TTL_MS)) return;
  try {
    const res = await fetch('assets/projects.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('projects fetch failed');
    const data = await res.json();
    if (!data.items || !data.items.length) throw new Error('projects empty');
    const html = data.items.map(p => `
      <div class="project-card">
        <div class="project-icon" aria-hidden="true">${zcProjectIconSvg(p.icon)}</div>
        <span class="project-tag">${zcEscape((p.tag && (p.tag[lang] || p.tag.tr)) || '')}</span>
        <h3>${zcEscape((p.title && (p.title[lang] || p.title.tr)) || '')}</h3>
        <p>${zcEscape((p.desc && (p.desc[lang] || p.desc.tr)) || '')}</p>
        ${p.link ? `<a class="project-link" href="${p.link}" target="_blank" rel="noopener">${zcProjectLinkLabel(p.link, S)}</a>` : ''}
        ${p.chart ? `<button type="button" class="project-chart-trigger" data-chart-full="${p.chart.img}" data-chart-alt="${zcEscape((p.chart.alt && (p.chart.alt[lang] || p.chart.alt.tr)) || '')}">
          <img src="${p.chart.img}" alt="${zcEscape((p.chart.alt && (p.chart.alt[lang] || p.chart.alt.tr)) || '')}" loading="lazy">
        </button>` : ''}
        ${typeof zcCommentsWidgetHTML === 'function' && p.id ? zcCommentsWidgetHTML('project', p.id) : ''}
      </div>`).join('');
    el.innerHTML = html;
    zcCacheSet(cacheKey, html);
    zcInitProjectsShowMore();
  } catch (err) {
    if (!cached) el.innerHTML = `<div class="feed-empty">${S.projectsUnavailable}</div>`;
  }
}

/* Courses/certificates board: reads assets/courses.json and reuses the
   .board-cell markup already used by the skills board. Adding a new
   course means editing that one JSON file — no HTML edits needed. */
async function zcLoadCourses(elId) {
  const el = document.getElementById(elId);
  if (!el) return;
  const S = ZC_FEED_STRINGS[zcLang()];
  const lang = zcLang();
  const cacheKey = `zc_cache_courses_${lang}`;
  const cached = zcCacheGet(cacheKey);
  if (cached) el.innerHTML = cached.html;
  if (cached && (Date.now() - cached.ts < ZC_CACHE_TTL_MS)) return;
  try {
    let items;
    try {
      items = await zcFetchCoursesFromSheet();
    } catch (sheetErr) {
      const res = await fetch('assets/courses.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('courses fetch failed');
      const data = await res.json();
      if (!data.items || !data.items.length) throw new Error('courses empty');
      items = data.items;
    }
    const html = items.map(c => `
      <div class="board-cell">
        <h3>${zcEscape(c.provider || '')}</h3>
        <p>${zcEscape((c.desc && (c.desc[lang] || c.desc.tr)) || '')}</p>
      </div>`).join('');
    el.innerHTML = html;
    zcCacheSet(cacheKey, html);
  } catch (err) {
    if (!cached) el.innerHTML = `<div class="feed-empty">${S.coursesUnavailable}</div>`;
  }
}

/* Skills board: the "Diller" cell is populated live from GitHub repo
   languages (see zcLoadGithubLanguages below); every other category
   comes from assets/skills.json. Adding a new tool means adding one
   entry to that JSON file on GitHub — no HTML edits. */
async function zcLoadSkills(elId) {
  const el = document.getElementById(elId);
  if (!el) return;
  const S = ZC_FEED_STRINGS[zcLang()];
  const lang = zcLang();
  const cacheKey = `zc_cache_skills_${lang}`;
  const cached = zcCacheGet(cacheKey);
  if (cached) el.innerHTML = cached.html;
  if (cached && (Date.now() - cached.ts < ZC_CACHE_TTL_MS)) return;
  try {
    const res = await fetch('assets/skills.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('skills fetch failed');
    const data = await res.json();
    if (!data.categories || !data.categories.length) throw new Error('skills empty');
    const html = data.categories.map(cat => `
      <div class="board-cell">
        <h3>${zcEscape((cat.title && (cat.title[lang] || cat.title.tr)) || '')}</h3>
        <p>${zcEscape((cat.desc && (cat.desc[lang] || cat.desc.tr)) || '')}</p>
        <div class="chip-row">${(cat.chips || []).map(c => `<span class="chip">${zcEscape(c)}</span>`).join('')}</div>
      </div>`).join('');
    el.innerHTML = html;
    zcCacheSet(cacheKey, html);
  } catch (err) {
    if (!cached) el.innerHTML = `<div class="feed-empty">${S.skillsUnavailable}</div>`;
  }
}

/* Auto-detects the "Diller" chips from the languages GitHub reports on
   your public repos — add a repo in a new language and it appears here
   next refresh, nothing to edit by hand. Falls back to a static seed
   list only if the GitHub call fails outright. */
async function zcLoadGithubLanguages(elId, count) {
  const el = document.getElementById(elId);
  if (!el) return;
  const S = ZC_FEED_STRINGS[zcLang()];
  const cacheKey = `zc_cache_gh-langs_${zcLang()}`;
  const cached = zcCacheGet(cacheKey);
  if (cached) el.innerHTML = cached.html;
  if (cached && (Date.now() - cached.ts < ZC_CACHE_TTL_MS)) return;
  try {
    const res = await fetch(`https://api.github.com/users/${ZC_GITHUB_USER}/repos?sort=pushed&per_page=100`);
    if (!res.ok) throw new Error('github repos request failed');
    const repos = await res.json();
    if (!Array.isArray(repos)) throw new Error('unexpected github response');
    const langs = [...new Set(repos.map(r => r.language).filter(Boolean))].slice(0, count);
    if (!langs.length) throw new Error('no languages found');
    const html = langs.map(l => `<span class="chip">${zcEscape(l)}</span>`).join('');
    el.innerHTML = html;
    zcCacheSet(cacheKey, html);
  } catch (err) {
    if (!cached) el.innerHTML = `<span class="chip">Python</span><span class="chip">R</span><span class="chip">SQL</span>`;
  }
}

/* Re-run whatever feed loaders are active on this page when the language
   toggles, so dynamic content matches the static copy around it. */
document.addEventListener('zc:langchange', () => {
  document.querySelectorAll('[data-feed="gh-activity"]').forEach(el => zcLoadGithubActivity(el.id, +el.dataset.count || 4));
  document.querySelectorAll('[data-feed="gh-repos"]').forEach(el => zcLoadGithubRepos(el.id, +el.dataset.count || 6));
  document.querySelectorAll('[data-feed="medium"]').forEach(el => zcLoadMediumArticles(el.id, +el.dataset.count || 3));
  document.querySelectorAll('[data-feed="kaggle"]').forEach(el => zcLoadKaggleKernels(el.id, +el.dataset.count || 6));
  document.querySelectorAll('[data-feed="books"]').forEach(el => zcLoadBooks(el.id));
  document.querySelectorAll('[data-feed="projects"]').forEach(el => zcLoadProjects(el.id));
  document.querySelectorAll('[data-feed="courses"]').forEach(el => zcLoadCourses(el.id));
  document.querySelectorAll('[data-feed="skills"]').forEach(el => zcLoadSkills(el.id));
  document.querySelectorAll('[data-feed="gh-langs"]').forEach(el => zcLoadGithubLanguages(el.id, +el.dataset.count || 6));
  document.querySelectorAll('[data-feed="journal"]').forEach(el => zcLoadMediumJournal(el.id, +el.dataset.count || 6));
});
/* Note: initial page load is covered too — i18n.js fires zc:langchange
   once on DOMContentLoaded while applying the saved/browser language,
   which is what triggers the very first render of every feed above. */
