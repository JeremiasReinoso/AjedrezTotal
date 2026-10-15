/** Revela cada tablero cuando el iframe externo termina de cargar. */
(function () {
  'use strict';
  document.querySelectorAll('.lichess-frame iframe').forEach(function (frame) {
    frame.addEventListener('load', function () {
      var container = frame.closest('.lichess-frame');
      if (container) container.classList.add('is-loaded');
    });
  });
}());
