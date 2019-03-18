'use strict';

const {expect} = require('chai');
const FeesCalculator = require('app/utils/FeesCalculator');
const FeesLookup = require('app/services/FeesLookup');
const sinon = require('sinon');
const Service = require('app/services/Service');
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

        it('should calculate probate fees for iht and both sets of copies', (done) => {
            formdata = {
                iht: {
                    netValue: 60000
                },
                copies: {
                    uk: 2,
                    overseas: 3
                }
            };

            feesLookupStub.onCall(0).returns(Promise.resolve({code: 'FEE0219', description: 'Application for a grant of probate (Estate over £50000)', version: 3, fee_amount: 250}));
            feesLookupStub.onCall(1).returns(Promise.resolve({code: 'FEE0469', description: 'Copy of a document (10 pages or less). FEE AMOUNT = 10', version: 2, fee_amount: 10}));
            feesLookupStub.onCall(2).returns(Promise.resolve({code: 'FEE0003', description: 'Additional copies of the grant representation', version: 3, fee_amount: 0.5}));
            feesLookupStub.onCall(3).returns(Promise.resolve({code: 'FEE0469', description: 'Copy of a document (10 pages or less). FEE AMOUNT = 10', version: 2, fee_amount: 10}));
            feesLookupStub.onCall(4).returns(Promise.resolve({code: 'FEE0003', description: 'Additional copies of the grant representation', version: 3, fee_amount: 1}));

            const expectedResponse = {
                status: 'success',
                applicationfee: 250,
                applicationvalue: 60000,
                ukcopies: 2,
                ukcopiesfee: 10.5,
                overseascopies: 3,
                overseascopiesfee: 11,
                total: 271.50
            };

            fetchJsonStub.returns(Promise.resolve(''));

            feesCalculator.calc(formdata, 'dummyToken')
                .then((res) => {
                    expect(res).to.deep.equal(expectedResponse);
                    done();
                });

        });

        it('should calculate probate fees for iht < £50000 and both sets of copies', (done) => {
            formdata = {
                iht: {
                    netValue: 40000
                },
                copies: {
                    uk: 1,
                    overseas: 2
                }
            };

            feesLookupStub.onCall(0).returns(Promise.resolve({code: 'FEE0219', description: 'Application for a grant of probate (Estate less than £50000)', version: 3, fee_amount: 0}));
            feesLookupStub.onCall(1).returns(Promise.resolve({code: 'FEE0469', description: 'Copy of a document (10 pages or less). FEE AMOUNT = 10', version: 2, fee_amount: 10}));
            feesLookupStub.onCall(2).returns(Promise.resolve({code: 'FEE0469', description: 'Copy of a document (10 pages or less). FEE AMOUNT = 10', version: 2, fee_amount: 10}));
            feesLookupStub.onCall(3).returns(Promise.resolve({code: 'FEE0003', description: 'Additional copies of the grant representation', version: 3, fee_amount: 0.5}));

            const expectedResponse = {
                status: 'success',
                applicationfee: 0,
                applicationvalue: 40000,
                ukcopies: 1,
                ukcopiesfee: 10,
                overseascopies: 2,
                overseascopiesfee: 10.5,
                total: 20.5
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
                    netValue: 60000
                },
                copies: {
                    uk: 1,
                    overseas: 2
                }
            };

            feesLookupStub.onCall(0).returns(Promise.resolve(
                'Error:FetchError: request to http://localhost/fees/lookup?amount_or_volume=6000&applicant_type=all&channel=default&event=issue&jurisdiction1=family&jurisdiction2=probate+registry&service=probate failed, reason: connect ECONNREFUSED 127.0.0.1:80'
            ));
            feesLookupStub.onCall(1).returns(Promise.resolve(
                'Error:FetchError: request to http://localhost/fees/lookup?amount_or_volume=1&applicant_type=all&channel=default&event=copies&jurisdiction1=family&jurisdiction2=probate+registry&service=probate&keyword=DEF failed, reason: connect ECONNREFUSED 127.0.0.1:80'
            ));
            feesLookupStub.onCall(2).returns(Promise.resolve(
                'Error:FetchError: request to http://localhost/fees/lookup?amount_or_volume=1&applicant_type=all&channel=default&event=copies&jurisdiction1=family&jurisdiction2=probate+registry&service=probate&keyword=DEF failed, reason: connect ECONNREFUSED 127.0.0.1:80'
            ));
            feesLookupStub.onCall(3).returns(Promise.resolve(
                'Error:FetchError: request to http://localhost/fees/lookup?amount_or_volume=2&applicant_type=all&channel=default&event=copies&jurisdiction1=family&jurisdiction2=probate+registry&service=probate failed, reason: connect ECONNREFUSED 127.0.0.1:80'
            ));

            const expectedResponse = {
                status: 'failed',
                applicationfee: 0,
                applicationvalue: 60000,
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
                    netValue: 60000
                },
                copies: {
                    uk: 1,
                    overseas: 2
                }
            };

            feesLookupStub.onCall(0).returns(Promise.resolve({
                code: 'string',
                description: 'string',
                fee_amount: 250,
                version: 0
            }));
            feesLookupStub.onCall(1).returns(Promise.resolve(
                'Error:FetchError: request to http://localhost/fees/lookup?amount_or_volume=1&applicant_type=all&channel=default&event=copies&jurisdiction1=family&jurisdiction2=probate+registry&service=probate&keyword=DEF failed, reason: connect ECONNREFUSED 127.0.0.1:80'
            ));
            feesLookupStub.onCall(2).returns(Promise.resolve({
                code: 'FEE0469',
                description: 'Copy of a document (10 pages or less). FEE AMOUNT = 10',
                version: 2,
                fee_amount: 10
            }));
            feesLookupStub.onCall(3).returns(Promise.resolve({
                code: 'FEE0003',
                description: 'Additional copies of the grant representation',
                version: 3,
                fee_amount: 0.5
            }));

            const expectedResponse = {
                status: 'failed',
                applicationfee: 250,
                applicationvalue: 60000,
                ukcopies: 1,
                ukcopiesfee: 0,
                overseascopies: 2,
                overseascopiesfee: 10.5,
                total: 260.5
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
                    netValue: 60000
                },
                copies: {
                    uk: 1,
                    overseas: 2
                }
            };

            feesLookupStub.onCall(0).returns(Promise.resolve({'message': 'fee for code=LookupFeeDto(service=probate, jurisdiction1=family, jurisdiction2=probate registry, channel=default, event=issue, applicantType=all, amountOrVolume=4000, unspecifiedClaimAmount=false, versionStatus=approved, author=null) was not found'}));
            feesLookupStub.onCall(1).returns(Promise.resolve({code: 'FEE0469', description: 'Copy of a document (10 pages or less). FEE AMOUNT = 10', version: 2, fee_amount: 10}));
            feesLookupStub.onCall(2).returns(Promise.resolve({code: 'FEE0469', description: 'Copy of a document (10 pages or less). FEE AMOUNT = 10', version: 2, fee_amount: 10}));
            feesLookupStub.onCall(3).returns(Promise.resolve({code: 'FEE0003', description: 'Additional copies of the grant representation', version: 3, fee_amount: 0.5}));

            const expectedResponse = {
                status: 'failed',
                applicationfee: 0,
                applicationvalue: 60000,
                ukcopies: 1,
                ukcopiesfee: 10,
                overseascopies: 2,
                overseascopiesfee: 10.5,
                total: 20.5
            };

            fetchJsonStub.returns(Promise.resolve(''));

            feesCalculator.calc(formdata, 'dummyToken')
                .then((res) => {
                    expect(res).to.deep.equal(expectedResponse);
                    done();
                });
        });

        it('should handle errors when the keyword for the first copies is wrong', (done) => {
            formdata = {
                iht: {
                    netValue: 60000
                },
                copies: {
                    uk: 1,
                    overseas: 2
                }
            };

            feesLookupStub.onCall(0).returns(Promise.resolve({code: 'FEE0219', description: 'Application for a grant of probate (Estate over £50000)', version: 3, fee_amount: 250}));
            feesLookupStub.onCall(1).returns(Promise.resolve({message: 'fee for code=LookupFeeDto(service=probate, jurisdiction1=family, jurisdiction2=probate registry, channel=default, event=copies, keyword=WTF, applicantType=all, amountOrVolume=1, unspecifiedClaimAmount=false, versionStatus=approved, author=null) was not found'}));
            feesLookupStub.onCall(2).returns(Promise.resolve({message: 'fee for code=LookupFeeDto(service=probate, jurisdiction1=family, jurisdiction2=probate registry, channel=default, event=copies, keyword=WTF, applicantType=all, amountOrVolume=1, unspecifiedClaimAmount=false, versionStatus=approved, author=null) was not found'}));
            feesLookupStub.onCall(3).returns(Promise.resolve({code: 'FEE0003', description: 'Additional copies of the grant representation', version: 3, fee_amount: 0.5}));

            const expectedResponse = {
                status: 'failed',
                applicationfee: 250,
                applicationvalue: 60000,
                ukcopies: 1,
                ukcopiesfee: 0,
                overseascopies: 2,
                overseascopiesfee: 0.5,
                total: 250.5
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
