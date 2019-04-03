'use strict';

const {expect} = require('chai');
const FeesCalculator = require('app/utils/FeesCalculatorOld');
const FeesLookup = require('app/services/FeesLookup');
const sinon = require('sinon');
const Service = require('app/services/Service');
let feesCalculator;
let formdata;
let feesLookupStub;
let fetchJsonStub;

describe('FeesCalculatorOld', () => {
    describe('calc()', () => {
        beforeEach(() => {
            feesCalculator = new FeesCalculator('http://localhost', 'dummyId');
            fetchJsonStub = sinon.stub(Service.prototype, 'fetchJson');
            feesLookupStub = sinon.stub(FeesLookup.prototype, 'get');
        });

        afterEach(() => {
            fetchJsonStub.restore();
            feesLookupStub.restore();
        });

        it('should calculate probate fees for iht and both sets of copies', (done) => {
            formdata = {
                iht: {
                    netValue: 6000
                },
                copies: {
                    uk: 1,
                    overseas: 2
                }
            };

            feesLookupStub.onCall(0).returns(Promise.resolve({
                'code': 'FEE0219',
                'description': 'Application for a grant of probate (Estate over £5000)',
                'version': 3,
                'fee_amount': 215
            }));
            feesLookupStub.onCall(1).returns(Promise.resolve({
                'code': 'FEE0003',
                'description': 'Additional copies of the grant representation',
                'version': 3,
                'fee_amount': 0.5
            }));
            feesLookupStub.onCall(2).returns(Promise.resolve({
                'code': 'FEE0003',
                'description': 'Additional copies of the grant representation',
                'version': 3,
                'fee_amount': 1
            }));

            const expectedResponse = {
                status: 'success',
                applicationfee: 215,
                applicationvalue: 6000,
                ukcopies: 1,
                ukcopiesfee: 0.50,
                overseascopies: 2,
                overseascopiesfee: 1,
                total: 216.50
            };

            fetchJsonStub.returns(Promise.resolve(''));

            feesCalculator.calc(formdata, 'dummyToken')
                .then((res) => {
                    expect(res).to.deep.equal(expectedResponse);
                    done();
                });
        });

        it('should calculate probate fees for iht < £5000 and both sets of copies', (done) => {
            formdata = {
                iht: {
                    netValue: 4000
                },
                copies: {
                    uk: 1,
                    overseas: 2
                }
            };

            feesLookupStub.onCall(0).returns(Promise.resolve({
                'code': 'FEE0003',
                'description': 'Additional copies of the grant representation',
                'version': 3,
                'fee_amount': 0.5
            }));
            feesLookupStub.onCall(1).returns(Promise.resolve({
                'code': 'FEE0003',
                'description': 'Additional copies of the grant representation',
                'version': 3,
                'fee_amount': 1
            }));

            const expectedResponse = {
                status: 'success',
                applicationfee: 0,
                applicationvalue: 4000,
                ukcopies: 1,
                ukcopiesfee: 0.50,
                overseascopies: 2,
                overseascopiesfee: 1,
                total: 1.50
            };

            fetchJsonStub.returns(Promise.resolve(''));

            feesCalculator.calc(formdata, 'dummyToken')
                .then((res) => {
                    expect(res).to.deep.equal(expectedResponse);
                    done();
                });
        });

        it('should handle errors when fees api service is unavailable', (done) => {
            formdata = {
                iht: {
                    netValue: 6000
                },
                copies: {
                    uk: 1,
                    overseas: 2
                }
            };

            feesLookupStub.onCall(0).returns(Promise.resolve(
                'Error:FetchError: request to http://localhost/fees/lookup?amount_or_volume=6000&applicant_type=personal&channel=default&event=issue&jurisdiction1=family&jurisdiction2=probate+registry&service=probate failed, reason: connect ECONNREFUSED 127.0.0.1:80'
            ));
            feesLookupStub.onCall(1).returns(Promise.resolve(
                'Error:FetchError: request to http://localhost/fees/lookup?amount_or_volume=1&applicant_type=all&channel=default&event=copies&jurisdiction1=family&jurisdiction2=probate+registry&service=probate failed, reason: connect ECONNREFUSED 127.0.0.1:80'
            ));
            feesLookupStub.onCall(2).returns(Promise.resolve(
                'Error:FetchError: request to http://localhost/fees/lookup?amount_or_volume=2&applicant_type=all&channel=default&event=copies&jurisdiction1=family&jurisdiction2=probate+registry&service=probate failed, reason: connect ECONNREFUSED 127.0.0.1:80'
            ));

            const expectedResponse = {
                status: 'failed',
                applicationfee: 0,
                applicationvalue: 6000,
                ukcopies: 1,
                ukcopiesfee: 0,
                overseascopies: 2,
                overseascopiesfee: 0,
                total: 0
            };

            fetchJsonStub.returns(Promise.resolve(''));

            feesCalculator.calc(formdata, 'dummyToken')
                .then((res) => {
                    expect(res).to.deep.equal(expectedResponse);
                    done();
                });
        });

        it('should handle errors when one of the fees api call is unavailable', (done) => {
            formdata = {
                iht: {
                    netValue: 6000
                },
                copies: {
                    uk: 1,
                    overseas: 2
                }
            };

            feesLookupStub.onCall(0).returns(Promise.resolve({
                'code': 'string',
                'description': 'string',
                'fee_amount': 0,
                'version': 0
            }));
            feesLookupStub.onCall(1).returns(Promise.resolve(
                'Error:FetchError: request to http://localhost/fees/lookup?amount_or_volume=1&applicant_type=all&channel=default&event=copies&jurisdiction1=family&jurisdiction2=probate+registry&service=probate failed, reason: connect ECONNREFUSED 127.0.0.1:80'
            ));
            feesLookupStub.onCall(2).returns(Promise.resolve({
                'code': 'FEE0003',
                'description': 'Additional copies of the grant representation',
                'version': 3,
                'fee_amount': 1
            }));

            const expectedResponse = {
                status: 'failed',
                applicationfee: 0,
                applicationvalue: 6000,
                ukcopies: 1,
                ukcopiesfee: 0,
                overseascopies: 2,
                overseascopiesfee: 1,
                total: 1
            };

            fetchJsonStub.returns(Promise.resolve(''));

            feesCalculator.calc(formdata, 'dummyToken')
                .then((res) => {
                    expect(res).to.deep.equal(expectedResponse);
                    done();
                });
        });

        it('should handle errors when one of the fees api call is not found', (done) => {
            formdata = {
                iht: {
                    netValue: 6000
                },
                copies: {
                    uk: 1,
                    overseas: 2
                }
            };

            feesLookupStub.onCall(0).returns(Promise.resolve({
                'message': 'fee for code=LookupFeeDto(service=probate, jurisdiction1=family, jurisdiction2=probate registry, channel=default, event=issue, applicantType=personal, amountOrVolume=4000, unspecifiedClaimAmount=false, versionStatus=approved, author=null) was not found'
            }));
            feesLookupStub.onCall(1).returns(Promise.resolve({
                'code': 'FEE0003',
                'description': 'Additional copies of the grant representation',
                'version': 3,
                'fee_amount': 0.50
            }));
            feesLookupStub.onCall(2).returns(Promise.resolve({
                'code': 'FEE0003',
                'description': 'Additional copies of the grant representation',
                'version': 3,
                'fee_amount': 1
            }));

            const expectedResponse = {
                status: 'failed',
                applicationfee: 0,
                applicationvalue: 6000,
                ukcopies: 1,
                ukcopiesfee: 0.50,
                overseascopies: 2,
                overseascopiesfee: 1,
                total: 1.50
            };

            fetchJsonStub.returns(Promise.resolve(''));

            feesCalculator.calc(formdata, 'dummyToken')
                .then((res) => {
                    expect(res).to.deep.equal(expectedResponse);
                    done();
                });
        });
    });
});
