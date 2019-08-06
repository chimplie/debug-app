const { spawn } = require('child_process');
const {getEnvKeys} = require('./tools');

/**
 * Creates periodic sh task
 * @param command {string} command
 * @param args {[string]} command arguments
 * @param seconds {Number} task period
 */
function createTask(command, args, seconds) {
    const cmdString = `${command} ${args.join(' ')}`;

    setInterval(() => {
        console.log(`[DA-Tasks] Performing sh task: ${cmdString}.`);

        let task = spawn(command, args, { stdio: 'inherit' });

        task.on('close', (code) => {
            console.log(`[DA-Tasks] Command ${cmdString} exited with code ${code}`);
        });

        task.on('error', (e) => {
            console.log(`[DA-Tasks] Command ${cmdString} failed: ${e}.`);
        });

    }, seconds * 1000);
}

/**
 * Defines periodic sh tasks
 * @return {Object} dictionary of sh tasks
 */
function defineShTasks() {
    // Reverse proxy routes
    const shTasks = {};

    // Go over environment variables starting from `PROXY_ROUTE_` and configure proxy routes
    getEnvKeys('SH_TASK_').forEach( (entry) => {
        let task_config = process.env[entry].split(' ');

        // Checking task config for basic consistency
        if (task_config.length < 2) {
            console.error(`[DA-Tasks] Invalid sh task config ${entry}: '${process.env[entry]}', skipping.`);
            return;
        }

        const seconds = Number(task_config[0]);
        const command = task_config[1];
        const args = task_config.slice(2);

        console.log(`[DA-Tasks] Found sh task config for '${entry}'. ${command} ${args.join(' ')} for each ${seconds} seconds.`);

        // Saving task config for later reporting
        shTasks[entry] = {
            period: seconds,
            command: command,
            args: args,
        };

        // Initiate task
        createTask(command, args, seconds);
    });

    return shTasks;
}

module.exports = defineShTasks;
