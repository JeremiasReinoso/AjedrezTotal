import { readFile } from 'node:fs/promises';
import { sql } from '@vercel/postgres';

const schema = await readFile(new URL('../db/schema.sql', import.meta.url), 'utf8');
const statements = schema
  .split(';')
  .map((statement) => statement.replace(/--.*$/gm, '').trim())
  .filter(Boolean);

for (const statement of statements) {
  await sql.query(statement);
}

console.log(`Esquema aplicado: ${statements.length} sentencias.`);
