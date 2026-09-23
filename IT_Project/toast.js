(function () {
  function ensureContainer() {
    let el = document.getElementById('toastStack');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toastStack';
      el.className = 'toast-stack';
      document.body.appendChild(el);
    }
    return el;
  }

  const ICONS = { success: '✅', error: '⚠️', info: 'ℹ️' };

  window.showToast = function (message, type) {
    type = type && ICONS[type] ? type : 'success';
    const stack = ensureContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span class="toast-icon">${ICONS[type]}</span><span class="toast-msg"></span>`;
    toast.querySelector('.toast-msg').textContent = message; // textContent — no HTML injection from callers
    stack.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    const remove = () => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 250);
    };
    const timer = setTimeout(remove, 3500);
    toast.addEventListener('click', () => { clearTimeout(timer); remove(); });
  };
})();
