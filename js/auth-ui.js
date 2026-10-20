(function () {
  'use strict';
  var nav = document.querySelector('.nav-links');
  if (!nav) return;
  var base = (window.AjedrezConfig && window.AjedrezConfig.apiBase) || '';
  var link = document.createElement('a');
  link.href = window.location.pathname.indexOf('/entrenar/') >= 0 || window.location.pathname.indexOf('/cuenta/') >= 0 ? '../cuenta/index.html' : 'cuenta/index.html';
  link.textContent = 'Cuenta';
  link.dataset.accountLink = 'true';
  nav.appendChild(link);
  fetch(base + '/api/usuario-actual', { credentials: 'include', headers: { Accept: 'application/json' } })
    .then(function (response) { return response.ok ? response.json() : { user: null }; })
    .then(function (data) {
      if (data.user) { link.textContent = data.user.display_name || 'Mi cuenta'; link.classList.add('is-authenticated'); }
    }).catch(function () {});
}());
