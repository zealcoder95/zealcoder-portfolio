/*
 * zealcoder-feeds.js
 * -------------------
 * Pulls live signal from public, keyless APIs so the site reflects
 * real activity instead of hand-edited copy:
 *   - GitHub REST API  (public events / repos, no auth required)
 *   - Medium RSS via rss2json (Medium has no public JSON API / CORS)
 *
 * Both calls are read-only, cached by the browser, and fail silently
 * into a static fallback card if the API is unreachable or rate-limited.
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
const ZC_CACHE_TTL_MS = 15 * 60 * 1000; // 15 min: keeps us well under GitHub's 60 req/hr
                                          // unauthenticated limit and rss2json's free-tier
                                          // rate limit even if several tabs/visitors overlap.

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
  const cacheKey = `zc_cache_medium_${zcLang()}_${count}`;
  const cached = zcCacheGet(cacheKey);
  if (cached) el.innerHTML = cached.html;
  if (cached && (Date.now() - cached.ts < ZC_CACHE_TTL_MS)) return;
  try {
    const feedUrl = encodeURIComponent(`https://medium.com/feed/@${ZC_MEDIUM_USER}`);
    const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${feedUrl}`);
    if (!res.ok) throw new Error('medium feed request failed');
    const data = await res.json();
    if (data.status !== 'ok' || !data.items || !data.items.length) throw new Error('medium feed empty');
    const html = data.items.slice(0, count).map(item => {
      const snippet = zcStripHtml(item.description).slice(0, 110);
      return `<div class="feed-item">
        <a href="${item.link}" target="_blank" rel="noopener">${zcEscape(item.title)}</a>
        ${snippet ? `<p style="color:var(--text-muted);font-size:0.85rem;margin-top:0.3rem;">${zcEscape(snippet)}${snippet.length >= 110 ? '…' : ''}</p>` : ''}
        <div class="feed-meta"><span>${zcTimeAgo(item.pubDate, S)}</span></div>
      </div>`;
    }).join('');
    el.innerHTML = html;
    zcCacheSet(cacheKey, html);
  } catch (err) {
    if (!cached) zcRenderMediumFallback(elId);
  }
}

/* Re-run whatever feed loaders are active on this page when the language
   toggles, so dynamic content matches the static copy around it. */
document.addEventListener('zc:langchange', () => {
  document.querySelectorAll('[data-feed="gh-activity"]').forEach(el => zcLoadGithubActivity(el.id, +el.dataset.count || 4));
  document.querySelectorAll('[data-feed="gh-repos"]').forEach(el => zcLoadGithubRepos(el.id, +el.dataset.count || 6));
  document.querySelectorAll('[data-feed="medium"]').forEach(el => zcLoadMediumArticles(el.id, +el.dataset.count || 3));
});
