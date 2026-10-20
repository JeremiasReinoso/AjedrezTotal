const { sql } = require('@vercel/postgres');
const { currentUser } = require('./_lib/auth');

module.exports = async function handler(req, res) {
  if (!['GET', 'PATCH'].includes(req.method)) return res.status(405).json({ error: 'Método no permitido.' });
  try {
    const user = await currentUser(req);
    if (!user) return res.status(401).json({ error: 'Necesitás iniciar sesión.' });
    if (req.method === 'GET') {
      const result = await sql`SELECT preferences FROM user_preferences WHERE user_id = ${user.id}`;
      return res.status(200).json({ user, preferences: result.rows[0]?.preferences || {} });
    }
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const displayName = typeof data.display_name === 'string' ? data.display_name.trim() : '';
    if (displayName.length < 2 || displayName.length > 120) return res.status(400).json({ error: 'El nombre visible debe tener entre 2 y 120 caracteres.' });
    const preferences = data.preferences && typeof data.preferences === 'object' && !Array.isArray(data.preferences) ? data.preferences : {};
    await sql`UPDATE users SET display_name = ${displayName}, updated_at = NOW() WHERE id = ${user.id}`;
    await sql`INSERT INTO user_preferences (user_id, preferences) VALUES (${user.id}, ${JSON.stringify(preferences)}::jsonb)
      ON CONFLICT (user_id) DO UPDATE SET preferences = EXCLUDED.preferences, updated_at = NOW()`;
    return res.status(200).json({ user: { ...user, display_name: displayName }, preferences });
  } catch (error) {
    console.error('profile_error', error);
    return res.status(503).json({ error: 'La base de datos no está disponible.' });
  }
};
