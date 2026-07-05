const express = require("express");

const registerMiddlewares = require("./middleware");

const app = express();

const notFoundMiddleware = require("./middleware/notFound.middleware");

const errorMiddleware = require("./middleware/error.middleware");

/*
|--------------------------------------------------------------------------
| Register Global Middlewares
|--------------------------------------------------------------------------
*/

registerMiddlewares(app);

/*
|--------------------------------------------------------------------------
| Health Route
|--------------------------------------------------------------------------
*/

const routes = require("./routes");

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

const config = require("./config");

app.use(config.API_PREFIX, routes);

app.use(notFoundMiddleware);

app.use(errorMiddleware);

module.exports = app;