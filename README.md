Chimplie Debug Application
==========================

A simple application designed for Docker cluster testing. It can check for Redis, Postgresql and ElasticSearch connections
and proxy requests between services. It also can periodically send HTTP request and perform sh commands.

The application designed to be configured entirely by environment variables.

Install & Run
-------------

Create `.env` file from template:

```bash
./setup-dotenv.sh
```

Build containers:

```bash
docker-compose build
```

Run services:

```bash
docker-compose up
```

Then you can request service statuses:

```bash
curl http://localhost:3011/status
```

this will return something like:

```json
{
  "name": "service-1",
  "id": "f51ed131-56e7-44a3-a24b-bb21f6145f58",
  "task": "status",
  "status": "RUNNING",
  "redis": "OK",
  "postgresql": "OK",
  "elasticsearch": "OK",
  "proxies": {
    "PROXY_ROUTE_SERVICE_2_STATUS": {
      "path": "/service-2/status",
      "target": "http://service-2:3000/",
      "pathRewrite": { "^/service-2/status": "/status" }
    }
  },
  "httpTasks": {},
  "shTasks": {},
  "heapSize": 0
}
```

You also may ask `service-1` to proxy `status/` request to `service-2`:

```bash
curl localhost:3011/service-2/status
```

Proxying
--------

To enable proxy add environment variable starting with `PROXY_ROUTE_`.

Format:

```bash
PROXY_ROUTE_<route name>=<location> <target> <rewrite rules>
```

For example the following route routes `/self/status` to `http://localhost:3000/` excluding `/self` from the URL path.

```bash
PROXY_ROUTE_SELF_STATUS=/self/status http://localhost:3000/ ^/self/status /status
```

Check `.env.sample` and `docker-compose.yml` for more examples.

> ### Warning!
> 
> Since routes are sensitive to order note that they will be applied in alphabetical order of related environment
> variables. 

PostgreSQL check
----------------

To enable PostgreSQL checks specify Postgres connection string in `PG_URL` environment variable.

For example the following connection string will connect to local Postgres instance running on port `5432`, database
`postgres` with user `postgres` and empty password:

```bash
PG_URL=postgresql://postgres:@localhost:5432/postgres
```

Redis Check
-----------

Work similar to Postgres check. Simply specify Redis connection string in `REDIS_URL` environment variable.

Example:

```bash
REDIS_URL=redis://localhost:6379
```

ElasticSearch Check
-------------------

Again, works as Redis and Postgres checks. Specify ElasticSearch connection string in `ELASTICSEARCH_URL` environment
variable.

Example:

```bash
ELASTICSEARCH_URL=http://localhost:9200
```

Periodic HTTP Requests
----------------------

You can ask service to make periodic HTTP requests by adding an environment variable starting with `HTTP_TASK_`.

Format:

```bash
HTTP_TASK_GET_SELF_STATUS=<seconds> | <HTTP method: GET/POST> | <URL> | <post data, default: {}>
```

For example, the following task will send `POST` HTTP request to `http://localhost:3000/ping` with `{"dummy": "data"}`
post payload each 5 seconds:

```bash
HTTP_TASK_GET_SELF_STATUS=5 | POST | http://localhost:3000/ping | {"dummy": "data"}
```

Periodic sh Tasks
-----------------

You can ask service to perform periodic sh commands by adding an environment variable starting with `SH_TASK_`.

Format:

```bash
SH_TASK_GET_DATE=<seconds> <command> [<arguments>]
```

For example, the following task will run `date -R` each 5 seconds.

```bash
SH_TASK_GET_DATE=5 date -R
```

CPU Consumption Request
-----------------------

You can ask application to perform computationally hard task by sending `GET` request to the route
`/load-test/cpu/:level`. Where `:level` defines computational complexity. The application will create a random square
matrix of order `level` and will take its inverse.

RAM Consumption Request
-----------------------

You can ask application to reserve certain amount of memory by sending `GET` request to the route
`/load-test/ram/add/:amount`. Where `:amount` is the number of bytes to reserve.

It is also possible to free reserved memory by sending `GET` request to the route `/load-test/ram/free/:amount`. In this
case the `:amount` of bytes will be freed. However, remember, that the application memory may not be freed immediately
due to Node.js garbage collection specifics. 

Development
-----------

Make sure that `.env` is created:

```bash
./setup-dotenv.sh
```

Switch to Node.js 10 (preferably 10.15.3). We suggest to use `nvm`:

```bash
nvm use 10
```

Install node.js dependencies:

```bash
npm install
```

If you already build your containers you may want to reset them by:

```bash
docker-compose rm -fsv
```

Now you can build your containers again:

```bash
docker-compose build
```

For development we suggest to start only databases:

```bash
docker-compose up db redis elasticsearch
```

Then you can run your service locally:

```bash
node server.js
```

Now you can check application status at (http://localhost:3000/status)[http://localhost:3000/status].

All service parameters are specified in `.env` file.
