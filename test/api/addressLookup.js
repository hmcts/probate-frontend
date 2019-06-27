/*global describe, it, before, beforeEach, after, afterEach */
'use strict';
const assert = require('chai').assert;
const sinon = require('sinon');
const testConfig = require('test/config');
const PostcodeAddress = require('app/services/PostcodeAddress');
const postcodeAddress = new PostcodeAddress();

describe('addressLookup tests', function () {
    let findAddressSpy;

    beforeEach(function () {
        findAddressSpy = sinon.spy(PostcodeAddress.prototype, 'get');
    });

    afterEach(function () {
        findAddressSpy.restore();
    });

    it('Should successfully retrieve address list with postcode', function (done) {
        postcodeAddress.get(testConfig.postcodeLookup.singleAddressPostcode)
            .then(function(actualResponse) {
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

    it('Should reject the process using an empty postcode', function (done) {
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
