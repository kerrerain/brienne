function contentFunctionFactory(html) {
  return async () => html;
}

function create(options) {
  return {
    content: contentFunctionFactory(options.html || ''),
    url: options.url || '',
  };
}

module.exports = {
  create,
};
