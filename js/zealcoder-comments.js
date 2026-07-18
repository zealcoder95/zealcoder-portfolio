/*
 * zealcoder-comments.js
 * ----------------------
 * Lightweight comment widgets for books, projects and posts (yazılar +
 * günlük), backed by a public Supabase table (see docs/yorumlar-rehberi.md).
 *
 * How it works:
 *   - Each commentable card gets a small `<div class="zc-comments">` block
 *     (added by zealcoder-feeds.js for dynamic cards, or directly in the
 *     HTML for static cards) carrying `data-item-type` and `data-item-id`.
 *   - This file only needs to know how to render/fetch/submit for a given
 *     (item_type, item_id) pair — it never needs to know which page it's
 *     running on. New commentable content just needs the same data
 *     attributes, nothing else to wire up.
 *   - Uses event delegation on `document`, so it works for cards that get
 *     re-rendered later (language switch, cache refresh) without any
 *     re-initialization step.
 *   - New comments are inserted with is_approved = false by Row Level
 *     Security (visitors cannot set it themselves) and only become visible
 *     once approved from the Supabase Studio table editor. This keeps
 *     spam/abuse off the public site without needing a moderation UI.
 *
 * Anon/publishable key below is safe to expose client-side by design —
 * Supabase enforces access purely through the RLS policies on the table,
 * not by keeping this key secret.
 */

const ZC_SUPABASE_URL = 'https://hrixiibdfnnillakwgqp.supabase.co';
const ZC_SUPABASE_KEY = 'sb_publishable_D6ynDs-HVWNHZX2okK3ZZQ_7jSV-XEx';

const ZC_COMMENTS_STRINGS = {
  tr: {
    toggleShow: n => n > 0 ? `💬 Yorumlar (${n})` : '💬 Yorum yap',
    toggleHide: '💬 Yorumları gizle',
    loading: 'Yorumlar yükleniyor…',
    empty: 'Henüz yorum yok — ilk yorumu siz yazın.',
    unavailable: 'Yorumlar şu an yüklenemedi.',
    namePlaceholder: 'İsminiz',
    bodyPlaceholder: 'Bu kitap/proje/yazı hakkında ne düşünüyorsunuz?',
    submit: 'Gönder',
    submitting: 'Gönderiliyor…',
    sent: 'Teşekkürler! Yorumunuz onaylandıktan sonra burada görünecek.',
    errorGeneric: 'Bir şeyler ters gitti, lütfen tekrar deneyin.',
    errorFields: 'Lütfen isim ve yorum alanlarını doldurun.'
  },
  en: {
    toggleShow: n => n > 0 ? `💬 Comments (${n})` : '💬 Leave a comment',
    toggleHide: '💬 Hide comments',
    loading: 'Loading comments…',
    empty: 'No comments yet — be the first to write one.',
    unavailable: 'Comments could not be loaded right now.',
    namePlaceholder: 'Your name',
    bodyPlaceholder: 'What do you think about this book/project/post?',
    submit: 'Submit',
    submitting: 'Submitting…',
    sent: 'Thanks! Your comment will appear here once approved.',
    errorGeneric: 'Something went wrong, please try again.',
    errorFields: 'Please fill in both your name and a comment.'
  }
};

function zccLang() {
  return (document.documentElement.lang === 'en') ? 'en' : 'tr';
}

function zccEscape(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

function zccTimeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diffMs / 86400000);
  if (days < 1) return zccLang() === 'en' ? 'today' : 'bugün';
  if (days === 1) return zccLang() === 'en' ? 'yesterday' : 'dün';
  if (days < 30) return zccLang() === 'en' ? `${days}d ago` : `${days} gün önce`;
  const months = Math.floor(days / 30);
  return zccLang() === 'en' ? `${months}mo ago` : `${months} ay önce`;
}

/* Returns the markup for one comments widget. itemType is 'book' | 'project' | 'post'.
   itemId just needs to be stable and unique within that type (a JSON id like
   "b1", a static HTML id like "p1"/"e1", or a Medium post URL). */
function zcCommentsWidgetHTML(itemType, itemId) {
  const S = ZC_COMMENTS_STRINGS[zccLang()];
  return `
    <div class="zc-comments" data-item-type="${zccEscape(itemType)}" data-item-id="${zccEscape(itemId)}">
      <button type="button" class="zc-comments-toggle" aria-expanded="false">${S.toggleShow(0)}</button>
      <div class="zc-comments-panel" hidden>
        <div class="zc-comments-list" data-state="idle"></div>
        <form class="zc-comments-form">
          <input type="text" name="name" class="zc-comments-name" maxlength="60" placeholder="${S.namePlaceholder}" required>
          <input type="text" name="website" class="zc-hp" tabindex="-1" autocomplete="off" aria-hidden="true">
          <textarea name="body" class="zc-comments-body" maxlength="1000" rows="3" placeholder="${S.bodyPlaceholder}" required></textarea>
          <div class="zc-comments-form-row">
            <button type="submit" class="btn btn-ghost zc-comments-submit">${S.submit}</button>
            <span class="zc-comments-status" role="status"></span>
          </div>
        </form>
      </div>
    </div>`;
}

async function zccFetchComments(itemType, itemId) {
  const url = `${ZC_SUPABASE_URL}/rest/v1/comments`
    + `?item_type=eq.${encodeURIComponent(itemType)}`
    + `&item_id=eq.${encodeURIComponent(itemId)}`
    + `&is_approved=eq.true`
    + `&select=author_name,body,created_at`
    + `&order=created_at.desc`;
  const res = await fetch(url, {
    headers: { apikey: ZC_SUPABASE_KEY, Authorization: `Bearer ${ZC_SUPABASE_KEY}` }
  });
  if (!res.ok) throw new Error('comments fetch failed');
  return res.json();
}

async function zccSubmitComment(itemType, itemId, name, body) {
  const res = await fetch(`${ZC_SUPABASE_URL}/rest/v1/comments`, {
    method: 'POST',
    headers: {
      apikey: ZC_SUPABASE_KEY,
      Authorization: `Bearer ${ZC_SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal'
    },
    body: JSON.stringify({ item_type: itemType, item_id: itemId, author_name: name, body })
  });
  if (!res.ok) throw new Error('comment submit failed');
}

function zccRenderList(listEl, comments) {
  const S = ZC_COMMENTS_STRINGS[zccLang()];
  if (!comments.length) {
    listEl.innerHTML = `<p class="zc-comments-empty">${S.empty}</p>`;
    return;
  }
  listEl.innerHTML = comments.map(c => `
    <div class="zc-comment">
      <div class="zc-comment-head">
        <span class="zc-comment-author">${zccEscape(c.author_name)}</span>
        <span class="zc-comment-date">${zccTimeAgo(c.created_at)}</span>
      </div>
      <p class="zc-comment-body">${zccEscape(c.body)}</p>
    </div>`).join('');
}

async function zccOpenPanel(widget) {
  const itemType = widget.dataset.itemType;
  const itemId = widget.dataset.itemId;
  const listEl = widget.querySelector('.zc-comments-list');
  const S = ZC_COMMENTS_STRINGS[zccLang()];
  if (listEl.dataset.state !== 'idle') return;
  listEl.dataset.state = 'loading';
  listEl.innerHTML = `<p class="zc-comments-empty">${S.loading}</p>`;
  try {
    const comments = await zccFetchComments(itemType, itemId);
    listEl.dataset.state = 'loaded';
    zccRenderList(listEl, comments);
  } catch (err) {
    listEl.dataset.state = 'error';
    listEl.innerHTML = `<p class="zc-comments-empty">${S.unavailable}</p>`;
  }
}

/* Static cards (the 4 project cards, the 4 archived journal entries) just
   drop a placeholder in the HTML — <div class="zc-comments-slot"
   data-item-type="project" data-item-id="p1"></div> — instead of the full
   widget markup, so nothing here needs to duplicate the bilingual strings
   by hand. Runs once at script load (this file is loaded with `defer`,
   so the DOM is already parsed) and swaps every slot for a real widget. */
function zccInitStaticSlots() {
  document.querySelectorAll('.zc-comments-slot').forEach(slot => {
    const itemType = slot.dataset.itemType;
    const itemId = slot.dataset.itemId;
    if (!itemType || !itemId) return;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = zcCommentsWidgetHTML(itemType, itemId).trim();
    slot.replaceWith(wrapper.firstElementChild);
  });
}
zccInitStaticSlots();

document.addEventListener('click', e => {
  const toggleBtn = e.target.closest('.zc-comments-toggle');
  if (!toggleBtn) return;
  const widget = toggleBtn.closest('.zc-comments');
  const panel = widget.querySelector('.zc-comments-panel');
  const S = ZC_COMMENTS_STRINGS[zccLang()];
  const opening = panel.hidden;
  panel.hidden = !opening;
  toggleBtn.setAttribute('aria-expanded', String(opening));
  if (opening) {
    toggleBtn.textContent = S.toggleHide;
    zccOpenPanel(widget);
  } else {
    const count = widget.querySelectorAll('.zc-comment').length;
    toggleBtn.textContent = S.toggleShow(count);
  }
});

document.addEventListener('submit', e => {
  const form = e.target.closest('.zc-comments-form');
  if (!form) return;
  e.preventDefault();
  const widget = form.closest('.zc-comments');
  const itemType = widget.dataset.itemType;
  const itemId = widget.dataset.itemId;
  const S = ZC_COMMENTS_STRINGS[zccLang()];
  const nameEl = form.querySelector('.zc-comments-name');
  const bodyEl = form.querySelector('.zc-comments-body');
  const honeypot = form.querySelector('.zc-hp');
  const statusEl = form.querySelector('.zc-comments-status');
  const submitBtn = form.querySelector('.zc-comments-submit');
  const name = nameEl.value.trim();
  const body = bodyEl.value.trim();

  if (honeypot && honeypot.value) return; // silently drop bot submissions

  if (!name || !body) {
    statusEl.textContent = S.errorFields;
    statusEl.classList.add('is-error');
    return;
  }
  submitBtn.disabled = true;
  statusEl.classList.remove('is-error');
  statusEl.textContent = S.submitting;
  zccSubmitComment(itemType, itemId, name, body)
    .then(() => {
      statusEl.textContent = S.sent;
      form.reset();
    })
    .catch(() => {
      statusEl.textContent = S.errorGeneric;
      statusEl.classList.add('is-error');
    })
    .finally(() => { submitBtn.disabled = false; });
});

/* Static (hand-written) comment widgets already sitting in the HTML at
   page load — e.g. the four project cards and the four archived journal
   entries — just need their toggle label translated on language switch;
   dynamic ones (books, Medium articles/journal) are re-rendered wholesale
   by zealcoder-feeds.js, which already regenerates fresh widget markup. */
document.addEventListener('zc:langchange', () => {
  document.querySelectorAll('.zc-comments').forEach(widget => {
    const toggleBtn = widget.querySelector('.zc-comments-toggle');
    const panel = widget.querySelector('.zc-comments-panel');
    const listEl = widget.querySelector('.zc-comments-list');
    if (!toggleBtn || !panel) return;
    const S = ZC_COMMENTS_STRINGS[zccLang()];
    const count = listEl ? listEl.querySelectorAll('.zc-comment').length : 0;
    toggleBtn.textContent = panel.hidden ? S.toggleShow(count) : S.toggleHide;
    const nameEl = widget.querySelector('.zc-comments-name');
    const bodyEl = widget.querySelector('.zc-comments-body');
    const submitBtn = widget.querySelector('.zc-comments-submit');
    if (nameEl) nameEl.placeholder = S.namePlaceholder;
    if (bodyEl) bodyEl.placeholder = S.bodyPlaceholder;
    if (submitBtn) submitBtn.textContent = S.submit;
  });
});
