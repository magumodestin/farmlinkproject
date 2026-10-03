// Put in the <head> of each protected page, after farmlink-api.js:
//   <script src="farmlink-api.js"></script>
//   <script src="role-guard.js" data-role="seller"></script>
// Use data-role="buyer" on dashboard.html,
//     data-role="seller" on sell-products.html,
//     data-role="driver" on driver-dashboard.html.
//
// Checks the real server session, not localStorage. Your PHP must still
// check the role on every seller/driver action.
(function () {
  const requiredRole = document.currentScript.dataset.role;
  FarmLinkAPI.me()
    .then(({ user }) => {
      if (!user || user.role !== requiredRole) {
        location.replace('login_register.html');
      }
    })
    .catch(() => location.replace('login_register.html'));
})();
