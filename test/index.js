/* global it describe */

/**
 testing of index-page
*/

process.env.NODE_ENV = 'test';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');

chai.should();

chai.use(chaiHttp);

describe('app', () => {
    describe('GET /', () => {
        it('200 HAPPY PATH getting base', (done) => {
            chai.request(server)
                .get("/")
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('page should contain API description', (done) => {
            chai.request(server)
                .get("/")
                .end((err, res) => {
                    res.should.have.status(200);

                    let reply = res.body;

                    reply.should.be.an("object");

                    let message = reply.data.message;

                    message.should.be.a("string");
                    message.should.equal("API for Scooter project");

                    done();
                });
        });
    });
});
