REST-API
==========
Basic API created. Connection to sqlite database established in db/database.js. Example routes created to show how to get and post data to an example db.

To try out locally: Download and run *npm install*. Start the application with *npm start* (localhost:1337)

See https://rem.dbwebb.se/ and https://developerhowto.com/2018/12/29/build-a-rest-api-with-node-js-and-express-js/ for more examples on building routes.

Test-routes
-------------
In folder *routes* there are two files **test.js** and **user.js** that contain example of routes.

The file **test.js** contains connection to the sqlite database **test2.db** with connection
established in the file **db/database.js**.

Routes to try out
------------------
- GET /test/db (get all test-data)
- GET /test/db/<id> (get row with id <id>)
- POST /test/db (post data, require body in: **one**: string, **two**: int)

To try out GET/POST/PUT/DELETE and status codes (no parameters in required):
- GET **/user**
- POST **/user**
- PUT **/user**
- DELETE **/user**
