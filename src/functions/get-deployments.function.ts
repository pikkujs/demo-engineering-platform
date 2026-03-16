import { pikkuFunc } from '#pikku/pikku-types.gen.js'
import { getTeamIdsForUser } from '../data.js'

export const getDeployments = pikkuFunc<
  { serviceId?: string; status?: string; limit?: number },
  any
>({
  func: async ({ db }, input, { session }) => {
    const teamIds = await getTeamIdsForUser(db, session.role, session.teamId, session.divisionId)

    let query = db.selectFrom('deployments').selectAll().where('authorTeamId', 'in', teamIds).orderBy('timestamp', 'desc')

    if (input.serviceId) {
      query = query.where('serviceId', '=', input.serviceId)
    }
    if (input.status) {
      query = query.where('status', '=', input.status)
    }
    if (input.limit) {
      query = query.limit(input.limit)
    }

    let deployments = await query.execute()

    const total = deployments.length
    const successful = deployments.filter(d => d.status === 'success').length
    const totalCostDelta = session.role !== 'developer'
      ? deployments.reduce((sum, d) => sum + (d.costDelta ?? 0), 0)
      : 0

    // Strip cost data from developer view
    if (session.role === 'developer') {
      deployments = deployments.map(({ costDelta, ...rest }) => rest as any)
    }

    return {
      deployments,
      summary: {
        total,
        successRate: total > 0 ? Math.round((successful / total) * 1000) / 10 : 100,
        totalCostDelta,
      },
    }
  },
})
