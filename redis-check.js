const redis = require('redis');
const {promisify} = require('util');

// Connect to Redis and report status
async function checkRedis() {
    if (!('REDIS_URL' in process.env)) {
        return 'N/A';
    }

    let redisUrl = process.env['REDIS_URL'];

    try {
        // Setup connection
        let client = redis.createClient(redisUrl);

        // Attach error handler
        client.on('error', (err) => {
            console.error(`[DA-Redis] ${err}`);
            client.quit();
        });

        // Perform simple write command
        const set = promisify(client.set).bind(client);
        await set('key', 'redis-check', 'EX', 10);

        // Quit connection and report
        client.quit();
        console.log(`[DA-Redis] Successfully tested Redis at ${redisUrl}.`);
        return 'OK';
    } catch (e) {
        console.error(`[DA-Redis] Failed to connect to Redis at ${redisUrl}: ${e}.`);
        return 'FAILED';
    }
}

module.exports = checkRedis;
