-- Divisions
INSERT OR REPLACE INTO divisions (id, name, lead_name) VALUES
  ('platform', 'Platform', 'Marcus Rivera'),
  ('product', 'Product', 'Lisa Kim'),
  ('data', 'Data', 'Raj Patel'),
  ('infrastructure', 'Infrastructure', 'Dev Williams');

-- Teams
INSERT OR REPLACE INTO teams (id, name, division_id) VALUES
  ('payments', 'Payments', 'platform'),
  ('platform-infra', 'Platform Infra', 'platform'),
  ('api-gateway', 'API Gateway', 'platform'),
  ('service-mesh', 'Service Mesh', 'platform'),
  ('frontend', 'Frontend', 'product'),
  ('mobile', 'Mobile', 'product'),
  ('search', 'Search', 'product'),
  ('ml-pipeline', 'ML Pipeline', 'data'),
  ('data-eng', 'Data Engineering', 'data'),
  ('infra-core', 'Infra Core', 'infrastructure'),
  ('sre', 'SRE', 'infrastructure');

-- Services
INSERT OR REPLACE INTO services (id, name, team_id, status, instances, cpu_avg, memory_avg, uptime_percent, error_rate, p95_latency) VALUES
  ('svc-1', 'payment-gateway', 'payments', 'healthy', 6, 67, 54, 99.94, 0.3, 180),
  ('svc-2', 'checkout-flow', 'payments', 'healthy', 3, 23, 31, 99.99, 0.1, 95),
  ('svc-3', 'fraud-detector', 'payments', 'healthy', 4, 89, 72, 99.97, 0.2, 420),
  ('svc-4', 'api-router', 'api-gateway', 'healthy', 8, 45, 38, 99.99, 0.05, 12),
  ('svc-5', 'rate-limiter', 'api-gateway', 'healthy', 5, 32, 28, 99.99, 0.01, 5),
  ('svc-6', 'service-discovery', 'service-mesh', 'healthy', 3, 18, 22, 100, 0, 3),
  ('svc-7', 'ml-training', 'ml-pipeline', 'degraded', 2, 94, 88, 98.5, 4.2, 12000),
  ('svc-8', 'search-indexer', 'search', 'healthy', 4, 56, 64, 99.95, 0.15, 340);

-- Deployments
INSERT OR REPLACE INTO deployments (id, service_id, service_name, version, timestamp, status, author, author_team_id, duration_ms, cost_delta) VALUES
  ('dep-1', 'svc-1', 'payment-gateway', 'v2.14.3', '2026-03-14T10:42:00Z', 'success', 'Sarah Chen', 'payments', 145000, 0),
  ('dep-2', 'svc-1', 'payment-gateway', 'v2.14.2', '2026-03-14T09:15:00Z', 'rolled_back', 'Sarah Chen', 'payments', 87000, 0),
  ('dep-3', 'svc-2', 'checkout-flow', 'v1.8.0', '2026-03-13T15:22:00Z', 'success', 'Jake Torres', 'payments', 92000, 0),
  ('dep-4', 'svc-3', 'fraud-detector', 'v3.1.1', '2026-03-13T11:05:00Z', 'success', 'Aisha Khan', 'payments', 203000, 0),
  ('dep-5', 'svc-4', 'api-router', 'v4.2.0', '2026-03-14T14:30:00Z', 'success', 'Tom Lee', 'api-gateway', 67000, 1200),
  ('dep-6', 'svc-5', 'rate-limiter', 'v1.3.0', '2026-03-13T09:00:00Z', 'success', 'Tom Lee', 'api-gateway', 54000, 340),
  ('dep-7', 'svc-6', 'service-discovery', 'v2.0.1', '2026-03-12T16:45:00Z', 'success', 'Nina Park', 'service-mesh', 112000, -890),
  ('dep-8', 'svc-7', 'ml-training', 'v0.9.4', '2026-03-14T08:20:00Z', 'failed', 'Raj Patel', 'ml-pipeline', 340000, 12400),
  ('dep-9', 'svc-7', 'ml-training', 'v0.9.3', '2026-03-12T11:00:00Z', 'failed', 'Raj Patel', 'ml-pipeline', 280000, 8200),
  ('dep-10', 'svc-8', 'search-indexer', 'v5.1.0', '2026-03-13T13:15:00Z', 'success', 'Lisa Kim', 'search', 156000, 450);

-- Incidents
INSERT OR REPLACE INTO incidents (id, title, service_id, service_name, severity, status, started_at, resolved_at, responders, revenue_impact, description) VALUES
  ('inc-4521', 'Payment gateway timeout errors', 'svc-1', 'payment-gateway', 2, 'resolved', '2026-03-14T09:18:00Z', '2026-03-14T10:45:00Z', '["Sarah Chen"]', 18700, 'Connection pool exhaustion after deploy v2.14.2. Rolled back, then deployed fix v2.14.3.'),
  ('inc-4518', 'ML pipeline GPU allocation failure', 'svc-7', 'ml-training', 2, 'active', '2026-03-14T08:25:00Z', NULL, '["Raj Patel"]', NULL, 'GPU nodes not scheduling after v0.9.4 deploy. Training jobs queued but not executing.'),
  ('inc-4510', 'Search latency spike', 'svc-8', 'search-indexer', 3, 'resolved', '2026-03-11T14:00:00Z', '2026-03-11T15:30:00Z', '["Lisa Kim","Nina Park"]', NULL, 'Index rebuild caused temporary latency spike during reindexing.');

-- Team Members
INSERT OR REPLACE INTO team_members (id, name, role, team_id, email, on_call) VALUES
  ('u-sarah', 'Sarah Chen', 'Senior Engineer', 'payments', 'sarah@acme-eng.dev', 1),
  ('u-jake', 'Jake Torres', 'Engineer', 'payments', 'jake@acme-eng.dev', 0),
  ('u-aisha', 'Aisha Khan', 'Engineer', 'payments', 'aisha@acme-eng.dev', 0),
  ('u-marcus', 'Marcus Rivera', 'Eng Manager', 'platform-infra', 'marcus@acme-eng.dev', 0),
  ('u-tom', 'Tom Lee', 'Senior Engineer', 'api-gateway', 'tom@acme-eng.dev', 1),
  ('u-nina', 'Nina Park', 'Engineer', 'service-mesh', 'nina@acme-eng.dev', 0),
  ('u-raj', 'Raj Patel', 'Staff Engineer', 'ml-pipeline', 'raj@acme-eng.dev', 1),
  ('u-lisa', 'Lisa Kim', 'Eng Manager', 'search', 'lisa@acme-eng.dev', 0),
  ('u-dev', 'Dev Williams', 'Eng Manager', 'infra-core', 'dev@acme-eng.dev', 0),
  ('u-priya', 'Priya Sharma', 'CTO', 'payments', 'priya@acme-eng.dev', 0);

-- Cloud Spend
INSERT OR REPLACE INTO cloud_spend (team_id, team_name, division_id, mtd, budget, forecast, categories) VALUES
  ('payments', 'Payments', 'platform', 12400, 14000, 14200, '[{"name":"Compute","amount":8200},{"name":"Database","amount":3100},{"name":"Networking","amount":1100}]'),
  ('platform-infra', 'Platform Infra', 'platform', 18200, 20000, 21000, '[{"name":"Compute","amount":12000},{"name":"Storage","amount":4200},{"name":"Networking","amount":2000}]'),
  ('api-gateway', 'API Gateway', 'platform', 15800, 14500, 18200, '[{"name":"Compute","amount":11200},{"name":"Networking","amount":3400},{"name":"Observability","amount":1200}]'),
  ('service-mesh', 'Service Mesh', 'platform', 12100, 16000, 14700, '[{"name":"Compute","amount":8800},{"name":"Database","amount":2400},{"name":"Networking","amount":900}]'),
  ('ml-pipeline', 'ML Pipeline', 'data', 89200, 72000, 103800, '[{"name":"GPU Compute","amount":68000},{"name":"Storage","amount":14200},{"name":"Networking","amount":7000}]'),
  ('search', 'Search', 'product', 22100, 24000, 25600, '[{"name":"Compute","amount":14800},{"name":"Database","amount":5300},{"name":"Storage","amount":2000}]');

-- On-Call Schedule
INSERT OR REPLACE INTO oncall_schedule (team_id, team_name, primary_engineer, secondary_engineer, starts_at, ends_at) VALUES
  ('payments', 'Payments', 'Sarah Chen', 'Jake Torres', '2026-03-14T00:00:00Z', '2026-03-21T00:00:00Z'),
  ('api-gateway', 'API Gateway', 'Tom Lee', 'Marcus Rivera', '2026-03-14T00:00:00Z', '2026-03-21T00:00:00Z'),
  ('service-mesh', 'Service Mesh', 'Nina Park', 'Tom Lee', '2026-03-14T00:00:00Z', '2026-03-21T00:00:00Z'),
  ('ml-pipeline', 'ML Pipeline', 'Raj Patel', 'Lisa Kim', '2026-03-14T00:00:00Z', '2026-03-21T00:00:00Z');
