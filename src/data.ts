import type { Kysely } from 'kysely'
import type { DB } from './db.js'

export async function getTeamIdsForUser(db: Kysely<DB>, role: string, teamId: string, divisionId: string): Promise<string[]> {
  if (role === 'cto') {
    const rows = await db.selectFrom('teams').select('id').execute()
    return rows.map(r => r.id)
  }
  if (role === 'em') {
    const rows = await db.selectFrom('teams').select('id').where('divisionId', '=', divisionId).execute()
    return rows.map(r => r.id)
  }
  return [teamId]
}
