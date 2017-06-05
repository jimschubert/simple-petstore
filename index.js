'use strict';
const argv = require('minimist')(process.argv.slice(2));
const jsonServer = require('json-server');
const path = require('path');
const express = require('express');
const util     = require('util');
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const defaultMiddleware = jsonServer.defaults();
const apiPrefix = '/api';
const URL = require('url').URL;

const swagger = require(path.join(__dirname, 'swagger.json'));

// Allow CLI resetting of swagger.json's host property
// Useful when hosted, so swagger.json points to external host:port,
// rather than internally bound address:port
//
// example:
//    node index.js --host local.dev:3000
if(util.isString(argv.host)){
    try {
        let host = new URL(argv.host);
        swagger.host = host.href;
    } catch(e) {
        process.stderr.write(`Invalid host or failed to parse '${argv.host}'.\n`)
    }
}

// TODO: pass enabled authorization options

// Set default middlewares (logger, static, cors and no-cache)
server.use(defaultMiddleware);

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
    res.jsonp(req.query);
});

server.use(jsonServer.bodyParser);

server.get(`${apiPrefix}/pets/findByStatus`, (req, res, next) => {
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

server.get(`${apiPrefix}/pets/findByStatusMulti`, (req, res, next) => {
    req.url = `${apiPrefix}/pets`;
    next();
});

server.get(`${apiPrefix}/orders/:id/pet`, (req, res, next) => {
    const order = router.db.get('orders')
        .getById(req.params.id)
        .value();

    if(util.isUndefined(order)){
        return res.status(404).json({});
    }

    const pet = router.db.get('pets')
        .getById(order.petId)
        .value();

    return res.status(200).json(pet);
});

server.get('/swagger.json', (req, res, next) => {
    res.status(200).json(swagger);
});

server.use(apiPrefix, router);

server.listen(3000, () => {
    require('express-route-log')(server);
    console.log('JSON Server is running');
});