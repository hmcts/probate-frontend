/*global describe, it, before, beforeEach, after, afterEach */
'use strict';
const assert = require('chai').assert;
const sinon = require('sinon');
const services = require('../../app/components/services');

describe('addressLookup tests', function () {
    let findAddressSpy;

    beforeEach(function () {
        findAddressSpy = sinon.spy(services, 'findAddress');
    });

    afterEach(function () {
        findAddressSpy.restore();
    });

    it('Should successfully retrieve address list with postcode', function (done) {

        services.findAddress('SW1H 9AJ')
            .then(function(actualResponse) {
                sinon.assert.alwaysCalledWith(findAddressSpy, 'SW1H 9AJ');
                assert.isArray(actualResponse);
                assert.lengthOf(actualResponse, 1);
                assert.deepPropertyVal(actualResponse[0], 'building_number', 102);
                assert.deepPropertyVal(actualResponse[0], 'organisation_name', 'MINISTRY OF JUSTICE');
                assert.deepPropertyVal(actualResponse[0], 'post_town', 'LONDON');
                assert.deepPropertyVal(actualResponse[0], 'postcode', 'SW1H 9AJ');
                assert.deepPropertyVal(actualResponse[0], 'sub_building_name', 'SEVENTH FLOOR');
                assert.deepPropertyVal(actualResponse[0], 'thoroughfare_name', 'PETTY FRANCE');
                assert.deepPropertyVal(actualResponse[0], 'uprn', '10033604583');
                assert.deepPropertyVal(actualResponse[0], 'formatted_address', 'Ministry of Justice\nSeventh Floor\n102 Petty France\nLondon\nSW1H 9AJ');
                done();
            })
            .catch(done);
    });

    it('Should retrieve an empty list', function (done) {

        services.findAddress('')
            .then(function(actualResponse) {
                sinon.assert.alwaysCalledWith(findAddressSpy, '');
                assert.isArray(actualResponse);
                assert.lengthOf(actualResponse, 0);
                done();
            })
            .catch(done);
    });

});
