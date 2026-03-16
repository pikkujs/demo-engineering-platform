import { pikkuFunc } from '#pikku/pikku-types.gen.js'
import { NotFoundError } from '@pikku/core/errors'
import { isManager } from '../permissions.js'

export const updateOnCall = pikkuFunc<
  { teamId: string; primary?: string; secondary?: string },
  any
>({
  permissions: { isManager },
  func: async ({ db }, input) => {
    const entry = await db.selectFrom('oncallSchedule').selectAll().where('teamId', '=', input.teamId).executeTakeFirst()
    if (!entry) {
      throw new NotFoundError(`No on-call schedule found for team ${input.teamId}.`)
    }

    const updates: Record<string, any> = {}
    if (input.primary) {
      const member = await db.selectFrom('teamMembers').selectAll().where('name', '=', input.primary).executeTakeFirst()
      if (!member) throw new NotFoundError(`Engineer "${input.primary}" not found.`)
      updates.primaryEngineer = input.primary
    }
    if (input.secondary) {
      const member = await db.selectFrom('teamMembers').selectAll().where('name', '=', input.secondary).executeTakeFirst()
      if (!member) throw new NotFoundError(`Engineer "${input.secondary}" not found.`)
      updates.secondaryEngineer = input.secondary
    }

    if (Object.keys(updates).length > 0) {
      await db.updateTable('oncallSchedule').set(updates).where('teamId', '=', input.teamId).execute()
    }

    const updated = await db.selectFrom('oncallSchedule').selectAll().where('teamId', '=', input.teamId).executeTakeFirstOrThrow()
    return {
      schedule: updated,
      message: `On-call schedule updated for ${updated.teamName}. Primary: ${updated.primaryEngineer}, Secondary: ${updated.secondaryEngineer}.`,
    }
  },
})
