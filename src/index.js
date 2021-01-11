const errors = require('./errors');
const runners = require('./runners');
const input = require('./inputs');

async function run() {
  const cursor = await input
    .getWebsitesCursor()
    .catch(errors.commonErrorHandler);
  runners
    .run(cursor)
    .catch(errors.commonErrorHandler);
}

run();
