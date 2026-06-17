'use strict';

const expect = require('chai').expect;
const logger = require('app/components/logger')('Init');
const testConfig = require('config');
const POSTCODE_SERVICE_TOKEN = testConfig.postcodeLookup.token;
const PostcodeLookup = require('app/services/PostcodeLookup');
const postcodeLookup = new PostcodeLookup();

describe('Address Lookup API Tests', () => {
    describe('Single address returned for postcode', () => {
        it('Returns single address', (done) => {
            testConfig.services.postcode.token = POSTCODE_SERVICE_TOKEN;
            postcodeLookup.get(testConfig.postcodeLookup.singleAddressPostcode)
                .then(res => {
                    expect(res.length).to.equal(1);
                    expect(res[0].postcode).to.equal(testConfig.postcodeLookup.singleAddressPostcode);
                    expect(res[0].formattedAddress).to.equal(testConfig.postcodeLookup.singleFormattedAddress);
                    done();
                })
                .catch(err => {
                    logger.error(`Postcode lookup failed to run: ${err}`);
                    done(new Error('Test failed'));
                });
        });
    });

    describe('Multiple addresses returned for postcode', () => {
        it('Returns multiple addresses', (done) => {
            postcodeLookup.get(testConfig.postcodeLookup.multipleAddressPostcode)
                .then(res => {
                    expect(res.length).to.equal(12);
                    done();
                })
                .catch(err => {
                    logger.error(`Postcode lookup failed to run: ${err}`);
                    done(new Error('Test failed'));
                });
        });
    });

    describe('Partial postcode test (returns greater number of results)', () => {
        it('No address returned for partial postcode', (done) => {
            postcodeLookup.get(testConfig.postcodeLookup.partialAddressPostcode)
                .then(res => {
                    expect(res.length).to.equal(100);
                    done();
                })
                .catch(err => {
                    logger.error(`Postcode lookup failed to run: ${err}`);
                    done(new Error('Test failed'));
                });
        });
    });

    describe('Invalid postcode test', () => {
        it('No address returned for invalid postcode', (done) => {
            postcodeLookup.get(testConfig.postcodeLookup.invalidAddressPostcode)
                .then(res => {
                    expect(res.length).to.equal(0);
                    done();
                })
                .catch(err => {
                    logger.error(`Postcode lookup failed to run: ${err}`);
                    done(new Error('Test failed'));
                });
        });
    });

    describe('No postcode entered test', () => {
        it('No address returned for no postcode entered', (done) => {
            postcodeLookup.get(testConfig.postcodeLookup.emptyAddressPostcode)
                .then(res => {
                    expect(res.length).to.equal(0);
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
    });

    describe('Basic ping', () => {
        it('Returns HTTP 401 status', (done) => {
            testConfig.services.postcode.token = 'invalid-token';
            postcodeLookup.get(testConfig.postcodeLookup.singleAddressPostcode)
                .then(res => {
                    expect(res.length).to.equal(0);
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
    });
});
