function publish(tests) {
  console.log(tests.map(item => {
    return {
      code: item.test.code,
      result: item.result
    }
  }));
}

module.exports = {
  publish
};