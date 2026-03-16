import { pikkuFunc } from '#pikku/pikku-types.gen.js'
import { getTeamIdsForUser } from '../data.js'

export const getIncidents = pikkuFunc<
  { status?: string; severity?: number },
  any
>({
  func: async ({ db }, input, { session }) => {
    const teamIds = await getTeamIdsForUser(db, session.role, session.teamId, session.divisionId)

    const serviceIds = (await db.selectFrom('services').select('id').where('teamId', 'in', teamIds).execute()).map(r => r.id)

    let query = session.role === 'cto'
      ? db.selectFrom('incidents').selectAll()
      : db.selectFrom('incidents').selectAll().where('serviceId', 'in', serviceIds)

    if (input.status) {
      query = query.where('status', '=', input.status)
    }
    if (input.severity) {
      query = query.where('severity', '=', input.severity)
    }

    let incidents = await query.execute()

    // Strip revenue impact for non-CTO
    if (session.role !== 'cto') {
      incidents = incidents.map(({ revenueImpact, ...rest }) => rest as any)
    }

    return { incidents }
  },
})
