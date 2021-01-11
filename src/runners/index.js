const RUNNER_LOCAL = require('./local');

const BRIENNE_RUNNER = process.env.BRIENNE_RUNNER || 'local';
const RUNNERS = {
  local: RUNNER_LOCAL,
};

async function run(cursor) {
  return RUNNERS[BRIENNE_RUNNER].run(cursor);
}

module.exports = {
  run,
};
