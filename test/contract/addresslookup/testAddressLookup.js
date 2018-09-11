'use strict';

const expect = require('chai').expect;
const request = require('supertest');
const logger = require('app/components/logger')('Init');
const testConfig = require('test/config');

describe('Address Lookup API Tests', () => {
    describe('Basic ping', () => {
        it('Returns HTTP 403 status', (done) => {
            request(testConfig.postcodeLookup.url)
                .get('/')
                .expect('Content-Type', /json/)
                .expect(403)
                .end((err, res) => {
                    if (err) {
                        logger.error(`error raised: ${err}`);
                    } else {
                        expect(res.body.detail).to.equal('You do not have permission to perform this action.');
                    }
                    done();
                });
        });
    });

    describe('Single address returned for postcode', () => {
        it('Returns single address', (done) => {
            request(testConfig.postcodeLookup.url)
                .get(testConfig.postcodeLookup.endpoint)
                .query({postcode: testConfig.postcodeLookup.singleAddressPostcode})
                .set('Authorization', testConfig.postcodeLookup.token)
                .set('Content-Type', testConfig.postcodeLookup.contentType)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        logger.error(`error raised: ${err}`);
                    } else {
                        expect(res.body.length).to.equal(1);
                        expect(res.body[0].organisation_name).to.equal(testConfig.postcodeLookup.singleOrganisationName);
                        expect(res.body[0].formatted_address).to.equal(testConfig.postcodeLookup.singleFormattedAddress);
                    }
                    done();
                });
        });
    });

    describe('Multiple addresses returned for postcode', () => {
        it('Returns multiple addresses', (done) => {
            request(testConfig.postcodeLookup.url)
                .get(testConfig.postcodeLookup.endpoint)
                .query({postcode: testConfig.postcodeLookup.multipleAddressPostcode})
                .set('Authorization', testConfig.postcodeLookup.token)
                .set('Content-Type', testConfig.postcodeLookup.contentType)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        logger.error(`error raised: ${err}`);
                    } else {
                        expect(res.body.length).to.equal(12);
                    }
                    done();
                });
        });
    });

    describe('Partial postcode test', () => {
        it('No address returned for partial postcode', (done) => {
            request(testConfig.postcodeLookup.url)
                .get(testConfig.postcodeLookup.endpoint)
                .query({postcode: testConfig.postcodeLookup.partialAddressPostcode})
                .set('Authorization', testConfig.postcodeLookup.token)
                .set('Content-Type', testConfig.postcodeLookup.contentType)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        logger.error(`error raised: ${err}`);
                    } else {
                        expect(res.body.length).to.equal(0);
                    }
                    done();
                });
        });
    });

    describe('Invalid postcode test', () => {
        it('No address returned for invalid postcode', (done) => {
            request(testConfig.postcodeLookup.url)
                .get(testConfig.postcodeLookup.endpoint)
                .query({postcode: testConfig.postcodeLookup.invalidAddressPostcode})
                .set('Authorization', testConfig.postcodeLookup.token)
                .set('Content-Type', testConfig.postcodeLookup.contentType)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        logger.error(`error raised: ${err}`);
                    } else {
                        expect(res.body.length).to.equal(0);
                    }
                    done();
                });
        });
    });

    describe('No postcode entered test', () => {
        it('No address returned for no postcode entered', (done) => {
            request(testConfig.postcodeLookup.url)
                .get(testConfig.postcodeLookup.endpoint)
                .query({postcode: testConfig.postcodeLookup.emptyAddressPostcode})
                .set('Authorization', testConfig.postcodeLookup.token)
                .set('Content-Type', testConfig.postcodeLookup.contentType)
                .end((err, res) => {
                    if (err) {
                        logger.error(`error raised: ${err}`);
                    } else {
                        expect(res.body.length).to.equal(0);
                    }
                    done();
                });
        });
    });
});
