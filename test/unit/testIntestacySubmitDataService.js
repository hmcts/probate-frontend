'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const rewire = require('rewire');
const IntestacySubmitData = rewire('app/services/IntestacySubmitData');
const SubmitData = require('app/services/SubmitData');
const config = require('app/config');

describe('IntestacySubmitDataService', () => {
    describe('post()', () => {
        it('should call super.post()', (done) => {
            const endpoint = 'http://localhost';
            const data = {applicant: {email: 'fred@example.com'}};
            const ctx = {testCtx: true};
            const softStop = false;
            const intestacySubmitData = new IntestacySubmitData(endpoint, 'abc123');
            const path = intestacySubmitData.replaceEmailInPath(config.services.orchestrator.paths.submissions, data.applicant.email);
            const postStub = sinon.stub(SubmitData.prototype, 'post');
            data.softStop = softStop;

            intestacySubmitData.post(data, ctx, softStop);

            expect(postStub.calledOnce).to.equal(true);
            expect(postStub.calledWith(
                ctx,
                'Post submit data',
                endpoint + path,
                data
            )).to.equal(true);

            postStub.restore();
            done();
        });
    });
});
