import { pikkuFunc } from '#pikku/pikku-types.gen.js'
import { getTeamIdsForUser } from '../data.js'

export const getOnCall = pikkuFunc<
  { teamId?: string },
  any
>({
  func: async ({ db }, input, { session }) => {
    const teamIds = await getTeamIdsForUser(db, session.role, session.teamId, session.divisionId)

    let query = db.selectFrom('oncallSchedule').selectAll().where('teamId', 'in', teamIds)
    if (input.teamId) {
      query = query.where('teamId', '=', input.teamId)
    }

    const schedule = await query.execute()
    return { schedule }
  },
})
