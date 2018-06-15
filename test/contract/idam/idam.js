const assert = require('chai').assert;
const expect = require('chai').expect;
const include = require('chai').include;
//const request = require('supertest');
const request = require('superagent');

require('superagent-proxy')(request);

const IDAM_URL = 'https://probate-frontend-saat-staging.service.core-compute-saat.internal';
const PROXY_URL = 'http://proxyout.reform.hmcts.net';
const PROXY_PORT = 8080;
const PROXY = PROXY_URL + ':' + PROXY_PORT;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

/* eslint no-console: 0 no-unused-vars: 0 */
describe('Idam Tests', function() {
    it('Basic Ping Test', function (done) {

        request
            .get(IDAM_URL)
            .proxy(PROXY)
            .timeout(3600 * 1000)
            .end((err, res) => {
                if (err) {
                    console.error(err);
                } else {
                    expect(res.status, 200);
                }
                done();
                //
                // console.log(res)
                // console.log(res.status, res.headers);
                // console.log(res.body);
            });
    });
});
