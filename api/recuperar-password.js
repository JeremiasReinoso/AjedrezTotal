const crypto = require('node:crypto');
const { sql } = require('@vercel/postgres');
const { digest } = require('./_lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido.' });
  const data = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  const email = typeof data.correo === 'string' ? data.correo.trim().toLowerCase() : '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return res.status(400).json({ error: 'Ingresá un correo válido.' });
  try {
    const result = await sql`SELECT id FROM users WHERE LOWER(email) = ${email}`;
    if (result.rows[0]) {
      const token = crypto.randomBytes(32).toString('hex');
      await sql`DELETE FROM password_reset_tokens WHERE user_id = ${result.rows[0].id} OR expires_at < NOW()`;
      await sql`INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (${result.rows[0].id}, ${digest(token)}, NOW() + INTERVAL '30 minutes')`;
      // No se expone el token. Falta conectar un proveedor de correo transaccional para enviarlo.
      console.info('password_reset_created', { userId: result.rows[0].id });
    }
    return res.status(200).json({ ok: true, message: 'Si existe una cuenta con ese correo, recibirás instrucciones.' });
  } catch (error) {
    console.error('password_reset_error', error);
    return res.status(503).json({ error: 'No se pudo procesar la solicitud.' });
  }
};
