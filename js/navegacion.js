/**
 * Controla la apertura del menú móvil y su cierre al elegir un enlace.
 * Usa los elementos presentes en el documento actual y actualiza aria-expanded para accesibilidad.
 */
(function () {
  'use strict';
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav-links');
  if (nav) {
    var homeLink = nav.parentElement.querySelector('.brand');
    var prefix = homeLink ? homeLink.getAttribute('href').replace(/index\.html$/, '') : '';
    var activeLink = nav.querySelector('[aria-current]'), current = 'index';
    if (activeLink) { var activeHref = activeLink.getAttribute('href') || ''; current = activeHref.replace(/^\.\.\//, '').replace(/\/index\.html$/, '').replace(/^index\.html$/, 'index'); if (activeHref === 'index.html' && prefix) current = location.pathname.replace(/\/$/, '').split('/').slice(-2, -1)[0]; }
    var items = [['index.html', 'Inicio', 'index'], ['entrenadores/index.html', 'Entrenadores', 'entrenadores'], ['aperturas/index.html', 'Aperturas', 'aperturas'], ['entrenar/index.html', 'Entrená y aprendé', 'entrenar'], ['biblioteca/index.html', 'Biblioteca', 'biblioteca'], ['torneos/index.html', 'Torneos', 'torneos'], ['incorporar-entrenador/index.html', 'Sumate', 'incorporar-entrenador'], ['cuenta/index.html', 'Cuenta', 'cuenta']];
    nav.innerHTML = items.map(function (item) { return '<a ' + (current === item[2] ? 'aria-current="page" ' : '') + (item[2] === 'incorporar-entrenador' ? 'class="button button-primary" ' : '') + 'href="' + prefix + item[0] + '">' + item[1] + '</a>'; }).join('');
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (nav) nav.classList.remove('is-open');
    });
  });
}());
