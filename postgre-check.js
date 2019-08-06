const pg = require('pg');

// Connect to PostgreSQL and report status
async function checkPostgreSQL() {
    if (!('PG_URL' in process.env)) {
        return 'N/A';
    }

    const connectionString = process.env['PG_URL'];
    const client = new pg.Client({
        connectionString: connectionString,
    });

    try {
        // Connect to database and retrieve current time
        await client.connect();
        const pgUrl = `${client.connectionParameters.host}:${client.connectionParameters.port}`;
        console.log(`[DA-PostgreSQL] Successfully connected to PostgreSQL at ${pgUrl}.`);
        const now = (await client.query('SELECT NOW()')).rows[0].now;
        console.log(`[DA-PostgreSQL] Successfully queried current DB time: ${now}.`);
        await client.end();
        return 'OK';
    } catch (e) {
        console.error(`[DA-PostgreSQL] Failed to communicate with PostgreSQL: ${e}.`);
        return 'FAILED';
    }
}

module.exports = checkPostgreSQL;
