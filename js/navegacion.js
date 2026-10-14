(function () {
  'use strict';
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav-links');
  if (toggle && nav) toggle.addEventListener('click', function () { var open = nav.classList.toggle('is-open'); toggle.setAttribute('aria-expanded', String(open)); });
  document.querySelectorAll('.nav-links a').forEach(function (link) { link.addEventListener('click', function () { if (nav) nav.classList.remove('is-open'); }); });
}());
