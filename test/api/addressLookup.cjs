'use strict';

const assert = require('chai').assert;
const sinon = require('sinon');
const testConfig = require('config');
const PostcodeAddress = require('app/services/PostcodeAddress.cjs');
const postcodeAddress = new PostcodeAddress();

describe('addressLookup tests', () => {
    let findAddressSpy;

    beforeEach(() => {
        findAddressSpy = sinon.spy(PostcodeAddress.prototype, 'get');
    });

    afterEach(() => {
        findAddressSpy.restore();
    });

    it('Should successfully retrieve address list with postcode', (done) => {
        postcodeAddress.get(testConfig.postcodeLookup.singleAddressPostcode)
            .then((actualResponse) => {
                sinon.assert.alwaysCalledWith(findAddressSpy, testConfig.postcodeLookup.singleAddressPostcode);
                assert.isArray(actualResponse);
                assert.equal(actualResponse.length, 1);
                assert.deepPropertyVal(actualResponse[0], 'postcode', testConfig.postcodeLookup.singleAddressPostcode);
                assert.deepPropertyVal(actualResponse[0], 'organisationName', testConfig.postcodeLookup.singleOrganisationName);
                assert.deepPropertyVal(actualResponse[0], 'formattedAddress', testConfig.postcodeLookup.singleFormattedAddress);
                done();
            })
            .catch(done);
    });

    it('Should reject the process using an empty postcode', (done) => {
        postcodeAddress.get(testConfig.postcodeLookup.emptyAddressPostcode)
            .then(() => {
                done(new Error('Expected method to reject.'));
            })
            .catch((err) => {
                sinon.assert.alwaysCalledWith(findAddressSpy, '');
                assert.strictEqual(err.name, 'Error');
                assert.strictEqual(err.message, 'Failed to retrieve address list');
                done();
            })
            .catch(done);
    });
});
