const assert = require('chai').assert;
const expect = require('chai').expect;
const request = require('supertest');
const testConfig = require('../../../test/config');

/* eslint no-console: 0 no-unused-vars: 0 */
describe('Address Lookup API Tests', function() {
    describe('1. Basic ping', function () {
        it('Returns HTTP 403 status', function (done) {
            request(testConfig.postcodeLookup.url)
                .get('/')
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

            request(testConfig.postcodeLookup.url)
                .get(testConfig.postcodeLookup.endpoint)
                .query({postcode: testConfig.postcodeLookup.singleAddressPostcode})
                .set('Authorization', testConfig.postcodeLookup.token)
                .set('Content-Type', testConfig.postcodeLookup.contentType)
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        console.log('error raised: ', err);
                    } else {
                        expect(res.body.length).to.equal(1);
                        expect(res.body[0].organisation_name).to.equal(testConfig.postcodeLookup.singleOrganisationName);
                        expect(res.body[0].formatted_address).to.equal(testConfig.postcodeLookup.singleFormattedAddress);
                    }
                    done();
                });
        });
    });

    describe('3. Multiple addresses returned for postcode', function () {
        it('Returns multiple addresses', function (done) {
            request(testConfig.postcodeLookup.url)
                .get(testConfig.postcodeLookup.endpoint)
                .query({postcode: testConfig.postcodeLookup.multipleAddressPostcode})
                .set('Authorization', testConfig.postcodeLookup.token)
                .set('Content-Type', testConfig.postcodeLookup.contentType)
                .expect(200)
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
            request(testConfig.postcodeLookup.url)
                .get(testConfig.postcodeLookup.endpoint)
                .query({postcode: testConfig.postcodeLookup.partialAddressPostcode})
                .set('Authorization', testConfig.postcodeLookup.token)
                .set('Content-Type', testConfig.postcodeLookup.contentType)
                .expect(200)
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
            request(testConfig.postcodeLookup.url)
                .get(testConfig.postcodeLookup.endpoint)
                .query({postcode: testConfig.postcodeLookup.invalidAddressPostcode})
                .set('Authorization', testConfig.postcodeLookup.token)
                .set('Content-Type', testConfig.postcodeLookup.contentType)
                .expect(200)
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
            request(testConfig.postcodeLookup.url)
                .get(testConfig.postcodeLookup.endpoint)
                .query({postcode: testConfig.postcodeLookup.emptyAddressPostcode})
                .set('Authorization', testConfig.postcodeLookup.token)
                .set('Content-Type', testConfig.postcodeLookup.contentType)
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
