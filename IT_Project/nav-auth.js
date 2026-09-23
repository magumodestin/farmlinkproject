function farmlinkInitials(name) {
  if (!name) return '?';
  return name.trim().split(/\s+/).slice(0, 2).map(p => p[0].toUpperCase()).join('');
}

async function farmlinkLogout() {
  if (typeof supabaseClient !== 'undefined') await supabaseClient.auth.signOut();
  document.body.classList.add('page-fade-out');
  setTimeout(() => { window.location.href = 'home.html'; }, 320);
}

function ensureSellerNavLink() {
  document.querySelectorAll('.menu-panel').forEach(panel => {
    if (panel.querySelector('.js-seller-link')) return;
    const link = document.createElement('a');
    link.href = 'sell-Product.html';
    link.className = 'nav-link js-seller-link';
    link.textContent = 'Sell / My Listings';
    const divider = panel.querySelector('.menu-divider');
    if (divider) divider.insertAdjacentElement('beforebegin', link);
    else panel.appendChild(link);
  });
}

// Fetches the signed-in user's Supabase session + profiles row.
// Returns null if there's no session (guest).
async function farmlinkCurrentUser() {
  if (typeof supabaseClient === 'undefined') return null;
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) return null;

  const { data: profile } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return { email: session.user.email, ...profile };
}

async function applyAuthState() {
  const user = await farmlinkCurrentUser();
  document.body.classList.toggle('is-authed', !!user);
  if (!user) return;

  const displayName = user.full_name || user.name || user.email || 'Account';
  document.querySelectorAll('.profile-name').forEach(el => el.textContent = displayName);
  document.querySelectorAll('.profile-role').forEach(el => el.textContent = user.role || '');
  document.querySelectorAll('.profile-avatar').forEach(el => {
    el.innerHTML = user.avatar_url
      ? `<img src="${user.avatar_url}" alt="Profile photo" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`
      : farmlinkInitials(displayName);
  });
  if (user.role === 'seller') ensureSellerNavLink();
}

function initMenuDropdown() {
  const dropdowns = document.querySelectorAll('.menu-dropdown');

  dropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('.menu-trigger');
    const panel = dropdown.querySelector('.menu-panel');
    if (!trigger || !panel) return;

    trigger.addEventListener('click', e => {
      e.stopPropagation();
      const willOpen = !dropdown.classList.contains('open');
      dropdowns.forEach(d => d.classList.remove('open'));
      dropdown.classList.toggle('open', willOpen);
      trigger.setAttribute('aria-expanded', String(willOpen));
    });

    panel.querySelectorAll('a, button').forEach(item => {
      item.addEventListener('click', () => {
        dropdown.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      });
    });
  });

  document.addEventListener('click', () => {
    dropdowns.forEach(d => {
      d.classList.remove('open');
      d.querySelector('.menu-trigger')?.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      dropdowns.forEach(d => {
        d.classList.remove('open');
        d.querySelector('.menu-trigger')?.setAttribute('aria-expanded', 'false');
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  applyAuthState();
  initMenuDropdown();
  document.querySelectorAll('.js-logout').forEach(btn => btn.addEventListener('click', farmlinkLogout));
});
