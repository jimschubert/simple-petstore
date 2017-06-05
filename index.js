'use strict';
const jsonServer = require('json-server');
const path = require('path');
const express = require('express');
const util     = require('util');
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const defaultMiddleware = jsonServer.defaults();
const apiPrefix = '/api';

// Set default middlewares (logger, static, cors and no-cache)
server.use(defaultMiddleware);

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
    res.jsonp(req.query);
});

server.use(jsonServer.bodyParser);

server.get(`${apiPrefix}/pets/findByStatus`, function(req, res, next){
    req.url = `${apiPrefix}/pets`;
    let query = req.query;
    // Allow for csv format (defined by swagger) and multi (express built-in)
    if(util.isString(query.status)){
        req.query = {
            status: query.status.split(',')
        };
    }
    next();
});

server.use(apiPrefix, router);

server.listen(3000, () => {
    require('express-route-log')(server);
    console.log('JSON Server is running');
});