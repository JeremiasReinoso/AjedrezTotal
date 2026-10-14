/**
 * Filtra y representa el catálogo con los perfiles de datos/entrenadores.js.
 * Los perfiles publicados llevan a contacto por WhatsApp; los ficticios se muestran como demostración.
 */
(function () {
  'use strict';
  var data = (window.AjedrezDatos && window.AjedrezDatos.entrenadores) || [];
  var grid = document.querySelector('#entrenadores-grid'); if (!grid) return;
  var search = document.querySelector('#buscar-entrenador');
  var level = document.querySelector('#filtro-nivel');
  var mode = document.querySelector('#filtro-modalidad');
  var specialty = document.querySelector('#filtro-especialidad');
  var order = document.querySelector('#ordenar');

  /** Genera el avatar con fotografía y reserva las iniciales como alternativa. */
  function generarMedia(coach) {
    var initials = '<span' + (coach.imagen ? ' hidden' : '') + ' style="background:' + AjedrezUI.initialsColor(coach.iniciales) +
      '" aria-hidden="true">' + AjedrezUI.escape(coach.iniciales) + '</span>';
    if (!coach.imagen) {
      return '<div class="coach-avatar" style="background:' +
        AjedrezUI.initialsColor(coach.iniciales) + '" aria-hidden="true">' +
        AjedrezUI.escape(coach.iniciales) + '</div>';
    }
    return '<div class="coach-avatar coach-avatar-media"><img src="../' +
      AjedrezUI.escape(coach.imagen) + '" alt="Fotografía de ' +
      AjedrezUI.escape(coach.nombre) +
      '" onerror="this.hidden=true;this.nextElementSibling.hidden=false">' +
      initials + '</div>';
  }

  /** Devuelve la tarjeta pública, con acceso a su perfil y contacto por WhatsApp. */
  function tarjetaPublicada(coach) {
    return '<article class="card coach-card"><div class="coach-card-media">' +
      generarMedia(coach) + '</div><div class="card-pad"><div class="coach-card-heading">' +
      '<div><span class="tag">Entrenador</span><h3>' + AjedrezUI.escape(coach.nombre) +
      '</h3><p class="muted">Perfil publicado</p></div></div><p>' +
      AjedrezUI.escape(coach.bio) + '</p><div class="coach-actions">' +
      '<a class="button button-dark" href="perfil.html?id=' + encodeURIComponent(coach.id) +
      '">Ver perfil</a><a class="button button-quiet" href="' +
      AjedrezUI.escape(coach.whatsapp) +
      '" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp</a>' +
      '</div></div></article>';
  }

  /** Devuelve una tarjeta de demostración con la información ficticia del perfil. */
  function tarjetaFicticia(coach) {
    return '<article class="card coach-card"><div class="coach-avatar" style="background:' +
      AjedrezUI.initialsColor(coach.iniciales) + '">' + AjedrezUI.escape(coach.iniciales) +
      '</div><div class="card-pad"><div style="display:flex;justify-content:space-between;gap:1rem">' +
      '<div><h3>' + AjedrezUI.escape(coach.nombre) + '</h3><p class="muted">' +
      AjedrezUI.escape(coach.experiencia) + '</p></div>' +
      (coach.destacado ? '<span class="tag">Destacado</span>' : '') + '</div><p>' +
      AjedrezUI.escape(coach.bio) + '</p><div style="display:flex;flex-wrap:wrap;gap:.35rem">' +
      AjedrezUI.tags(coach.especialidades) + '</div><p class="muted" ' +
      'style="margin-top:1rem;font-size:.9rem">' +
      AjedrezUI.escape(coach.modalidad.join(' · ')) + ' · ' +
      AjedrezUI.escape(coach.niveles.join(' · ')) +
      '</p><a class="button button-dark" href="perfil.html?id=' +
      encodeURIComponent(coach.id) + '">Ver perfil</a></div></article>';
  }

  /** Devuelve el marcado de tarjeta adecuado según si el perfil está publicado. */
  function generarTarjeta(coach) {
    return coach.publicado ? tarjetaPublicada(coach) : tarjetaFicticia(coach);
  }

  /** Filtra, ordena y actualiza las tarjetas y el contador visible del catálogo. */
  function renderizarCatalogo() {
    var term = (search.value || '').toLowerCase().trim();
    var list = data.filter(function (coach) {
      return (!term || [coach.nombre, coach.bio].concat(coach.especialidades || [])
        .join(' ').toLowerCase().includes(term)) &&
        (!level.value || (coach.niveles || []).includes(level.value)) &&
        (!mode.value || (coach.modalidad || []).includes(mode.value)) &&
        (!specialty.value || (coach.especialidades || []).includes(specialty.value));
    });
    if (order.value === 'nombre') {
      list.sort(function (first, second) { return first.nombre.localeCompare(second.nombre); });
    }
    if (order.value === 'destacado') {
      list.sort(function (first, second) {
        return Number(second.publicado || second.destacado) -
          Number(first.publicado || first.destacado);
      });
    }
    grid.innerHTML = list.length ? list.map(generarTarjeta).join('') :
      '<div class="empty-state" style="grid-column:1/-1"><h3>No encontramos coincidencias</h3>' +
      '<p>Probá quitar algún filtro o buscar por otra especialidad.</p></div>';
    var count = document.querySelector('#resultado-count');
    if (count) count.textContent = list.length + ' perfiles disponibles';
  }

  [search, level, mode, specialty, order].forEach(function (input) {
    input.addEventListener('input', renderizarCatalogo);
    input.addEventListener('change', renderizarCatalogo);
  });
  renderizarCatalogo();
}());
