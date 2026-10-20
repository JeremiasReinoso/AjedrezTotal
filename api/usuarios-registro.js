const { sql } = require('@vercel/postgres');
const { hashPassword, createSession, setSessionCookie } = require('./_lib/auth');

const clean = (value) => typeof value === 'string' ? value.trim() : '';
const respond = (res, status, body) => res.status(status).json(body);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return respond(res, 405, { error: 'Método no permitido.' });
  let data;
  try { data = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {}); } catch (_) { return respond(res, 400, { error: 'El cuerpo de la solicitud no es válido.' }); }
  const nombre = clean(data.nombre);
  const correo = clean(data.correo).toLowerCase();
  const password = typeof data.password === 'string' ? data.password : '';
  if (nombre.length < 2 || nombre.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) || correo.length > 254 || password.length < 8 || password.length > 200) {
    return respond(res, 400, { error: 'Nombre, correo o contraseña inválidos. La contraseña debe tener al menos 8 caracteres.' });
  }
  try {
    const result = await sql`INSERT INTO users (email, password_hash, display_name) VALUES (${correo}, ${hashPassword(password)}, ${nombre}) RETURNING id, email, display_name, role`;
    const session = await createSession(result.rows[0].id);
    setSessionCookie(res, session);
    return respond(res, 201, { user: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') return respond(res, 409, { error: 'Ya existe una cuenta con ese correo.' });
    console.error('register_error', error);
    return respond(res, 503, { error: 'La base de datos no está disponible.' });
  }
};
