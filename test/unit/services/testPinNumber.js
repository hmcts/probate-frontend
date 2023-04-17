'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const PinNumber = require('app/services/PinNumber');
const FormatUrl = require('app/utils/FormatUrl');
const AsyncFetch = require('app/utils/AsyncFetch');

describe('PinNumberService', () => {
    describe('get()', () => {
        it('should call log() and fetchJson()', (done) => {
            const endpoint = '';
            const fetchOptions = {method: 'GET'};
            const phoneNumber = '02071234567';
            const pinNumber = new PinNumber(endpoint, 'abc123');
            const logSpy = sinon.spy(pinNumber, 'log');
            const fetchJsonSpy = sinon.stub(AsyncFetch, 'fetchJson');
            const fetchOptionsStub = sinon.stub(AsyncFetch, 'fetchOptions').returns(fetchOptions);
            const formatUrlStub = sinon.stub(FormatUrl, 'format').returns('/formattedUrl');

            pinNumber.get(phoneNumber);

            expect(pinNumber.log.calledOnce).to.equal(true);
            expect(pinNumber.log.calledWith('Get pin number')).to.equal(true);
            expect(formatUrlStub.calledOnce).to.equal(true);
            expect(formatUrlStub.calledWith(endpoint, `/invite/pin?phoneNumber=${phoneNumber}`)).to.equal(true);
            expect(AsyncFetch.fetchJson.calledOnce).to.equal(true);
            expect(AsyncFetch.fetchJson.calledWith('/formattedUrl', fetchOptions)).to.equal(true);

            logSpy.restore();
            fetchJsonSpy.restore();
            fetchOptionsStub.restore();
            formatUrlStub.restore();
            done();
        });
    });
});
