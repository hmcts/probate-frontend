'use strict';

const expect = require('chai').expect;
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

    describe('getCasePayments()', () => {
        it('should call log() and fetchJson()', (done) => {
            const endpoint = 'http://localhost';
            const fetchOptions = {method: 'GET'};
            const data = {caseId: 'RC-1554-1335-2518-2256', caseType: 'gop'};
            const payment = new Payment(endpoint, 'abc123');
            const logSpy = sinon.spy(payment, 'log');
            const fetchJsonSpy = sinon.spy(payment, 'fetchJson');
            const fetchOptionsStub = sinon.stub(payment, 'fetchOptions').returns(fetchOptions);

            payment.getCasePayments(data);

            expect(payment.log.calledOnce).to.equal(true);
            expect(payment.log.calledWith('Getting all payments from case')).to.equal(true);
            expect(payment.fetchJson.calledOnce).to.equal(true);
            expect(payment.fetchJson.calledWith(`${endpoint}?ccd_case_type=${data.caseType}&ccd_case_number=${data.caseId}`, fetchOptions)).to.equal(true);

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

            payment.post(data, endpoint);

            expect(payment.log.calledOnce).to.equal(true);
            expect(payment.log.calledWith('Post payment')).to.equal(true);
            expect(payment.fetchJson.calledOnce).to.equal(true);
            expect(payment.fetchJson.calledWith(endpoint, fetchOptions)).to.equal(true);

            logSpy.restore();
            fetchJsonSpy.restore();
            fetchOptionsStub.restore();
            revert();
            done();
        });
    });

    describe('identifySuccessfulOrInitiatedPayment()', () => {
        it('should log() and capture a Success payment from list', (done) => {
            const endpoint = 'http://localhost';
            const casePayments = {
                'payments': [{
                    'amount': 219.50,
                    'ccd_case_number': '1554131023277701',
                    'payment_reference': 'RC-1554-1311-2865-4101',
                    'status': 'Failed'
                }, {
                    'amount': 219.50,
                    'ccd_case_number': '1554131023277701',
                    'payment_reference': 'RC-1554-1311-2865-4102',
                    'status': 'Success'
                }]
            };
            const payment = new Payment(endpoint, 'abc123');
            const logSpy = sinon.spy(payment, 'log');

            const response = payment.identifySuccessfulOrInitiatedPayment(casePayments);

            expect(payment.log.calledOnce).to.equal(true);
            expect(payment.log.calledWith('Found a successful payment: RC-1554-1311-2865-4102')).to.equal(true);
            expect(response.status).to.equal('Success');
            expect(response.payment_reference).to.equal('RC-1554-1311-2865-4102');

            logSpy.restore();
            done();
        });

        it('should log() and capture a Initiated payment from list', (done) => {
            const endpoint = 'http://localhost';
            const casePayments = {
                'payments': [{
                    'amount': 219.50,
                    'ccd_case_number': '1554131023277701',
                    'payment_reference': 'RC-1554-1311-2865-4101',
                    'status': 'Initiated'
                }, {
                    'amount': 219.50,
                    'ccd_case_number': '1554131023277701',
                    'payment_reference': 'RC-1554-1311-2865-4102',
                    'status': 'Failed'
                }]
            };
            const payment = new Payment(endpoint, 'abc123');
            const logSpy = sinon.spy(payment, 'log');

            const response = payment.identifySuccessfulOrInitiatedPayment(casePayments);

            expect(payment.log.calledOnce).to.equal(true);
            expect(payment.log.calledWith('Found an initiated payment: RC-1554-1311-2865-4101')).to.equal(true);
            expect(response.status).to.equal('Initiated');
            expect(response.payment_reference).to.equal('RC-1554-1311-2865-4101');

            logSpy.restore();
            done();
        });

        it('should log() and return an false for a list without Initiated or Success', (done) => {
            const endpoint = 'http://localhost';
            const casePayments = {
                'payments': [{
                    'amount': 219.50,
                    'ccd_case_number': '1554131023277701',
                    'payment_reference': 'RC-1554-1311-2865-4102',
                    'status': 'Failed'
                }]
            };
            const payment = new Payment(endpoint, 'abc123');
            const logSpy = sinon.spy(payment, 'log');

            const response = payment.identifySuccessfulOrInitiatedPayment(casePayments);

            expect(payment.log.calledOnce).to.equal(true);
            expect(payment.log.calledWith('No payments of Success or Initiated found.')).to.equal(true);
            expect(response).to.equal(false);

            logSpy.restore();
            done();
        });

        it('should log() and return an false for an empty list', (done) => {
            const endpoint = 'http://localhost';
            const casePayments = {
                'payments': []
            };
            const payment = new Payment(endpoint, 'abc123');
            const logSpy = sinon.spy(payment, 'log');

            const response = payment.identifySuccessfulOrInitiatedPayment(casePayments);

            expect(payment.log.calledOnce).to.equal(true);
            expect(payment.log.calledWith('No payments of Success or Initiated found.')).to.equal(true);
            expect(response).to.equal(false);

            logSpy.restore();
            done();
        });
    });
});
