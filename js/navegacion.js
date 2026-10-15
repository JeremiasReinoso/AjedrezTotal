/**
 * Controla la apertura del menú móvil y su cierre al elegir un enlace.
 * Usa los elementos presentes en el documento actual y actualiza aria-expanded para accesibilidad.
 */
(function () {
  'use strict';
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav-links');
  if (nav && !nav.querySelector('a[href$="entrenar/index.html"]')) {
    var exerciseLink = nav.querySelector('a[href$="ejercicios/index.html"]');
    if (exerciseLink) {
      var trainingLink = document.createElement('a');
      var exercisePath = exerciseLink.getAttribute('href');
      trainingLink.href = exercisePath.replace('ejercicios/index.html', 'entrenar/index.html');
      trainingLink.textContent = 'Entrená y aprendé';
      exerciseLink.insertAdjacentElement('afterend', trainingLink);
    }
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
