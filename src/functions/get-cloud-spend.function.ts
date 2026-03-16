import { pikkuFunc } from '#pikku/pikku-types.gen.js'
import { isManager } from '../permissions.js'

export const getCloudSpend = pikkuFunc<
  { teamId?: string; divisionId?: string },
  any
>({
  permissions: { isManager },
  func: async ({ db }, input, { session }) => {
    let query = db.selectFrom('cloudSpend').selectAll()

    if (session.role === 'em') {
      query = query.where('divisionId', '=', session.divisionId)
    }

    if (input.teamId) {
      query = query.where('teamId', '=', input.teamId)
    }
    if (input.divisionId) {
      query = query.where('divisionId', '=', input.divisionId)
    }

    const spend = await query.execute()

    const totals = {
      mtd: spend.reduce((sum, s) => sum + s.mtd, 0),
      budget: spend.reduce((sum, s) => sum + s.budget, 0),
      forecast: spend.reduce((sum, s) => sum + s.forecast, 0),
    }

    return { spend, totals }
  },
})
