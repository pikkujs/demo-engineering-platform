import { When, Then } from '@cucumber/cucumber'
import { strict as assert } from 'assert'
import type { DemoWorld } from '../support/world.js'

When('I request cloud spend data', async function (this: DemoWorld) {
  await this.apiGet('/api/cloud-spend')
})

Then('all spend entries should belong to division {string}', function (this: DemoWorld, divisionId: string) {
  const spend = this.lastBody?.spend ?? []
  assert.ok(spend.length > 0, 'Expected at least one spend entry')
  for (const s of spend) {
    assert.equal(s.divisionId, divisionId, `Spend entry for ${s.teamName} belongs to ${s.divisionId}, expected ${divisionId}`)
  }
})

Then('I should see spend for multiple divisions', function (this: DemoWorld) {
  const spend = this.lastBody?.spend ?? []
  const divisions = new Set(spend.map((s: any) => s.divisionId))
  assert.ok(divisions.size > 1, `Expected multiple divisions, got ${[...divisions].join(', ')}`)
})
