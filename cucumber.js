export default {
  requireModule: ['tsx'],
  require: ['test/steps/**/*.ts', 'test/support/**/*.ts'],
  paths: ['test/features/**/*.feature'],
  format: ['progress-bar', 'html:test/reports/report.html'],
  publishQuiet: true,
}
