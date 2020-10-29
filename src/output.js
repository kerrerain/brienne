const process = require("process");
const { Client } = require('@elastic/elasticsearch')

const BRIENNE_ES_URL = process.env.BRIENNE_ES_URL || "http://elastic:elastic@localhost:9200";
const BRIENNE_ES_INDEX_NAME = process.env.BRIENNE_ES_INDEX_NAME || "brienne";

const client = new Client({ node: BRIENNE_ES_URL });

function publish(body) {
    client.helpers.bulk({
        datasource: [
            body
        ],
        onDocument: (document) => {
            return {
                index: { _index: BRIENNE_ES_INDEX_NAME }
            }
        }
    });
}

module.exports = {
    publish
};