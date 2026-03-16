import { pikkuFunc } from '#pikku/pikku-types.gen.js'
import { ForbiddenError } from '@pikku/core/errors'
import { getTeamIdsForUser } from '../data.js'

export const getTeam = pikkuFunc<
  { teamId?: string },
  any
>({
  func: async ({ db }, input, { session }) => {
    const teamIds = await getTeamIdsForUser(db, session.role, session.teamId, session.divisionId)

    if (input.teamId && !teamIds.includes(input.teamId)) {
      throw new ForbiddenError(`You don't have visibility into team ${input.teamId}.`)
    }

    let query = db.selectFrom('teamMembers').selectAll().where('teamId', 'in', teamIds)
    if (input.teamId) {
      query = query.where('teamId', '=', input.teamId)
    }

    const members = await query.execute()
    return { members: members.map(m => ({ ...m, onCall: Boolean(m.onCall) })) }
  },
})
