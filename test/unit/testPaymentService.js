'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const rewire = require('rewire');
const Payment = rewire('app/services/Payment');

describe('PaymentService', () => {
    describe('get()', () => {
        it('should call log() and fetchJson()', (done) => {
            const endpoint = 'http://localhost';
            const fetchOptions = {method: 'GET'};
            const data = {paymentId: 'pay123'};
            const payment = new Payment(endpoint, 'abc123');
            const logSpy = sinon.spy(payment, 'log');
            const fetchJsonSpy = sinon.spy(payment, 'fetchJson');
            const fetchOptionsStub = sinon.stub(payment, 'fetchOptions').returns(fetchOptions);

            payment.get(data);

            expect(payment.log.calledOnce).to.equal(true);
            expect(payment.log.calledWith('Get payment')).to.equal(true);
            expect(payment.fetchJson.calledOnce).to.equal(true);
            expect(payment.fetchJson.calledWith(`${endpoint}/${data.paymentId}`, fetchOptions)).to.equal(true);

            logSpy.restore();
            fetchJsonSpy.restore();
            fetchOptionsStub.restore();
            done();
        });
    });

    describe('post()', () => {
        it('should call log() and fetchJson()', (done) => {
            const endpoint = 'http://localhost';
            const fetchOptions = {method: 'POST'};
            const data = {paymentId: 'pay123'};
            const payment = new Payment(endpoint, 'abc123');
            const logSpy = sinon.spy(payment, 'log');
            const fetchJsonSpy = sinon.spy(payment, 'fetchJson');
            const fetchOptionsStub = sinon.stub(payment, 'fetchOptions').returns(fetchOptions);
            const revert = Payment.__set__('paymentData', {
                createPaymentData: () => ({
                    reference: 'ref123'
                })
            });

            const result = payment.post(data, endpoint);

            expect(payment.log.calledOnce).to.equal(true);
            expect(payment.log.calledWith('Post payment')).to.equal(true);
            expect(payment.fetchJson.calledOnce).to.equal(true);
            expect(payment.fetchJson.calledWith(endpoint, fetchOptions)).to.equal(true);
            expect(result[1]).to.equal('ref123');

            logSpy.restore();
            fetchJsonSpy.restore();
            fetchOptionsStub.restore();
            revert();
            done();
        });
    });
});
