const assert = require('chai').assert;
const expect = require('chai').expect;
const request = require('supertest');
const testConfig = require('test/config.js');

const address_api_url = testConfig.TestPostcodeLookupUrl;

const ADDRESS_TOKEN = testConfig.TestPostcodeLookupToken;
const content_type = 'application/json';
const single_address_postcode = 'SW1A 1AA';
const single_organisation_name = 'BUCKINGHAM PALACE';
const single_formatted_address = 'Buckingham Palace\nLondon\nSW1A 1AA';
const multiple_address_postcode = 'N145JY';
const partial_address_postcode = 'N14';

/* eslint no-console: 0 no-unused-vars: 0 */
describe('Address Lookup API Tests', function() {
    describe('1. Basic ping', function () {
        it('Returns HTTP 403 status', function (done) {
            request(address_api_url)
                .get('/')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(403)
                .end(function (err, res) {
                    if (err) {
                        console.log('error raised: ', err);
                    } else {
                        expect(res.body.detail).to.equal('You do not have permission to perform this action.');
                    }
                    done();
                });
        });
    });

    describe('2. Single address returned for postcode', function () {
        it('Returns single address', function (done) {
            request(address_api_url)
                .get(single_address_postcode)
                .set('Authorization', ADDRESS_TOKEN)
                .set('Content-Type', content_type)
                .end(function (err, res) {
                    if (err) {
                        console.log('error raised: ', err);
                    } else {
                        expect(res.body.length).to.equal(1);
                        expect(res.body[0].organisation_name).to.equal(single_organisation_name);
                        expect(res.body[0].formatted_address).to.equal(single_formatted_address);
                    }
                    done();
                });
        });
    });

    describe('3. Multiple addresses returned for postcode', function () {
        it('Returns multiple addresses', function (done) {
            request(address_api_url)
                .get(multiple_address_postcode)
                .set('Authorization', ADDRESS_TOKEN)
                .set('Content-Type', content_type)
                .end(function (err, res) {
                    if (err) {
                        console.log('error raised: ', err);
                    } else {
                        expect(res.body.length).to.equal(12);
                    }
                    done();
                });
        });
    });

    describe('4. Partial postcode test', function () {
        it('No address returned for partial postcode', function (done) {
            request(address_api_url)
                .get(partial_address_postcode)
                .set('Authorization', ADDRESS_TOKEN)
                .set('Content-Type', content_type)
                .end(function (err, res) {
                    if (err) {
                        console.log('error raised: ', err);
                    } else {
                        expect(res.body.length).to.equal(0);
                    }
                    done();
                });
        });
    });

    describe('5. Invalid postcode test', function () {
        it('No address returned for invalid postcode', function (done) {
            request(address_api_url)
                .get(partial_address_postcode)
                .set('Authorization', ADDRESS_TOKEN)
                .set('Content-Type', content_type)
                .end(function (err, res) {
                    if (err) {
                        console.log('error raised: ', err);
                    } else {
                        expect(res.body.length).to.equal(0);
                    }
                    done();
                });
        });
    });

    describe('6. No postcode entered test', function () {
        it('No address returned for no postcode entered', function (done) {
            request(address_api_url)
                .get('')
                .set('Authorization', ADDRESS_TOKEN)
                .set('Content-Type', content_type)
                .end(function (err, res) {
                    if (err) {
                        console.log('error raised: ', err);
                    } else {
                        expect(res.body.length).to.equal(0);
                    }
                    done();
                });
        });
    });
});
