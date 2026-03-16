import { pikkuAuth } from '#pikku/pikku-types.gen.js'

export const isManager = pikkuAuth({
  name: 'isManager',
  description: 'Requires Engineering Manager or CTO role',
  func: async (_services, session) => {
    return session?.role === 'em' || session?.role === 'cto'
  },
})

export const isCTO = pikkuAuth({
  name: 'isCTO',
  description: 'Requires CTO role',
  func: async (_services, session) => {
    return session?.role === 'cto'
  },
})
