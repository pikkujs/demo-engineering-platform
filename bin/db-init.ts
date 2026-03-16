import Database from 'better-sqlite3'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export function initDatabase(dbPath: string) {
  const db = new Database(dbPath)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  const sqlDir = join(__dirname, '..', 'sql')

  const schema = readFileSync(join(sqlDir, '001-schema.sql'), 'utf-8')
  db.exec(schema)

  const seed = readFileSync(join(sqlDir, '002-seed.sql'), 'utf-8')
  db.exec(seed)

  return db
}
