function scrapeURL(options) {
  const { adapter, url, terms } = options;
  const html = adapter.content();

  return {
    terms: [],
  };
}

module.exports = {
  scrapeURL,
};
