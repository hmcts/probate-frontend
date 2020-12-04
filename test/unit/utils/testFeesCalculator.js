// eslint-disable-line max-lines
/* eslint-disable no-unused-expressions */
'use strict';

const expect = require('chai').expect;
const FeesCalculator = require('app/utils/FeesCalculator');
const FeesLookup = require('app/services/FeesLookup');
const sinon = require('sinon');
const Service = require('app/services/Service');
const config = require('config');

let feesCalculator;
let formdata;
let feesLookupStub;
let fetchJsonStub;

describe('FeesCalculator', () => {
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

        xit('should pass the new issuesData when the feature toggle is on', (done) => {
            formdata = {
                iht: {
                    netValue: 6000
                },
                copies: {
                    uk: 0,
                    overseas: 0
                }
            };

            feesCalculator.calc(formdata, 'dummyToken', {ft_newfee_register_code: true});

            const issuesData = config.services.feesRegister.newfee_issuesData;
            issuesData.amount_or_volume = 6000;
            expect(feesLookupStub.getCall(0).calledWith(sinon.match(issuesData, 'dummyToken'))).to.be.true;

            done();

        });

        it('should pass the old issuesData when the feature toggle is off', (done) => {
            formdata = {
                iht: {
                    netValue: 6000
                },
                copies: {
                    uk: 0,
                    overseas: 0
                }
            };

            feesCalculator.calc(formdata, 'dummyToken', {ft_newfee_register_code: false});

            const issuesData = config.services.feesRegister.issuesData;
            issuesData.amount_or_volume = 6000;
            const spyCall0 = feesLookupStub.getCall(0);
            expect(spyCall0.calledWith(sinon.match(issuesData, 'dummyToken'))).to.be.true;

            done();

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
                'fee_amount': 1.5
            }));
            feesLookupStub.onCall(2).returns(Promise.resolve({
                'code': 'FEE0003',
                'description': 'Additional copies of the grant representation',
                'version': 3,
                'fee_amount': 3
            }));

            const expectedResponse = {
                status: 'success',
                applicationfee: 215,
                applicationvalue: 6000,
                ukcopies: 1,
                ukcopiesfee: 1.50,
                overseascopies: 2,
                overseascopiesfee: 3,
                total: 219.50,
                applicationcode: 'FEE0219',
                applicationversion: 3,
                ukcopiescode: 'FEE0003',
                ukcopiesversion: 3,
                overseascopiescode: 'FEE0003',
                overseascopiesversion: 3
            };

            fetchJsonStub.returns(Promise.resolve(''));

            feesCalculator.calc(formdata, 'dummyToken')
                .then((res) => {
                    expect(res).to.deep.equal(expectedResponse);
                    done();
                });

        });

        xit('should calculate probate fees for iht < £5000 and both sets of copies', (done) => {
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
                'fee_amount': 1.5
            }));
            feesLookupStub.onCall(1).returns(Promise.resolve({
                'code': 'FEE0003',
                'description': 'Additional copies of the grant representation',
                'version': 3,
                'fee_amount': 3
            }));

            const expectedResponse = {
                status: 'success',
                applicationfee: 0,
                applicationvalue: 4000,
                ukcopies: 1,
                ukcopiesfee: 1.50,
                overseascopies: 2,
                overseascopiesfee: 3,
                applicationcode: '',
                applicationversion: 0,
                total: 4.50,
                ukcopiescode: 'FEE0003',
                ukcopiesversion: 3,
                overseascopiescode: 'FEE0003',
                overseascopiesversion: 3
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
                total: 0,
                applicationcode: '',
                applicationversion: 0,
                ukcopiescode: '',
                ukcopiesversion: 0,
                overseascopiescode: '',
                overseascopiesversion: 0
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
                'code': 'FEE0219',
                'description': 'Application for a grant of probate (Estate over £5000)',
                'version': 3,
                'fee_amount': 215
            }));
            feesLookupStub.onCall(1).returns(Promise.resolve(
                'Error:FetchError: request to http://localhost/fees/lookup?amount_or_volume=1&applicant_type=all&channel=default&event=copies&jurisdiction1=family&jurisdiction2=probate+registry&service=probate failed, reason: connect ECONNREFUSED 127.0.0.1:80'
            ));
            feesLookupStub.onCall(2).returns(Promise.resolve({
                'code': 'FEE0003',
                'description': 'Additional copies of the grant representation',
                'version': 3,
                'fee_amount': 3
            }));

            const expectedResponse = {
                status: 'failed',
                applicationfee: 215,
                applicationvalue: 6000,
                ukcopies: 1,
                ukcopiesfee: 0,
                overseascopies: 2,
                overseascopiesfee: 3,
                total: 218,
                applicationcode: 'FEE0219',
                applicationversion: 3,
                ukcopiescode: '',
                ukcopiesversion: 0,
                overseascopiescode: 'FEE0003',
                overseascopiesversion: 3
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
                'fee_amount': 1.50
            }));
            feesLookupStub.onCall(2).returns(Promise.resolve({
                'code': 'FEE0003',
                'description': 'Additional copies of the grant representation',
                'version': 3,
                'fee_amount': 3
            }));

            const expectedResponse = {
                status: 'failed',
                applicationfee: 0,
                applicationvalue: 6000,
                ukcopies: 1,
                ukcopiesfee: 1.50,
                overseascopies: 2,
                overseascopiesfee: 3,
                total: 4.50,
                applicationcode: '',
                applicationversion: 0,
                ukcopiescode: 'FEE0003',
                ukcopiesversion: 3,
                overseascopiescode: 'FEE0003',
                overseascopiesversion: 3
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
