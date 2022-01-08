[![Node.js CI](https://github.com/BTH-Scooter-Project/api/actions/workflows/node.js.yml/badge.svg)](https://github.com/BTH-Scooter-Project/api/actions/workflows/node.js.yml)

[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/BTH-Scooter-Project/api/badges/quality-score.png?b=main&s=b654af84a0213c23ad8fe12c34b2e35472f1afc4)](https://scrutinizer-ci.com/g/BTH-Scooter-Project/api/?branch=main)

[![Code Coverage](https://scrutinizer-ci.com/g/BTH-Scooter-Project/api/badges/coverage.png?b=main&s=c5716d62fd9d3b7473241833de5b63b3035333a1)](https://scrutinizer-ci.com/g/BTH-Scooter-Project/api/?branch=main)

REST-API
==========
Connection to sqlite database established in db/database.js. For implemented routes
with correct database see https://bth-ramverk-grupp7.atlassian.net/wiki/spaces/BTHRAMVERK/pages/17989635/REST-API

Use API locally
-------------
To use API locally: Download and run *npm install*. Start the application with *npm start* (localhost:1337)

Use *npm test* to run test suite including post-test with linter ESLint.

Test-routes
-------------
Example routes created to show how to get, post, put and delete data to an example db (see example below).

In folder *routes* there are two files **test.js** and **user.js** that contain example of routes. These
can be used without providing an api-key.

The file **test.js** contains connection to the sqlite database **test2.db** with connection
established in the file **db/testDatabase.js**.

Routes to try out
------------------
- GET /test/ - only shows some basic info about test-routes
- GET /test/db (get all test-data)
- GET /test/db/<id> (get row with id <id>)
- POST /test/db (post data, require body in: **one**: string, **two**: int)

To try out GET/POST/PUT/DELETE and status codes (no parameters in required):
- GET **/user/**
- POST **/user/**
- PUT **/user/**
- DELETE **/user/**
