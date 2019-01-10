'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const PinNumber = require('app/services/PinNumber');

describe('PinNumberService', () => {
    describe('get()', () => {
        it('should call log() and fetchJson()', (done) => {
            const endpoint = 'http://localhost';
            const fetchOptions = {method: 'GET'};
            const phoneNumber = '02071234567';
            const pinNumber = new PinNumber(endpoint, 'abc123');
            const logSpy = sinon.spy(pinNumber, 'log');
            const fetchJsonSpy = sinon.spy(pinNumber, 'fetchJson');
            const fetchOptionsStub = sinon.stub(pinNumber, 'fetchOptions').returns(fetchOptions);

            pinNumber.get(phoneNumber);

            expect(pinNumber.log.calledOnce).to.equal(true);
            expect(pinNumber.log.calledWith('Get pin number')).to.equal(true);
            expect(pinNumber.fetchJson.calledOnce).to.equal(true);
            expect(pinNumber.fetchJson.calledWith(`${endpoint}/pin?phoneNumber=${phoneNumber}`, fetchOptions)).to.equal(true);

            logSpy.restore();
            fetchJsonSpy.restore();
            fetchOptionsStub.restore();
            done();
        });
    });
});
