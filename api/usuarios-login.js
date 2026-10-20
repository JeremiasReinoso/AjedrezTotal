const { sql } = require('@vercel/postgres');
const { verifyPassword, createSession, setSessionCookie } = require('./_lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido.' });
  let data;
  try { data = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {}); } catch (_) { return res.status(400).json({ error: 'El cuerpo de la solicitud no es válido.' }); }
  const correo = typeof data.correo === 'string' ? data.correo.trim().toLowerCase() : '';
  const password = typeof data.password === 'string' ? data.password : '';
  try {
    const result = await sql`SELECT id, email, display_name, role, password_hash FROM users WHERE LOWER(email) = ${correo}`;
    const user = result.rows[0];
    if (!user || !verifyPassword(password, user.password_hash)) return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
    const session = await createSession(user.id);
    setSessionCookie(res, session);
    return res.status(200).json({ user: { id: user.id, email: user.email, display_name: user.display_name, role: user.role } });
  } catch (error) {
    console.error('login_error', error);
    return res.status(503).json({ error: 'La base de datos no está disponible.' });
  }
};
