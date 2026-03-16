import type {
  CoreConfig,
  CoreServices,
  CoreSingletonServices,
  CoreUserSession,
} from '@pikku/core'
import type { Kysely } from 'kysely'
import type { DB } from './db.js'
import type { Role } from './types.js'

export interface Config extends CoreConfig {
  port: number
  hostname: string
  authSecret: string
}

export interface UserSession extends CoreUserSession {
  userId: string
  name: string
  role: Role
  teamId: string
  divisionId: string
}

export interface SingletonServices extends CoreSingletonServices<Config> {
  db: Kysely<DB>
}

export interface Services extends CoreServices<SingletonServices> {}
