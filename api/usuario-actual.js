const { currentUser } = require('./_lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido.' });
  try {
    const user = await currentUser(req);
    return res.status(200).json({ user });
  } catch (error) {
    console.error('current_user_error', error);
    return res.status(503).json({ error: 'La base de datos no está disponible.' });
  }
};
