# simple petstore

A simple json-backed REST API similar to Swagger's Petstore API.

This example uses [json-server](https://github.com/typicode/json-server) to quickly create a usable API from a structured file-based JSON database.

# Requirements

* Node.js 8.0 or higher
* Yarn 0.24.6 or higher

# Running

To run the pure json-server frontend on top of `db.json`, just run:

```
yarn start
```

This doesn't include any of the additional endpoints or customizations for testing more complex Swagger capabilities.

To run a server with the more complex functionality, run:

```
yarn run simple
```

This includes Swagger UI at the served index to get a feel for the API's functionality. This also helps if you're not that familiar with json-server.

