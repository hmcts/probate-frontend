'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const PostcodeAddress = require('app/services/PostcodeAddress');

describe('PostcodeAddressService', () => {
    describe('get()', () => {
        it('should call log() and fetchJson()', (done) => {
            const endpoint = 'http://localhost';
            const fetchOptions = {method: 'GET'};
            const postcode = 'SW1A 1AA';
            const postcodeAddress = new PostcodeAddress(endpoint, 'abc123');
            const logSpy = sinon.spy(postcodeAddress, 'log');
            const fetchJsonSpy = sinon.spy(postcodeAddress, 'fetchJson');
            const fetchOptionsStub = sinon.stub(postcodeAddress, 'fetchOptions').returns(fetchOptions);

            postcodeAddress.get(postcode);

            expect(postcodeAddress.log.calledOnce).to.equal(true);
            expect(postcodeAddress.log.calledWith('Get postcode address')).to.equal(true);
            expect(postcodeAddress.fetchJson.calledOnce).to.equal(true);
            expect(postcodeAddress.fetchJson.calledWith(`${endpoint}?postcode=${encodeURIComponent(postcode)}`, fetchOptions)).to.equal(true);

            logSpy.restore();
            fetchJsonSpy.restore();
            fetchOptionsStub.restore();
            done();
        });
    });
});
