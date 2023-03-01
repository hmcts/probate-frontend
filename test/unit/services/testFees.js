'use strict';

const {assert, expect} = require('chai');
const Fees = require('app/services/Fees');
const sinon = require('sinon');
const Service =require('app/services/Service');
let expectedResponse;
let fees;
let headers;
let data;
let url;
let fetchJsonStub;

describe('Fees', () => {
    describe('get Fees ()', () => {
        beforeEach(() => {
            expectedResponse = require('test/data/paymentfees/paymentfees-response');
            fees = new Fees('http://localhost', 'dummyId');
            url = 'http://localhost/fees?applicant_type=all&jurisdiction1=family&service=probate';
            headers = {
                authToken: 'dummyToken'
            };
            data = {
                applicant_type: 'all',
                jurisdiction1: 'family',
                service: 'probate'
            };
        });

        afterEach(() => {
            fetchJsonStub.restore();
        });

        it('should return the correct response when fees service available', (done) => {
            fetchJsonStub = sinon.stub(Service.prototype, 'fetchJson').returns(Promise.resolve(expectedResponse));

            fees.get(data, headers)
                .then((res) => {
                    expect(res).to.deep.equal(expectedResponse);
                });

            assert.equal(fetchJsonStub.getCall(0).args[0], url);
            done();
        });

        it('should return the correct response when fees service unavailable', (done) => {
            const errMsg = 'FetchError: request to http://localhost/fees?applicant_type=all&' +
                'jurisdiction1=family&service=probate failed, reason: connect ECONNREFUSED 127.0.0.1:80';

            fetchJsonStub = sinon.stub(Service.prototype, 'fetchJson').returns(Promise.resolve(errMsg));

            fees.get(data, headers)
                .then((res) => {
                    expect(res).to.deep.equal(errMsg);
                });

            assert.equal(fetchJsonStub.getCall(0).args[0], url);
            done();
        });
    });
});
