// theme.js
// Site-wide dark/light mode, shared by every page. Keeps a single source of
// truth (localStorage 'theme') and applies/reads it the same way
// login_register.js already does, so switching the theme on any page stays
// in sync everywhere else.
//
// Any toggle switch on the page just needs class="js-theme-switch" on an
// <input type="checkbox">; this file wires it up and keeps it checked/
// unchecked to match the current theme automatically.

(function () {
  function isDark() {
    return localStorage.getItem('theme') === 'dark';
  }

  function syncSwitches(dark) {
    document.querySelectorAll('.js-theme-switch').forEach(el => { el.checked = dark; });
  }

  function apply(dark) {
    if (document.body) document.body.classList.toggle('dark', dark);
    syncSwitches(dark);
  }

  function setTheme(dark) {
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    apply(dark);
  }

  function toggleTheme() {
    setTheme(!isDark());
  }

  function wireSwitches() {
    document.querySelectorAll('.js-theme-switch').forEach(el => {
      if (el.dataset.themeWired) return;
      el.dataset.themeWired = '1';
      el.addEventListener('change', () => setTheme(el.checked));
    });
  }

  // Also cover the plain icon-button style toggle (🌙/🌞) used on some
  // pages, e.g. <button class="js-theme-toggle-btn">.
  function wireButtons() {
    document.querySelectorAll('.js-theme-toggle-btn').forEach(el => {
      if (el.dataset.themeWired) return;
      el.dataset.themeWired = '1';
      el.textContent = isDark() ? '🌞' : '🌙';
      el.addEventListener('click', () => {
        toggleTheme();
        el.textContent = isDark() ? '🌞' : '🌙';
      });
    });
  }

  window.FarmLinkTheme = { isDark, set: setTheme, toggle: toggleTheme, wire: () => { wireSwitches(); wireButtons(); } };

  apply(isDark());
  document.addEventListener('DOMContentLoaded', () => {
    apply(isDark());
    wireSwitches();
    wireButtons();
  });
})();
