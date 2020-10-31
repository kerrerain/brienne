const process = require("process");
const input = require("./input");
const errors = require("./errors");

const BRIENNE_RUNNER = process.env.BRIENNE_RUNNER || "local";
const runner = require(`./runners/${BRIENNE_RUNNER}`);

async function run() {
  runner
    .run(input.fetchWebsites())
    .catch(errors.commonErrorHandler);
}

run();