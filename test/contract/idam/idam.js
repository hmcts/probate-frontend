const assert = require('chai').assert;
const expect = require('chai').expect;
const include = require('chai').include;
const request = require('supertest');
const testConfig = require('../../../test/config');

//process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

/* eslint no-console: 0 no-unused-vars: 0 */
describe('Idam Tests', function() {
    it('Basic Ping Test', function (done) {

        request(testConfig.TestIdamLoginUrl)
            .get('/')
            .expect(200)
            .end((err, res) => {
                if (err) {
                    console.error(err);
                }
                done();
            });
    });
});
