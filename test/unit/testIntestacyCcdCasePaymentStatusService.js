'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const rewire = require('rewire');
const IntestacyCcdCasePaymentStatus = rewire('app/services/IntestacyCcdCasePaymentStatus');
const CcdCasePaymentStatus = require('app/services/CcdCasePaymentStatus');
const config = require('app/config');

describe('IntestacyCcdCasePaymentStatus', () => {
    describe('post()', () => {
        it('should call super.post()', (done) => {
            const submitData = {applicantFirstName: 'Fred'};
            const revert = IntestacyCcdCasePaymentStatus.__set__('submitData', sinon.stub().returns(submitData));
            const endpoint = 'http://localhost';
            const intestacyCcdCasePaymentStatus = new IntestacyCcdCasePaymentStatus(endpoint, 'abc123');
            const postStub = sinon.stub(CcdCasePaymentStatus.prototype, 'post');

            intestacyCcdCasePaymentStatus.post({testData: true}, {testCtx: true});

            expect(postStub.calledOnce).to.equal(true);
            expect(postStub.calledWith(
                {testCtx: true},
                'Post intestacy ccd case payment status',
                endpoint + config.services.orchestrator.paths.payments,
                submitData
            )).to.equal(true);

            revert();
            postStub.restore();
            done();
        });
    });
});
