const assert = require('assert');
const { create } = require('./fake-page-adapter');
const scraper = require('../../src/scraper');

describe('The scraper', () => {
  it('should look for terms for a URL', () => {
    // Given an URL
    const url = 'https://homepage.com';

    // And HTML content for this URL
    const adapter = create({
      [url]: {
        html: 'This text contains some interesting keywords that we should look for. Did I say keywords?',
      },
    });

    // And the list of the terms we are looking for
    const terms = [
      'keywords',
      'contains',
      'unbelievable',
    ];

    // When we scrape this URL
    const report = scraper.scrapeURL({
      adapter,
      terms,
      url,
    });

    // And we get the actual terms from the scraping report
    const actual = report.terms;

    // Then only the terms that were actually in the HTML content should remain
    assert.strictEqual(actual, [
      'keywords',
      'contains',
    ]);
  });
});
