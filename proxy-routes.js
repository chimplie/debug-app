const proxy = require('http-proxy-middleware');
const {getEnvKeys} = require('./tools');

/**
 * Defines reverse proxy routes
 * @param app {Object} Express application
 * @return {Object} defined routes
 */
function defineProxyRoutes(app) {
    // Reverse proxy routes
    const proxyRoutes = {};

    // Go over environment variables starting from `PROXY_ROUTE_` and configure proxy routes
    getEnvKeys('PROXY_ROUTE_').forEach((entry) => {
        let route_config = process.env[entry].split(' ');
        // Checking route config for basic consistency
        if (route_config.length < 2) {
            console.error(`[DA-Proxy] Invalid proxy config ${entry}: '${process.env[entry]}', skipping.`);
            return;
        }

        // Routing parameters
        let path = route_config[0];
        let target = route_config[1];
        let pathRewrite = {};
        if (route_config.length === 4) {
            pathRewrite[route_config[2]] = route_config[3];
        }

        console.log(`[DA-Proxy] Found reverse proxy config '${entry}': ${path} => ${target}.`);

        // Saving proxy config to report
        proxyRoutes[entry] = {
            path: path,
            target: target,
            pathRewrite: pathRewrite,
        };

        // Setting up reverse proxy from `path` to `target`
        app.use(path, proxy({
            target: target,
            changeOrigin: false,
            pathRewrite: pathRewrite,
            onProxyReq: (proxyReq) => {
                console.log(`[DA-Proxy-${entry}] - [/api] - ${proxyReq.method}: ${proxyReq.path}`);
            },
        }));
    });

    return proxyRoutes;
}

module.exports = defineProxyRoutes;