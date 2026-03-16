export type Role = 'developer' | 'em' | 'cto'

export interface UserSession {
  userId: string
  name: string
  role: Role
  teamId: string
  divisionId: string
}

export interface Service {
  id: string
  name: string
  teamId: string
  status: 'healthy' | 'degraded' | 'down'
  instances: number
  cpuAvg: number
  memoryAvg: number
  uptimePercent: number
  errorRate: number
  p95Latency: number
}

export interface Deployment {
  id: string
  serviceId: string
  serviceName: string
  version: string
  timestamp: string
  status: 'success' | 'rolled_back' | 'failed' | 'in_progress'
  author: string
  authorTeamId: string
  durationMs: number
  costDelta?: number
}

export interface Incident {
  id: string
  title: string
  serviceId: string
  serviceName: string
  severity: 1 | 2 | 3
  status: 'active' | 'investigating' | 'resolved'
  startedAt: string
  resolvedAt?: string
  responders: string[]
  revenueImpact?: number
  description: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  teamId: string
  email: string
  onCall: boolean
}

export interface Team {
  id: string
  name: string
  divisionId: string
}

export interface Division {
  id: string
  name: string
  leadName: string
}

export interface CloudSpend {
  teamId: string
  teamName: string
  divisionId: string
  mtd: number
  budget: number
  forecast: number
  categories: Array<{ name: string; amount: number }>
}

export interface OnCallEntry {
  teamId: string
  teamName: string
  primary: string
  secondary: string
  startsAt: string
  endsAt: string
}
