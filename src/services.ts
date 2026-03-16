import { ConsoleLogger, LocalSecretService, LocalVariablesService } from '@pikku/core/services'
import { CFWorkerSchemaService } from '@pikku/schema-cfworker'
import { pikkuServices, pikkuWireServices } from '#pikku/pikku-types.gen.js'
import { Kysely, SqliteDialect, CamelCasePlugin } from 'kysely'
import { SerializePlugin } from 'kysely-plugin-serialize'

import { initDatabase } from '../bin/db-init.js'
import type { DB } from './db.js'

export const createSingletonServices = pikkuServices(
  async (config) => {
    const logger = new ConsoleLogger()
    const variables = new LocalVariablesService()
    const secrets = new LocalSecretService(variables)
    const schema = new CFWorkerSchemaService(logger)

    const dbPath = process.env.DB_PATH ?? './data/demo.db'
    const sqliteDb = initDatabase(dbPath)
    const db = new Kysely<DB>({
      dialect: new SqliteDialect({ database: sqliteDb }),
      plugins: [new CamelCasePlugin(), new SerializePlugin()],
    })

    return {
      config,
      variables,
      secrets,
      schema,
      logger,
      db,
    }
  }
)

export const createSessionServices = pikkuWireServices(async () => {
  return {}
})
