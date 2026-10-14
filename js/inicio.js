(function () {
  'use strict';
  var coaches = (window.AjedrezDatos && window.AjedrezDatos.entrenadores) || [];
  var exercises = (window.AjedrezDatos && window.AjedrezDatos.ejercicios) || [];
  var coachCount = document.querySelector('#hero-coach-count');
  var exerciseCount = document.querySelector('#hero-exercise-count');
  var coachGrid = document.querySelector('#home-coaches');
  var exerciseGrid = document.querySelector('#home-exercises');
  if (coachCount) coachCount.textContent = coaches.length;
  if (coachCount && coachCount.nextElementSibling) coachCount.nextElementSibling.textContent = 'entrenadores publicados y demostrativos';
  if (exerciseCount) exerciseCount.textContent = exercises.length;
  if (coachGrid) coachGrid.innerHTML = coaches.slice(0, 3).map(function (coach) {
    var image = coach.imagen ? '<div class="coach-avatar coach-avatar-media"><img src="' + AjedrezUI.escape(coach.imagen) + '" alt="Fotografía de ' + AjedrezUI.escape(coach.nombre) + '" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span style="background:' + AjedrezUI.initialsColor(coach.iniciales) + '" aria-hidden="true">' + AjedrezUI.escape(coach.iniciales) + '</span></div>' : '<div class="coach-avatar" style="background:' + AjedrezUI.initialsColor(coach.iniciales) + '" aria-hidden="true">' + AjedrezUI.escape(coach.iniciales) + '</div>';
    return '<article class="card coach-card">' + image + '<div class="card-pad"><span class="tag">' + (coach.publicado ? 'Entrenador · Perfil publicado' : AjedrezUI.escape(coach.especialidades[0] || 'Ajedrez')) + '</span><h3>' + AjedrezUI.escape(coach.nombre) + '</h3><p class="muted">' + AjedrezUI.escape(coach.bio) + '</p><a class="button button-dark" href="entrenadores/perfil.html?id=' + encodeURIComponent(coach.id) + '">' + (coach.publicado ? 'Ver perfil' : 'Consultar perfil') + '</a></div></article>';
  }).join('');
  if (exerciseGrid) exerciseGrid.innerHTML = exercises.slice(0, 3).map(function (exercise) {
    return '<article class="card card-pad exercise-card"><span class="tag">' + AjedrezUI.escape(exercise.dificultad) + ' · ' + AjedrezUI.escape(exercise.categoria) + '</span><h3>' + AjedrezUI.escape(exercise.titulo) + '</h3><p class="muted">Resolvé la posición y recibí una explicación editorial de la idea.</p><a class="button button-primary" href="ejercicios/index.html">Resolver ejercicio →</a></article>';
  }).join('');
}());
