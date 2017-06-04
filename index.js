'use strict';
const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
    res.jsonp(req.query);
});

server.use(jsonServer.bodyParser);

server.use(jsonServer.rewriter({
    "/api/": "/",
    "/api/pets": "/pets",
    "/api/tags": "/tags",
    "/api/orders": "/orders",
    "/api/users": "/users",
    "/api/categories": "/categories"
}));

server.use(router);

server.listen(3000, () => {
    require('express-route-log')(server);
    console.log('JSON Server is running');
});