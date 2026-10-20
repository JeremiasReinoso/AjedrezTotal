const crypto = require('node:crypto');
const { sql } = require('@vercel/postgres');

const SESSION_DAYS = 30;

function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const derived = crypto.scryptSync(password, salt, 64);
  return `scrypt$${salt.toString('hex')}$${derived.toString('hex')}`;
}

function verifyPassword(password, encoded) {
  const [, saltHex, hashHex] = String(encoded).split('$');
  if (!saltHex || !hashHex) return false;
  const actual = crypto.scryptSync(password, Buffer.from(saltHex, 'hex'), 64);
  const expected = Buffer.from(hashHex, 'hex');
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

function digest(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function cookies(req) {
  return Object.fromEntries((req.headers.cookie || '').split(';').filter(Boolean).map((part) => {
    const index = part.indexOf('=');
    return [part.slice(0, index).trim(), decodeURIComponent(part.slice(index + 1).trim())];
  }));
}

async function createSession(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86400000).toISOString();
  await sql`DELETE FROM sessions WHERE expires_at < NOW()`;
  await sql`INSERT INTO sessions (user_id, token_hash, expires_at) VALUES (${userId}, ${digest(token)}, ${expiresAt})`;
  return { token, expiresAt };
}

async function currentUser(req) {
  const token = cookies(req).ajedrez_session;
  if (!token) return null;
  const result = await sql`SELECT u.id, u.email, u.display_name, u.role
    FROM sessions s JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = ${digest(token)} AND s.expires_at > NOW()`;
  return result.rows[0] || null;
}

function setSessionCookie(res, session) {
  res.setHeader('Set-Cookie', `ajedrez_session=${encodeURIComponent(session.token)}; Path=/; Max-Age=${SESSION_DAYS * 86400}; HttpOnly; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);
}

function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', 'ajedrez_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax' + (process.env.NODE_ENV === 'production' ? '; Secure' : ''));
}

module.exports = { hashPassword, verifyPassword, digest, cookies, createSession, currentUser, setSessionCookie, clearSessionCookie };
