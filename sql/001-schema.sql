CREATE TABLE IF NOT EXISTS divisions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  lead_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS teams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  division_id TEXT NOT NULL REFERENCES divisions(id)
);

CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  team_id TEXT NOT NULL REFERENCES teams(id),
  status TEXT NOT NULL DEFAULT 'healthy',
  instances INTEGER NOT NULL DEFAULT 1,
  cpu_avg REAL NOT NULL DEFAULT 0,
  memory_avg REAL NOT NULL DEFAULT 0,
  uptime_percent REAL NOT NULL DEFAULT 100,
  error_rate REAL NOT NULL DEFAULT 0,
  p95_latency REAL NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS deployments (
  id TEXT PRIMARY KEY,
  service_id TEXT NOT NULL REFERENCES services(id),
  service_name TEXT NOT NULL,
  version TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress',
  author TEXT NOT NULL,
  author_team_id TEXT NOT NULL REFERENCES teams(id),
  duration_ms INTEGER NOT NULL DEFAULT 0,
  cost_delta REAL NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS incidents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  service_id TEXT NOT NULL REFERENCES services(id),
  service_name TEXT NOT NULL,
  severity INTEGER NOT NULL DEFAULT 3,
  status TEXT NOT NULL DEFAULT 'active',
  started_at TEXT NOT NULL,
  resolved_at TEXT,
  responders TEXT NOT NULL DEFAULT '[]',
  revenue_impact REAL,
  description TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS team_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  team_id TEXT NOT NULL REFERENCES teams(id),
  email TEXT NOT NULL,
  on_call INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS cloud_spend (
  team_id TEXT PRIMARY KEY REFERENCES teams(id),
  team_name TEXT NOT NULL,
  division_id TEXT NOT NULL REFERENCES divisions(id),
  mtd REAL NOT NULL DEFAULT 0,
  budget REAL NOT NULL DEFAULT 0,
  forecast REAL NOT NULL DEFAULT 0,
  categories TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS oncall_schedule (
  team_id TEXT PRIMARY KEY REFERENCES teams(id),
  team_name TEXT NOT NULL,
  primary_engineer TEXT NOT NULL,
  secondary_engineer TEXT NOT NULL,
  starts_at TEXT NOT NULL,
  ends_at TEXT NOT NULL
);
