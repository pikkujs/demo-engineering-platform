import { pikkuFunc } from '#pikku/pikku-types.gen.js'
import { NotFoundError } from '@pikku/core/errors'
import { isManager } from '../permissions.js'

export const updateService = pikkuFunc<
  { serviceId: string; instances?: number },
  any
>({
  permissions: { isManager },
  func: async ({ db }, input) => {
    const service = await db.selectFrom('services').selectAll().where('id', '=', input.serviceId).executeTakeFirst()
    if (!service) {
      throw new NotFoundError(`Service ${input.serviceId} not found.`)
    }

    if (input.instances !== undefined) {
      await db.updateTable('services').set({ instances: input.instances }).where('id', '=', input.serviceId).execute()
    }

    const updated = await db.selectFrom('services').selectAll().where('id', '=', input.serviceId).executeTakeFirstOrThrow()
    return { service: updated }
  },
})
