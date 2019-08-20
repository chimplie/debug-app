#!/usr/bin/env node
// const process = require('process');
const express = require('express');
require('express-async-errors');
const app = express();
const morgan = require('morgan');
const uuidv4 = require('uuid/v4');


// Load environment defaults from `.env` if required
if ((process.env.DOTENV || 'on') === 'on') {
    console.log('[DA] Loading environment defaults from ".env" file.');
    require('dotenv').config();
} else {
    console.log('[DA] Skipping ".env" file.');
}

// Checks
const checkRedis = require('./redis-check');
const checkPostgreSQL = require('./postgre-check');
const checkElasticSearch = require('./elasticsearch-check');
// Reverse proxy routes
const defineProxyRoutes = require('./proxy-routes');
// Curl tasks (periodic requests)
const defineHttpTasks = require('./http-tasks');
// Periodic sh tasks
const defineShTasks = require('./sh-tasks');

// Route Handlers
const getLoadCpuHandler = require('./load-test-cpu');
const { heapSize, getRamAddHandler, getRamFreeHandler } = require('./load-test-ram');

// Port to bind to
const port = process.env.PORT || 3000;
// Resolve application name
const app_name = process.env.APP_NAME;
// Generate unique application id
const app_id = uuidv4();

// Setup request logging
app.use(morgan('combined'));

// Define reverse proxy routes
const proxyRoutes = defineProxyRoutes(app);
// Define CURL tasks
const httpTasks = defineHttpTasks();
// Define sh tasks
const shTasks = defineShTasks();

// Root URL
app.get('/', function (req, res) {
    return res.send(`Service '${app_name}' (ID=${app_id}) is running. Use /status/ path to check service state.`);
});

// Status URL
app.get('/status', async (req, res) => {
    return res.json({
        name: app_name,
        id: app_id,
        status: 'RUNNING',
        task: 'status',
        redis: await checkRedis(),
        postgresql: await checkPostgreSQL(),
        elasticsearch: await checkElasticSearch(),
        proxies: proxyRoutes,
        httpTasks: httpTasks,
        shTasks: shTasks,
        heapSize: heapSize(),
    });
});

app.get('/close', (req, res) => {
  setInterval(() => {
    server.close();
  }, 500);

  return res.json({
    name: app_name,
    id: app_id,
    task: 'close',
    status: 'ACCEPTED',
  });
});

app.get('/exit', (req, res) => {
  setInterval(() => {
    server.close();
    process.exit();
  }, 500);

  return res.json({
    name: app_name,
    id: app_id,
    task: 'exit',
    status: 'ACCEPTED',
  });
});

app.get('/load-test/cpu/:level', getLoadCpuHandler(app_name, app_id));
app.get('/load-test/ram/add/:amount', getRamAddHandler(app_name, app_id));
app.get('/load-test/ram/free/:amount', getRamFreeHandler(app_name, app_id));

// Server ping
app.post('/ping', (req, res) => res.json({response: 'pong'}));

const server = app.listen(port, () => console.log(`[DA] Universum Debug App started on port=${port}.`));
