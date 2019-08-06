const axios = require("axios");
const {getEnvKeys} = require('./tools');

/**
 * Execute HTTP request
 * @param url {string} HTTP URL
 * @param method {string} HTTP method
 * @param data {Object} post data
 * @return {Promise<void>}
 */
async function execute(url, method, data) {
    try {
        let response;
        switch (method) {
            case 'GET':
                response = await axios.get(url);
                break;
            case 'POST':
                response = await axios.post(url, data);
                break;
            default:
                console.error(`[DA-HTTP] unsupported method "${method}".`);
        }
        console.log(`[DA-HTTP] response from ${method} - ${url}:\n`, response.data);
    } catch (e) {
        console.error(`[DA-HTTP] Failed to perform HTTP request ${method} - ${url}: ${e}`);
    }
}

/**
 * Creates periodic HTTP request task
 * @param url {string} HTTP URL
 * @param method {string} HTTP method
 * @param data {Object} post data
 * @param seconds {Number} timeout in seconds
 */
function createTask(url, method, data, seconds) {
    // Initiate task
    setInterval(() => {
        console.log(`[DA-HTTP] Performing HTTP request: ${method} - ${url}.`);
        execute(url, method, data).catch((e) => {
            console.error(`[DA-HTTP] Failed to perform HTTP request ${method} - ${url}: ${e}`);
        });
    }, seconds * 1000)
}

/**
 * Defines periodic HTTP tasks
 * @return {Object} dictionary of HTTP tasks
 */
function defineHttpTasks() {
    // Reverse proxy routes
    const httpTasks = {};

    // Go over environment variables starting from `PROXY_ROUTE_` and configure proxy routes
    getEnvKeys('HTTP_TASK_').forEach((entry) => {
        let task_config = process.env[entry].split(' | ');

        // Checking task config for basic consistency
        if (task_config.length < 3) {
            console.error(`[DA-HTTP] Invalid HTTP task config ${entry}: '${process.env[entry]}', skipping.`);
            return;
        }

        const seconds = Number(task_config[0]);
        const method = task_config[1];
        const url = task_config[2];
        const data = JSON.parse(task_config[3]) || {};

        console.log(`[DA-HTTP] Found HTTP task config for '${entry}'. ${method} - ${url} each ${seconds} seconds. Data:`, data);

        // Saving task config for later reporting
        httpTasks[entry] = {
            period: seconds,
            method: method,
            url: url,
            data: data,
        };

        // Initiate task
        createTask(url, method, data, seconds);
    });

    return httpTasks;
}

module.exports = defineHttpTasks;
