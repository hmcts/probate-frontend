'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const rewire = require('rewire');
const ProbateCcdCasePaymentStatus = rewire('app/services/ProbateCcdCasePaymentStatus');
const CcdCasePaymentStatus = require('app/services/CcdCasePaymentStatus');

describe('ProbateCcdCasePaymentStatusService', () => {
    describe('post()', () => {
        it('should call super.post()', (done) => {
            const submitData = {applicantFirstName: 'Fred'};
            const revert = ProbateCcdCasePaymentStatus.__set__('submitData', sinon.stub().returns(submitData));
            const endpoint = 'http://localhost';
            const probateCcdCasePaymentStatus = new ProbateCcdCasePaymentStatus(endpoint, 'abc123');
            const postStub = sinon.stub(CcdCasePaymentStatus.prototype, 'post');

            probateCcdCasePaymentStatus.post({testData: true}, {testCtx: true});

            expect(postStub.calledOnce).to.equal(true);
            expect(postStub.calledWith(
                {testCtx: true},
                'Post probate ccd case payment status',
                `${endpoint}/updatePaymentStatus`,
                {submitdata: submitData}
            )).to.equal(true);

            revert();
            postStub.restore();
            done();
        });
    });
});
