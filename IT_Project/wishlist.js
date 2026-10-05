(function () {
  'use strict';

  const TABLE = 'saved_products';
  const $ = (id) => document.getElementById(id);

  let userId = null;
  let saved = [];
  let savedSet = new Set();
  const cardClones = new Map();
  let resolveReady;
  const ready = new Promise((r) => (resolveReady = r));

  const norm = (s) => (s || '').replace(/\s+/g, ' ').trim();

  function cardKey(card) {
    const d = card.dataset || {};
    const id = d.id || d.productId || d.key;
    if (id) return 'id:' + id;
    const h = card.querySelector('.product-info h3, h3');
    return h ? 'name:' + norm(h.textContent).toLowerCase() : null;
  }

  function toast(msg) {
    let t = $('savedToast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'savedToast';
      t.className = 'saved-toast';
      t.setAttribute('role', 'status');
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 2200);
  }

  const storageKey = () => 'farmlinkSaved_' + userId;
  function persistLocal() {
    try { localStorage.setItem(storageKey(), JSON.stringify(saved)); } catch (_) {}
  }
  function loadLocal() {
    try {
      const raw = JSON.parse(localStorage.getItem(storageKey()) || '[]');
      if (Array.isArray(raw)) setList(raw);
    } catch (_) {}
  }
  function setList(list) {
    saved = list.slice();
    savedSet = new Set(saved);
  }

  function setHeartState(heart, on) {
    const flag = on ? '1' : '0';
    if (heart.dataset.saved === flag) return;
    if (heart.dataset.glyph === undefined) heart.dataset.glyph = heart.querySelector('svg') ? '' : heart.textContent;
    heart.dataset.saved = flag;
    heart.classList.toggle('liked', on);
    heart.setAttribute('role', 'button');
    heart.setAttribute('tabindex', '0');
    heart.setAttribute('aria-pressed', String(on));
    heart.setAttribute('aria-label', on ? 'Remove from saved' : 'Save product');
    const svg = heart.querySelector('svg');
    if (svg) svg.style.fill = on ? 'currentColor' : 'none';
    else heart.textContent = on ? '♥\uFE0E' : (heart.dataset.glyph || '♡');
  }

  function updateBadge() {
    const text = saved.length > 99 ? '99+' : String(saved.length);
    document.querySelectorAll('.saved-count').forEach((el) => {
      el.textContent = text;
      el.hidden = saved.length === 0;
    });
  }

  function applyAll() {
    document.querySelectorAll('.product-card').forEach((card) => {
      const heart = card.querySelector('.heart');
      if (!heart) return;
      const key = cardKey(card);
      if (key) setHeartState(heart, savedSet.has(key));
    });
    updateBadge();
  }

  async function setSaved(key, on) {
    await ready;
    if (on === savedSet.has(key)) return;

    if (on) { saved.unshift(key); savedSet.add(key); }
    else { saved = saved.filter((k) => k !== key); savedSet.delete(key); }
    persistLocal();
    applyAll();
    if (isSavedActive()) renderSaved();
    if (on) toast('Saved ♥');

    if (!userId) return;
    try {
      const { error } = on
        ? await supabaseClient
            .from(TABLE)
            .upsert({ user_id: userId, product_key: key }, { onConflict: 'user_id,product_key', ignoreDuplicates: true })
        : await supabaseClient.from(TABLE).delete().eq('user_id', userId).eq('product_key', key);
      if (error) throw error;
    } catch (err) {
      console.error('Saved products sync failed:', err);
      if (on) { saved = saved.filter((k) => k !== key); savedSet.delete(key); }
      else { saved.unshift(key); savedSet.add(key); }
      persistLocal();
      applyAll();
      if (isSavedActive()) renderSaved();
      toast('Could not update saved items. Please try again.');
    }
  }

  const isSavedActive = () => $('saved')?.classList.contains('active');

  function findOriginal(key) {
    for (const card of document.querySelectorAll('.product-card')) {
      if (card.closest('#savedGrid')) continue;
      if (cardKey(card) === key) return card;
    }
    return null;
  }

  function refreshCache() {
    document.querySelectorAll('.product-card').forEach((card) => {
      if (card.closest('#savedGrid')) return;
      const key = cardKey(card);
      if (key && savedSet.has(key)) cardClones.set(key, card.cloneNode(true));
    });
  }

  function renderSaved() {
    const grid = $('savedGrid');
    if (!grid) return;
    refreshCache();
    grid.innerHTML = '';
    let shown = 0;
    saved.forEach((key) => {
      const src = cardClones.get(key);
      if (!src) return;
      grid.appendChild(src.cloneNode(true));
      shown++;
    });
    const empty = $('savedEmpty');
    if (empty) empty.style.display = saved.length === 0 ? 'block' : 'none';
    const count = $('savedPageCount');
    if (count) count.textContent = shown ? shown + (shown === 1 ? ' item' : ' items') : '';
    applyAll();
  }

  function showSaved() {
    document.querySelectorAll('.page').forEach((p) => p.classList.remove('active'));
    $('saved')?.classList.add('active');
    document.querySelectorAll('.nav-link').forEach((a) =>
      a.classList.toggle('active', a.dataset.page === 'saved')
    );
    $('mainMenu')?.classList.remove('open');
    $('menuTriggerBtn')?.setAttribute('aria-expanded', 'false');
    try { history.replaceState(null, '', '#saved'); } catch (_) {}
    window.scrollTo({ top: 0 });
    renderSaved();
  }

  function pathOf(root, el) {
    const path = [];
    while (el && el !== root) {
      const parent = el.parentNode;
      path.unshift(Array.prototype.indexOf.call(parent.children, el));
      el = parent;
    }
    return path;
  }
  function resolvePath(root, path) {
    let el = root;
    for (const i of path) el = el && el.children[i];
    return el;
  }

  function toggleFromHeart(heart) {
    const card = heart.closest('.product-card');
    const key = card && cardKey(card);
    if (key) setSaved(key, !savedSet.has(key));
  }

  document.addEventListener(
    'click',
    (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;

      const navLink = target.closest('a[data-page="saved"]');
      if (navLink) {
        e.preventDefault();
        e.stopPropagation();
        showSaved();
        return;
      }

      const heart = target.closest('.heart');
      if (heart && heart.closest('.product-card')) {
        e.preventDefault();
        e.stopPropagation();
        toggleFromHeart(heart);
        return;
      }

      const clone = target.closest('#savedGrid .product-card');
      if (clone) {
        e.preventDefault();
        e.stopPropagation();
        const original = findOriginal(cardKey(clone));
        if (!original) {
          toast('Open this product from the Home page to add it to your cart.');
          return;
        }
        const mapped = resolvePath(original, pathOf(clone, target));
        if (mapped && typeof mapped.click === 'function') mapped.click();
      }
    },
    true
  );

  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const heart = e.target instanceof Element && e.target.closest('.heart');
      if (heart && heart.closest('.product-card')) {
        e.preventDefault();
        e.stopPropagation();
        toggleFromHeart(heart);
      }
    },
    true
  );

  $('savedBrowseBtn')?.addEventListener('click', () => {
    document.querySelector('.nav-links a[data-page="home"]')?.click();
  });

  let raf = 0;
  new MutationObserver((mutations) => {
    const relevant = mutations.filter(
      (m) => !(m.target.nodeType === 1 && m.target.closest('#savedGrid'))
    );
    if (!relevant.length) return;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      applyAll();
      if (isSavedActive() && relevant.some((m) => m.target.nodeType === 1 && m.target.closest('.product-grid'))) {
        renderSaved();
      }
    });
  }).observe(document.body, { childList: true, subtree: true });

  async function init() {
    try {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (!session) { resolveReady(); return; }
      userId = session.user.id;

      loadLocal();
      applyAll();

      const { data, error } = await supabaseClient
        .from(TABLE)
        .select('product_key')
        .order('created_at', { ascending: false });
      if (error) throw error;

      setList((data || []).map((r) => r.product_key));
      persistLocal();
    } catch (err) {
      console.error('Could not load saved products:', err);
    }
    applyAll();
    resolveReady();
    if (location.hash === '#saved') showSaved();
    else if (isSavedActive()) renderSaved();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();