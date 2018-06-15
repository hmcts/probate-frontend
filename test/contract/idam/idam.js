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


const content_type_json = 'application/json';

const CONTENT_TYPE = 'application/x-www-form-urlencoded';
const USERNAME = 'username';
const PASSWORD = 'password';
const GOOD_USERNAME_VALUE = 'testpasswordcharacters@mailinator.com';
const GOOD_PASSWORD_VALUE = 'Pass19word';
const BAD_USERNAME_VALUE = 'badPasswordTest@restassuredTest.com';
const BAD_PASSWORD_VALUE = 'Pass19word';
const ACCESS_TOKEN = 'access_token';
const SUB = 'sub';
const ERROR = 'error';
const ERROR_MESSAGE = 'invalid_grant';

const base_url = 'https://postcodeinfo.service.justice.gov.uk/addresses';
const get_url = base_url + '/addresses?postcode=';

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