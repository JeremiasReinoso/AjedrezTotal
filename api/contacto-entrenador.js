const DESTINATARIO = process.env.TEACHER_APPLICATION_RECIPIENT || 'reinosojeremias0@gmail.com';
const REMITENTE = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const { sql } = require('@vercel/postgres');
const { currentUser } = require('./_lib/auth');

function respond(res, status, body) {
  res.status(status).json(body);
}

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, function (character) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return respond(res, 405, { error: 'Método no permitido.' });
  }

  if (!process.env.RESEND_API_KEY) {
    return respond(res, 503, { error: 'El servicio de correo no está configurado.' });
  }

  let data;
  try {
    data = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  } catch (_) {
    return respond(res, 400, { error: 'El cuerpo de la solicitud no es válido.' });
  }
  const nombre = clean(data.nombre);
  const correo = clean(data.correo);
  const especialidad = clean(data.especialidad);
  const modalidad = clean(data.modalidad);
  const experiencia = clean(data.experiencia);
  const enlaces = clean(data.enlaces);

  if (!nombre || !correo || !especialidad || !modalidad || !experiencia || data.acepto !== 'on') {
    return respond(res, 400, { error: 'Completá todos los campos obligatorios.' });
  }
  if (nombre.length > 120 || especialidad.length > 120 || modalidad.length > 40 || experiencia.length > 5000 || enlaces.length > 1000) {
    return respond(res, 400, { error: 'Uno de los campos supera el límite permitido.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) || correo.length > 254) {
    return respond(res, 400, { error: 'Ingresá un correo válido.' });
  }
  if (enlaces) {
    try { new URL(enlaces); } catch (_) { return respond(res, 400, { error: 'El enlace profesional no es válido.' }); }
  }

  let user = null;
  try {
    user = await currentUser(req);
    const saved = await sql`INSERT INTO form_submissions (form_type, user_id, email, payload, consent_at)
      VALUES ('teacher_application', ${user ? user.id : null}, ${correo}, ${JSON.stringify({ nombre, correo, especialidad, modalidad, experiencia, enlaces })}::jsonb, NOW()) RETURNING id`;
    var submissionId = saved.rows[0].id;
  } catch (error) {
    console.error('form_persistence_error', error);
    return respond(res, 503, { error: 'No pudimos guardar tu solicitud. Intentá nuevamente en unos minutos.' });
  }

  const text = [
    'Nueva solicitud de incorporación de entrenador en AjedrezTotal',
    '',
    `Nombre público: ${nombre}`,
    `Correo de contacto: ${correo}`,
    `Especialidad: ${especialidad}`,
    `Modalidad: ${modalidad}`,
    `Experiencia y formación: ${experiencia}`,
    `Enlaces profesionales: ${enlaces || 'No indicados'}`
  ].join('\n');
  const html = text.split('\n').map(escapeHtml).join('<br>');

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: REMITENTE,
        to: [DESTINATARIO],
        reply_to: correo,
        subject: `Nueva solicitud de entrenador: ${nombre}`,
        text,
        html
      })
    });
    if (!response.ok) return respond(res, 502, { error: 'La solicitud quedó guardada, pero el correo de aviso no pudo enviarse.' });
    await sql`UPDATE form_submissions SET status = 'email_sent', updated_at = NOW() WHERE id = ${submissionId}`;
    return respond(res, 200, { ok: true });
  } catch (_) {
    return respond(res, 502, { error: 'La solicitud quedó guardada, pero no se pudo conectar con el servicio de correo.' });
  }
};
