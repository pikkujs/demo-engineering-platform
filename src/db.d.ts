import type { ColumnType } from 'kysely'

export interface DB {
  divisions: DivisionsTable
  teams: TeamsTable
  services: ServicesTable
  deployments: DeploymentsTable
  incidents: IncidentsTable
  teamMembers: TeamMembersTable
  cloudSpend: CloudSpendTable
  oncallSchedule: OncallScheduleTable
}

interface DivisionsTable {
  id: string
  name: string
  leadName: string
}

interface TeamsTable {
  id: string
  name: string
  divisionId: string
}

interface ServicesTable {
  id: string
  name: string
  teamId: string
  status: string
  instances: number
  cpuAvg: number
  memoryAvg: number
  uptimePercent: number
  errorRate: number
  p95Latency: number
}

interface DeploymentsTable {
  id: string
  serviceId: string
  serviceName: string
  version: string
  timestamp: string
  status: string
  author: string
  authorTeamId: string
  durationMs: number
  costDelta: number
}

interface IncidentsTable {
  id: string
  title: string
  serviceId: string
  serviceName: string
  severity: number
  status: string
  startedAt: string
  resolvedAt: string | null
  responders: string
  revenueImpact: number | null
  description: string
}

interface TeamMembersTable {
  id: string
  name: string
  role: string
  teamId: string
  email: string
  onCall: number
}

interface CloudSpendTable {
  teamId: string
  teamName: string
  divisionId: string
  mtd: number
  budget: number
  forecast: number
  categories: string
}

interface OncallScheduleTable {
  teamId: string
  teamName: string
  primaryEngineer: string
  secondaryEngineer: string
  startsAt: string
  endsAt: string
}
