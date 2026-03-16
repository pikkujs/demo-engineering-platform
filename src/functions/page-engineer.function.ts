import { pikkuFunc } from '#pikku/pikku-types.gen.js'
import { NotFoundError } from '@pikku/core/errors'
import { isManager } from '../permissions.js'

export const pageEngineer = pikkuFunc<
  { userId: string; reason: string },
  any
>({
  permissions: { isManager },
  func: async ({ db }, input) => {
    const target = await db.selectFrom('teamMembers').selectAll().where('id', '=', input.userId).executeTakeFirst()
    if (!target) {
      throw new NotFoundError(`Engineer ${input.userId} not found.`)
    }

    return {
      message: `Paged ${target.name} (${target.email}) with reason: "${input.reason}". Notification sent via PagerDuty.`,
      paged: target.name,
    }
  },
})
