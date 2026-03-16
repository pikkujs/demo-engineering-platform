import { pikkuFunc } from '#pikku/pikku-types.gen.js'
import { getTeamIdsForUser } from '../data.js'

export const getServices = pikkuFunc<
  { teamId?: string; status?: string },
  any
>({
  func: async ({ db }, input, { session }) => {
    const teamIds = await getTeamIdsForUser(db, session.role, session.teamId, session.divisionId)

    let query = db.selectFrom('services').selectAll().where('teamId', 'in', teamIds)

    if (input.teamId) {
      query = query.where('teamId', '=', input.teamId)
    }
    if (input.status) {
      query = query.where('status', '=', input.status)
    }

    const services = await query.execute()
    return { services }
  },
})
