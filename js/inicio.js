(function () {
  'use strict';
  var coaches = (window.AjedrezDatos && window.AjedrezDatos.entrenadores) || [];
  var exercises = (window.AjedrezDatos && window.AjedrezDatos.ejercicios) || [];
  var coachCount = document.querySelector('#hero-coach-count');
  var exerciseCount = document.querySelector('#hero-exercise-count');
  var coachGrid = document.querySelector('#home-coaches');
  var exerciseGrid = document.querySelector('#home-exercises');
  if (coachCount) coachCount.textContent = coaches.length;
  if (exerciseCount) exerciseCount.textContent = exercises.length;
  if (coachGrid) coachGrid.innerHTML = coaches.slice(0, 3).map(function (coach) {
    return '<article class="card coach-card"><div class="coach-avatar" style="background:' + AjedrezUI.initialsColor(coach.iniciales) + '">' + AjedrezUI.escape(coach.iniciales) + '</div><div class="card-pad"><span class="tag">' + AjedrezUI.escape(coach.especialidades[0] || 'Ajedrez') + '</span><h3>' + AjedrezUI.escape(coach.nombre) + '</h3><p class="muted">' + AjedrezUI.escape(coach.bio) + '</p><a class="button button-dark" href="entrenadores/perfil.html?id=' + encodeURIComponent(coach.id) + '">Consultar perfil</a></div></article>';
  }).join('');
  if (exerciseGrid) exerciseGrid.innerHTML = exercises.slice(0, 3).map(function (exercise) {
    return '<article class="card card-pad exercise-card"><span class="tag">' + AjedrezUI.escape(exercise.dificultad) + ' · ' + AjedrezUI.escape(exercise.categoria) + '</span><h3>' + AjedrezUI.escape(exercise.titulo) + '</h3><p class="muted">Resolvé la posición y recibí una explicación editorial de la idea.</p><a class="button button-primary" href="ejercicios/index.html">Resolver ejercicio →</a></article>';
  }).join('');
}());
