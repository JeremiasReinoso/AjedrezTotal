(function () {
  'use strict';
  var id = new URLSearchParams(location.search).get('id');
  var coach = (window.AjedrezDatos.entrenadores || []).find(function (item) { return item.id === id; });
  var head = document.querySelector('#perfil-encabezado');
  var body = document.querySelector('#perfil-contenido');
  if (!coach) { head.innerHTML = '<h1>Perfil no encontrado</h1><p>El enlace puede estar desactualizado.</p>'; return; }
  document.title = coach.nombre + ' — AjedrezTotal';
  if (coach.publicado) {
    var avatar = coach.imagen ? '<img src="../' + AjedrezUI.escape(coach.imagen) + '" alt="Fotografía de ' + AjedrezUI.escape(coach.nombre) + '" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span style="background:' + AjedrezUI.initialsColor(coach.iniciales) + '" aria-hidden="true">' + AjedrezUI.escape(coach.iniciales) + '</span>' : '<span style="background:' + AjedrezUI.initialsColor(coach.iniciales) + '" aria-hidden="true">' + AjedrezUI.escape(coach.iniciales) + '</span>';
    head.innerHTML = '<div style="display:flex;gap:1.5rem;align-items:center;flex-wrap:wrap"><div class="profile-avatar">' + avatar + '</div><div><p class="eyebrow">Entrenador · Perfil publicado</p><h1>' + AjedrezUI.escape(coach.nombre) + '</h1><p>' + AjedrezUI.escape(coach.bio) + '</p><div class="profile-actions"><a class="button button-primary" href="' + AjedrezUI.escape(coach.whatsapp) + '" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp</a></div></div></div>';
    body.innerHTML = '<article class="card card-pad"><h2>Presentación</h2><p>' + AjedrezUI.escape(coach.bio) + '</p></article><aside class="card card-pad"><h2>Contacto</h2><p><strong>Celular</strong><br>' + AjedrezUI.escape(coach.celular) + '</p><a class="button button-primary" href="' + AjedrezUI.escape(coach.whatsapp) + '" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp</a></aside>';
    return;
  }
  head.innerHTML = '<div style="display:flex;gap:1.5rem;align-items:center;flex-wrap:wrap"><div class="profile-avatar" style="background:' + AjedrezUI.initialsColor(coach.iniciales) + '">' + AjedrezUI.escape(coach.iniciales) + '</div><div><p class="eyebrow">Perfil de demostración · Datos ficticios</p><h1>' + AjedrezUI.escape(coach.nombre) + '</h1><p>' + AjedrezUI.escape(coach.bio) + '</p></div></div>';
  body.innerHTML = '<article class="card card-pad"><h2>Presentación</h2><p>' + AjedrezUI.escape(coach.bio) + '</p><h3>Formación y experiencia</h3><p>' + AjedrezUI.escape(coach.titulos) + '. ' + AjedrezUI.escape(coach.experiencia) + '.</p><h3>Especialidades</h3><div style="display:flex;gap:.4rem;flex-wrap:wrap">' + AjedrezUI.tags(coach.especialidades) + '</div></article><aside class="card card-pad"><h3>Modalidad</h3><p>' + AjedrezUI.escape(coach.modalidad.join(' · ')) + '</p><h3>Niveles</h3><p>' + AjedrezUI.escape(coach.niveles.join(' · ')) + '</p><h3>Idiomas</h3><p>' + AjedrezUI.escape(coach.idiomas.join(' · ')) + '</p><h3>Disponibilidad y tarifa</h3><p>' + AjedrezUI.escape(coach.disponibilidad) + '<br>' + AjedrezUI.escape(coach.tarifa) + '</p><a class="button button-primary" href="' + AjedrezUI.escape(coach.contacto) + '">Consultar contacto</a></aside>';
}());
