const fs = require('fs');

function publish(tests) {
  fs.writeFile('result.json', `${JSON.stringify(tests)}\n`, {
    flag: 'a',
  });
}

module.exports = {
  publish,
};
