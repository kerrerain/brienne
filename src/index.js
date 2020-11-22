const process = require("process");
const errors = require("./errors");

const BRIENNE_RUNNER = process.env.BRIENNE_RUNNER || "local";
const BRIENNE_INPUT = process.env.BRIENNE_INPUT || "url";
const runner = require(`./runners/${BRIENNE_RUNNER}`);
const input = require(`./inputs/${BRIENNE_INPUT}`);

async function run() {
  const cursor = await input
    .getWebsitesCursor()
    .catch(errors.commonErrorHandler);
  runner
    .run(cursor)
    .catch(errors.commonErrorHandler);
}

run();