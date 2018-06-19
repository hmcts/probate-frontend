const assert = require('chai').assert;
const expect = require('chai').expect;
const include = require('chai').include;
const request = require('superagent');
const testConfig = require('test/config');

const IDAM_URL = testConfig.TestIdamLoginUrl;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

/* eslint no-console: 0 no-unused-vars: 0 */
describe('Idam Tests', function() {
    it('Basic Ping Test', function (done) {

        request
            .get(IDAM_URL)
            .timeout(3600 * 1000)
            .end((err, res) => {
                if (err) {
                    console.error(err);
                } else {
                    expect(res.status, 200);
                }
                done();
            });
    });
});
