import type { UserSession } from './types.js'

const API_KEY_MAP: Record<string, UserSession> = {
  'sarah-key-only-hardcoded-for-demo': {
    userId: 'sarah',
    name: 'Sarah Chen',
    role: 'developer',
    teamId: 'payments',
    divisionId: 'platform',
  },
  'marcus-key-only-hardcoded-for-demo': {
    userId: 'marcus',
    name: 'Marcus Rivera',
    role: 'em',
    teamId: 'platform-infra',
    divisionId: 'platform',
  },
  'priya-key-only-hardcoded-for-demo': {
    userId: 'priya',
    name: 'Priya Sharma',
    role: 'cto',
    teamId: 'executive',
    divisionId: 'all',
  },
}

export function resolveSession(apiKey: string): UserSession | null {
  return API_KEY_MAP[apiKey] ?? null
}

export function getApiKeyMap() {
  return API_KEY_MAP
}
