(function () {
  let ctx = null;
  function getCtx() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ctx) ctx = new AC();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function playTones(tones, baseGain) {
    const audio = getCtx();
    if (!audio) return;
    const now = audio.currentTime;
    tones.forEach(t => {
      const start = now + (t.delay || 0);
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.type = t.type || 'sine';
      osc.frequency.setValueAtTime(t.freq, start);
      if (t.freqTo) osc.frequency.linearRampToValueAtTime(t.freqTo, start + t.duration);
      const peak = t.gain != null ? t.gain : baseGain;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(peak, start + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + t.duration);
      osc.connect(gain).connect(audio.destination);
      osc.start(start);
      osc.stop(start + t.duration + 0.03);
    });
  }

  const ROLES = {
    primary: () => playTones([{ freq: 520, freqTo: 760, duration: .10, type: 'sine' }], .09),
    secondary: () => playTones([{ freq: 400, duration: .06, type: 'triangle' }], .05),
    nav: () => playTones([{ freq: 600, duration: .045, type: 'square' }], .035),
    toggle: () => playTones([
      { freq: 500, duration: .045, type: 'sine' },
      { freq: 640, duration: .05, delay: .05, type: 'sine' }
    ], .045),
    tap: () => playTones([{ freq: 450, duration: .035, type: 'square' }], .03),
    approve: () => playTones([
      { freq: 523, duration: .09, type: 'sine' },
      { freq: 659, duration: .16, delay: .09, type: 'sine' }
    ], .09),
    reject: () => playTones([{ freq: 380, freqTo: 220, duration: .16, type: 'sawtooth' }], .06)
  };

  function playRole(role) {
    const fn = ROLES[role];
    if (!fn) return;
    try { fn(); } catch (e) {  }
  }
  window.FarmSound = { play: playRole };

  function roleFor(el) {
    if (el.dataset && el.dataset.sound) return el.dataset.sound === 'none' ? null : el.dataset.sound;
    const cl = el.classList;
    if (cl.contains('btn-approve')) return 'approve';
    if (cl.contains('btn-reject') || cl.contains('js-logout') || cl.contains('menu-logout-item') || cl.contains('remove-item')) return 'reject';
    if (cl.contains('btn-reset')) return 'secondary';
    if (cl.contains('btn-primary') || cl.contains('btn-green') || cl.contains('add-cart')) return 'primary';
    if (cl.contains('btn-secondary') || cl.contains('btn-outline') || cl.contains('btn-white-outline')) return 'secondary';
    if (cl.contains('filter-btn') || cl.contains('sell-tab') || cl.contains('admin-tab') || cl.contains('role-chip')) return 'toggle';
    if (cl.contains('nav-link') || cl.contains('view-all') || cl.contains('logo') || cl.contains('cover-guest-link')) return 'nav';
    if (cl.contains('icon-btn') || cl.contains('search-icon') || cl.contains('menu-trigger') || cl.contains('avail-toggle')) return 'tap';
    if (el.tagName === 'BUTTON') return 'secondary';
    if (el.tagName === 'A') return 'nav';
    return null;
  }

  document.addEventListener('click', e => {
    const el = e.target.closest('button, a, [data-sound]');
    if (!el) return;
    const role = roleFor(el);
    if (role) playRole(role);
  }, true);
})();