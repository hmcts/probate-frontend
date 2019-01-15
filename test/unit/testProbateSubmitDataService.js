'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const rewire = require('rewire');
const ProbateSubmitData = rewire('app/services/ProbateSubmitData');
const SubmitData = require('app/services/SubmitData');

describe('ProbateSubmitDataService', () => {
    describe('post()', () => {
        it('should call super.post()', (done) => {
            const submitData = {applicantFirstName: 'Fred'};
            const revert = ProbateSubmitData.__set__('submitData', sinon.stub().returns(submitData));
            const endpoint = 'http://localhost';
            const data = {applicantEmail: 'fred@example.com'};
            const ctx = {testCtx: true};
            const softStop = false;
            const bodyData = Object.assign(submitData, {
                softStop: softStop,
                applicantEmail: data.applicantEmail
            });
            const probateSubmitData = new ProbateSubmitData(endpoint, 'abc123');
            const postStub = sinon.stub(SubmitData.prototype, 'post');

            probateSubmitData.post(data, ctx, softStop);

            expect(postStub.calledOnce).to.equal(true);
            expect(postStub.calledWith(
                ctx,
                'Post probate submit data',
                `${endpoint}/submit`,
                {submitdata: bodyData}
            )).to.equal(true);

            revert();
            postStub.restore();
            done();
        });
    });
});
