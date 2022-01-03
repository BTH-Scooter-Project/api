/* global it describe before */

/**
 testing of city-routes
*/

process.env.NODE_ENV = 'test';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');

const database = require("../db/database.js");
const server = require('../app.js');

chai.should();

chai.use(chaiHttp);

let config;

try {
    config = require('../config/config.json');
} catch (error) {
    console.error(error);
}

const apiKey = process.env.API_KEY || config.apikey;
const testScript = process.env.TEST_SCRIPT || config.test_script;

let token = "";

describe('travel', () => {
    //https://stackoverflow.com/questions/24723374/
    //async-function-in-mocha-before-is-alway-finished-before-it-spec
    before(() => {
        return new Promise((resolve) => {
            let db;

            db = database.getDb();

            const dataSql = fs.readFileSync(testScript).toString();

            // Convert the SQL string to array to run one at a time.
            const dataArr = dataSql.toString().split(";");

            //last row is empty, creates a last "empty" ('\n')-element
            dataArr.splice(-1);

            // db.serialize ensures that queries are one after the other
            //depending on which one came first in your `dataArr`
            db.serialize(() => {
                // db.run runs your SQL query against the DB
                db.run("BEGIN TRANSACTION;");
                // Loop through the `dataArr` and db.run each query
                dataArr.forEach(query => {
                    if (query) {
                        // Add the delimiter back to each query
                        //before you run them
                        query += ";";
                        db.run(query, err => {
                            if (err) {
                                throw err;
                            }
                        });
                    }
                });
                db.run("COMMIT;");
            });

            console.log("running DB");

            // Close the DB connection
            db.close(err => {
                if (err) {
                    return console.error(err.message);
                }
                resolve();
                // console.log("Closed the database connection.");
            });
        });
    });

    //get travel history of a logged in customer
    describe('GET /v1/travel/customer/1', () => {
        it('should get 401 as we are not logged in', (done) => {
            let customer = {
                email: "test@test.se",
                password: "test123",
            };

            chai.request(server)
                .get(`/v1/travel/customer/1?apiKey=${apiKey}`)
                .send(customer)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an("object");
                    res.body.errors.status.should.be.equal(401);
                    done();
                });
        });

        it('should get 200 login customer', (done) => {
            let customer = {
                email: "fredrica123@live.com",
                password: "test123"
            };

            chai.request(server)
                .post(`/v1/auth/customer/login?apiKey=${apiKey}`)
                .send(customer)
                .end((err, res) => {
                    res.should.have.status(200);

                    res.body.should.be.an("object");
                    res.body.should.have.property("data");

                    let result = res.body.data;

                    result.should.have.property("message");
                    result.message.should.equal("User logged in");

                    result.should.have.property("user");
                    result.user.should.equal("fredrica123@live.com");

                    result.should.have.property("token");
                    token = res.body.data.token;

                    done();
                });
        });

        it('should get 400 as we provide token but try to access another customer', (done) => {
            chai.request(server)
                .get(`/v1/travel/customer/1?apiKey=${apiKey}`)
                .set("x-access-token", token)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.an("object");
                    res.body.errors.should.be.an("object");

                    let result = res.body.errors;

                    result.should.have.property("title");
                    result.title.should.equal("Unauthorized");

                    result.should.have.property("message");
                    let message = "Current user is not authorized to view data from other users";

                    result.message.should.equal(message);

                    done();
                });
        });

        it('should get 200 as we do provide token', (done) => {
            chai.request(server)
                .get(`/v1/travel/customer/4?apiKey=${apiKey}`)
                .set("x-access-token", token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("array");

                    let result = res.body.data;

                    result.length.should.equal(3);

                    result[0].should.have.property("userid");
                    result[0].userid.should.equal(4);

                    done();
                });
        });
    });



    //rent a bike as bike-simulator would do
    //TODO fortsätt här
    describe('POST /v1/travel/simulation', () => {
        it('should get 404 as we try renting a non-existent bike', (done) => {
            let customer = {
                customerid: 1,
                bikeid: 99
            };

            chai.request(server)
                .post(`/v1/travel/simulation?apiKey=${apiKey}`)
                .send(customer)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.an("object");
                    res.body.should.have.property("errors");

                    let reply = res.body.errors;

                    reply.should.have.property("title");
                    reply.title.should.equal("Not found");
                    reply.should.have.property("message");
                    reply.message.should.equal("The bike is not found");
                    done();
                });
        });

        it('should get 400 as we try renting an already rented bike', (done) => {
            let customer = {
                customerid: 1,
                bikeid: 6
            };

            chai.request(server)
                .post(`/v1/travel/simulation?apiKey=${apiKey}`)
                .send(customer)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.an("object");
                    res.body.should.have.property("errors");

                    let reply = res.body.errors;

                    reply.should.have.property("title");
                    reply.title.should.equal("Bad request");
                    reply.should.have.property("message");
                    reply.message.should.contain("The bike is currently not available");
                    done();
                });
        });
        it('should get 201 as we rent a bike', (done) => {
            let customer = {
                customerid: 1,
                bikeid: 1
            };

            chai.request(server)
                .post(`/v1/travel/simulation?apiKey=${apiKey}`)
                .send(customer)
                .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.should.have.property("data");

                    let reply = res.body.data;

                    reply.should.have.property("type");
                    reply.type.should.equal("success");
                    reply.should.have.property("message");
                    reply.message.should.equal("Bike rented");
                    reply.should.have.property("bikeid");
                    reply.bikeid.should.equal(customer.bikeid);
                    done();
                });
        });
    });
});
