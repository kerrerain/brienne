const crypto = require('crypto');
const process = require('process');
const { Client } = require('@elastic/elasticsearch');

const BRIENNE_ES_URL = process.env.BRIENNE_ES_URL || 'http://elastic:elastic@localhost:9200';
const BRIENNE_ES_INDEX_NAME = process.env.BRIENNE_ES_INDEX_NAME || 'brienne';

const client = new Client({ node: BRIENNE_ES_URL });

function publish(tests) {
  client.helpers.bulk({
    datasource: tests,
    onDocument: (document) => ({
      index: {
        _index: BRIENNE_ES_INDEX_NAME,
        _id: crypto
          .createHash('sha256')
          .update(`${document.test.id}${document.baseURL}${document.currentURL}`)
          .digest('hex'),
      },
    }),
  });
}

module.exports = {
  publish,
};
