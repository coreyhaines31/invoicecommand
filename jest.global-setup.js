// Jest gives each test file a copy of process.env, so assigning TZ inside a test
// never reaches Node. Pin it here, before the workers start, so date tests run
// west of UTC on every machine, including CI (which is UTC).
module.exports = async () => {
  process.env.TZ = 'America/Los_Angeles'
}
