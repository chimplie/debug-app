const elasticsearch = require('@elastic/elasticsearch');

// Connect to PostgreSQL and report status
async function checkElasticSearch() {
    if (!('ELASTICSEARCH_URL' in process.env)) {
        return 'N/A';
    }

    const esUrl = process.env['ELASTICSEARCH_URL'];
    const client = new elasticsearch.Client({ node: esUrl });

    try {
        // Connect to cluster and retrieve current time
        await client.cat.indices();
        console.log(`[DA-ElasticSearch] Successfully tested ElasticSearch at ${esUrl}.`);
        return 'OK';
    } catch (e) {
        console.error(`[DA-ElasticSearch] Failed to communicate with ElasticSearch: ${e}.`);
        return 'FAILED';
    }
}

module.exports = checkElasticSearch;
