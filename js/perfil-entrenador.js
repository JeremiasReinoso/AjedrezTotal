/**
 * Renderiza el perfil seleccionado desde la URL usando datos locales de entrenadores.
 * Distingue la ficha publicada, con contacto por WhatsApp, de las fichas ficticias de demostración.
 */
(function () {
  'use strict';
  var id = new URLSearchParams(location.search).get('id');
  var coach = (window.AjedrezDatos.entrenadores || []).find(function (item) { return item.id === id; });
  var head = document.querySelector('#perfil-encabezado');
  var body = document.querySelector('#perfil-contenido');
  if (!coach) { head.innerHTML = '<h1>Perfil no encontrado</h1><p>El enlace puede estar desactualizado.</p>'; return; }
  if (coach.publicado) renderizarPerfilPublicado(coach, head, body);
  else renderizarPerfilFicticio(coach, head, body);

  /** Genera el marcado de la fotografía publicada o un avatar con iniciales como alternativa. */
  function generarAvatar(coach) {
    var initials = '<span style="background:' + AjedrezUI.initialsColor(coach.iniciales) +
      '" aria-hidden="true">' + AjedrezUI.escape(coach.iniciales) + '</span>';
    if (!coach.imagen) return initials;
    return '<img src="../' + AjedrezUI.escape(coach.imagen) + '" alt="Fotografía de ' +
      AjedrezUI.escape(coach.nombre) +
      '" onerror="this.hidden=true;this.nextElementSibling.hidden=false">' + initials;
  }

  /** Renderiza los datos publicados y ofrece contacto únicamente mediante WhatsApp. */
  function renderizarPerfilPublicado(coach, header, content) {
    document.title = coach.nombre + ' — AjedrezTotal';
    header.innerHTML = '<div style="display:flex;gap:1.5rem;align-items:center;flex-wrap:wrap">' +
      '<div class="profile-avatar">' + generarAvatar(coach) + '</div><div>' +
      '<p class="eyebrow">Entrenador · Perfil publicado</p><h1>' +
      AjedrezUI.escape(coach.nombre) + '</h1><p>' + AjedrezUI.escape(coach.bio) +
      '</p><div class="profile-actions"><a class="button button-primary" href="' +
      AjedrezUI.escape(coach.whatsapp) + '" target="_blank" rel="noopener noreferrer">' +
      'Consultar por WhatsApp</a></div></div></div>';
    content.innerHTML = '<article class="card card-pad"><h2>Presentación</h2><p>' +
      AjedrezUI.escape(coach.bio) + '</p></article><aside class="card card-pad">' +
      '<h2>Contacto</h2><p>Escribí por WhatsApp para consultar disponibilidad y modalidad de clases.</p>' +
      '<a class="button button-primary" href="' + AjedrezUI.escape(coach.whatsapp) +
      '" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp</a></aside>';
  }

  /** Renderiza una ficha ficticia con sus datos de demostración, sin presentarla como publicada. */
  function renderizarPerfilFicticio(coach, header, content) {
    header.innerHTML = '<div style="display:flex;gap:1.5rem;align-items:center;flex-wrap:wrap">' +
      '<div class="profile-avatar" style="background:' +
      AjedrezUI.initialsColor(coach.iniciales) + '">' + AjedrezUI.escape(coach.iniciales) +
      '</div><div><p class="eyebrow">Perfil de demostración · Datos ficticios</p><h1>' +
      AjedrezUI.escape(coach.nombre) + '</h1><p>' + AjedrezUI.escape(coach.bio) +
      '</p></div></div>';
    content.innerHTML = '<article class="card card-pad"><h2>Presentación</h2><p>' +
      AjedrezUI.escape(coach.bio) + '</p><h3>Formación y experiencia</h3><p>' +
      AjedrezUI.escape(coach.titulos) + '. ' + AjedrezUI.escape(coach.experiencia) +
      '.</p><h3>Especialidades</h3><div style="display:flex;gap:.4rem;flex-wrap:wrap">' +
      AjedrezUI.tags(coach.especialidades) + '</div></article>' +
      '<aside class="card card-pad"><h3>Modalidad</h3><p>' +
      AjedrezUI.escape(coach.modalidad.join(' · ')) + '</p><h3>Niveles</h3><p>' +
      AjedrezUI.escape(coach.niveles.join(' · ')) + '</p><h3>Idiomas</h3><p>' +
      AjedrezUI.escape(coach.idiomas.join(' · ')) + '</p><h3>Disponibilidad y tarifa</h3><p>' +
      AjedrezUI.escape(coach.disponibilidad) + '<br>' + AjedrezUI.escape(coach.tarifa) +
      '</p><a class="button button-primary" href="' + AjedrezUI.escape(coach.contacto) +
      '">Consultar contacto</a></aside>';
  }
}());
