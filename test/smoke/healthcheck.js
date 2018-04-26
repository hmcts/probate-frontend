const chai = require('chai');
const expect = require('chai').expect;
const chaiHttp = require('chai-http');
const request = require('superagent');
//const config = require('../config');
//const frontendUrl = config.TestFrontendUrl
//let frontendUrl = (process.env.TEST_URL || 'http://localhost:3000')
const healthcheckRequest = (url, cb) => {
    return request
        .get(`${url}/health`)
        .end((err, res) => {
            if (err) {
                throw err;
            }
            cb(res);
        });
};

chai.use(chaiHttp);

describe('Probate frontend health check', () => {
    it('should return a 200 status code', done => {
        healthcheckRequest(process.env.TEST_URL, res => {
            expect(res).to.have.status(200);
            done();
        });
    });

    it('should return status UP', done => {
        healthcheckRequest(process.env.TEST_URL, res => {
            expect(res.body.status).to.equal('UP');
            done();
        });
    });

    it('should return the hostname', done => {
        healthcheckRequest(process.env.TEST_URL, res => {
            expect(res.body).to.have.property('host');
            done();
        });
    });
});
