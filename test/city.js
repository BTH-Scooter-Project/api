/* global it describe */

/**
 testing of city-routes
*/

process.env.NODE_ENV = 'test';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../app.js');

chai.should();

chai.use(chaiHttp);

let apiKey = "90301a26-894c-49eb-826d-ae0c2b22a405";

describe('city', () => {
    describe('GET /v1/city', () => {
        it('should get 401 as we do not provide valid api_key', (done) => {
            chai.request(server)
                .get("/v1/city")
                .end((err, res) => {
                    res.should.have.status(401);

                    done();
                });
        });

        it('should get 200 as we do provide an apiKey', (done) => {
            chai.request(server)
                .get(`/v1/city?apiKey=${apiKey}`)
                .end((err, res) => {
                    res.should.have.status(200);

                    done();
                });
        });

        it('should contain an object with city-data', (done) => {
            chai.request(server)
                .get(`/v1/city?apiKey=${apiKey}`)
                .end((err, res) => {
                    res.should.have.status(200);

                    let reply = res.body;

                    reply.should.be.an("object");
                    reply.data.should.be.an("array");
                    reply.data[1].name.should.be.an("string").that.includes("Sundsvall");
                    reply.data.should.have.lengthOf(4);

                    done();
                });
        });
    });
    describe('GET /v1/city/1/station', () => {
        it('should get 401 as we do not provide valid api_key', (done) => {
            chai.request(server)
                .get("/v1/city/1/station")
                .end((err, res) => {
                    res.should.have.status(401);

                    done();
                });
        });
        it('should get 200 as we do provide an apiKey', (done) => {
            chai.request(server)
                .get(`/v1/city/1/station?apiKey=${apiKey}`)
                .end((err, res) => {
                    res.should.have.status(200);

                    done();
                });
        });

        it('should contain an object with city-data', (done) => {
            chai.request(server)
                .get(`/v1/city/1/station?apiKey=${apiKey}`)
                .end((err, res) => {
                    res.should.have.status(200);

                    let reply = res.body;

                    console.log(reply);

                    reply.should.be.an("object");

                    // reply.data[1].name.should.be.an('string').that.includes("Sundsvall");
                    // // reply.data.should.be.an('array').that.includes("Sundsvall");
                    // reply.data.should.have.lengthOf(4);

                    done();
                });
        });
    });
});
