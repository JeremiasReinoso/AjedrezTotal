const { cookies, digest, clearSessionCookie } = require('./_lib/auth');
const { sql } = require('@vercel/postgres');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido.' });
  const token = cookies(req).ajedrez_session;
  try {
    if (token) await sql`DELETE FROM sessions WHERE token_hash = ${digest(token)}`;
  } catch (error) {
    console.error('logout_error', error);
    return res.status(503).json({ error: 'No se pudo cerrar la sesión.' });
  }
  clearSessionCookie(res);
  return res.status(200).json({ ok: true });
};
