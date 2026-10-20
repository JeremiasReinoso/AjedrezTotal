const { sql } = require('@vercel/postgres');
const { currentUser } = require('./_lib/auth');

function valid(data) {
  const allowed = ['presencial', 'online', 'general'];
  if (!data || typeof data.title !== 'string' || data.title.trim().length < 3) return 'El título es obligatorio.';
  if (!allowed.includes(data.category)) return 'La categoría no es válida.';
  if (typeof data.event_name !== 'string' || data.event_name.trim().length < 2) return 'El nombre del evento es obligatorio.';
  if (typeof data.organizer !== 'string' || data.organizer.trim().length < 2) return 'El organizador es obligatorio.';
  if (typeof data.summary !== 'string' || data.summary.trim().length < 10) return 'El resumen es obligatorio.';
  if (data.official_url && !/^https:\/\//i.test(data.official_url)) return 'El enlace oficial debe usar HTTPS.';
  return null;
}

function slugify(value) { return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80); }

module.exports = async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const result = await sql`SELECT id, slug, title, category, event_name, organizer, location, event_date, cover_image, summary, body, official_url, published, created_at, updated_at FROM tournaments WHERE published = TRUE ORDER BY event_date DESC NULLS LAST, created_at DESC`;
      return res.status(200).json({ tournaments: result.rows });
    }
    const user = await currentUser(req);
    if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Se requiere una cuenta administradora.' });
    if (!['POST', 'PATCH'].includes(req.method)) return res.status(405).json({ error: 'Método no permitido.' });
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {}), error = valid(data);
    if (error) return res.status(400).json({ error });
    const body = data.body && typeof data.body === 'object' ? data.body : {};
    if (req.method === 'POST') {
      const result = await sql`INSERT INTO tournaments (slug, title, category, event_name, organizer, location, event_date, cover_image, summary, body, official_url, published, created_by) VALUES (${slugify(data.title) + '-' + Date.now().toString(36)}, ${data.title.trim()}, ${data.category}, ${data.event_name.trim()}, ${data.organizer.trim()}, ${data.location || null}, ${data.event_date || null}, ${data.cover_image || null}, ${data.summary.trim()}, ${JSON.stringify(body)}::jsonb, ${data.official_url || null}, ${Boolean(data.published)}, ${user.id}) RETURNING *`;
      return res.status(201).json({ tournament: result.rows[0] });
    }
    if (!data.id) return res.status(400).json({ error: 'Falta el identificador.' });
    const result = await sql`UPDATE tournaments SET title=${data.title.trim()}, category=${data.category}, event_name=${data.event_name.trim()}, organizer=${data.organizer.trim()}, location=${data.location || null}, event_date=${data.event_date || null}, cover_image=${data.cover_image || null}, summary=${data.summary.trim()}, body=${JSON.stringify(body)}::jsonb, official_url=${data.official_url || null}, published=${Boolean(data.published)}, updated_at=NOW() WHERE id=${data.id} RETURNING *`;
    return result.rows[0] ? res.status(200).json({ tournament: result.rows[0] }) : res.status(404).json({ error: 'Crónica no encontrada.' });
  } catch (error) { console.error('tournaments_error', error); return res.status(503).json({ error: 'La base de datos no está disponible o falta aplicar el esquema.' }); }
};
