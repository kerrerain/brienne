const OUTPUT_BLACKHOLE = require('./blackhole');
const OUTPUT_CONSOLE = require('./console');
const OUTPUT_ELASTIC = require('./elastic');
const OUTPUT_FILE = require('./file');

const BRIENNE_OUTPUT = process.env.BRIENNE_OUTPUT || 'elastic';
const OUTPUTS = {
  blackhole: OUTPUT_BLACKHOLE,
  console: OUTPUT_CONSOLE,
  elastic: OUTPUT_ELASTIC,
  file: OUTPUT_FILE,
};

function publish(tests) {
  OUTPUTS[BRIENNE_OUTPUT].publish(tests);
}

module.exports = {
  publish,
};
