const { sql } = require('@vercel/postgres');
const { hashPassword, digest } = require('./_lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido.' });
  let data;
  try { data = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {}); } catch (_) { return res.status(400).json({ error: 'El cuerpo de la solicitud no es válido.' }); }
  const token = typeof data.token === 'string' ? data.token.trim() : '';
  const password = typeof data.password === 'string' ? data.password : '';
  if (!/^[a-f0-9]{64}$/.test(token) || password.length < 8 || password.length > 200) return res.status(400).json({ error: 'El enlace o la contraseña no son válidos.' });
  try {
    const result = await sql`SELECT id, user_id FROM password_reset_tokens WHERE token_hash = ${digest(token)} AND used_at IS NULL AND expires_at > NOW()`;
    if (!result.rows[0]) return res.status(400).json({ error: 'El enlace de recuperación venció o ya fue utilizado.' });
    await sql`UPDATE users SET password_hash = ${hashPassword(password)}, updated_at = NOW() WHERE id = ${result.rows[0].user_id}`;
    await sql`UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ${result.rows[0].id}`;
    await sql`DELETE FROM sessions WHERE user_id = ${result.rows[0].user_id}`;
    return res.status(200).json({ ok: true, message: 'Contraseña actualizada. Iniciá sesión nuevamente.' });
  } catch (error) {
    console.error('password_reset_confirm_error', error);
    return res.status(503).json({ error: 'No se pudo actualizar la contraseña.' });
  }
};
