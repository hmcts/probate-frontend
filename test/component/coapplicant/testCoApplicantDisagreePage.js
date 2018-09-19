'use strict';

const TestWrapper = require('test/util/TestWrapper');
const sessionData = require('test/data/complete-form-undeclared');
const services = require('app/components/services');
const sinon = require('sinon');
const commonContent = require('app/resources/en/translation/common');

describe('co-applicant-disagree-page', () => {
    let testWrapper, checkAllAgreedStub;

    beforeEach(() => {
        testWrapper = new TestWrapper('CoApplicantDisagreePage');
        checkAllAgreedStub = sinon.stub(services, 'checkAllAgreed');

    });

    afterEach(() => {
        testWrapper.destroy();
        checkAllAgreedStub.restore();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test correct content is loaded on the page', (done) => {
            checkAllAgreedStub.returns(Promise.resolve('false'));
            const excludeKeys = [];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData.formdata)
                .end(() => {

                    const contentData = {
                        leadExecFullName: 'Bob Smith'
                    };

                    testWrapper.testContent(done, excludeKeys, contentData);
                });
        });

        it('test save and close link is not displayed on the page', (done) => {
            const playbackData = {};
            playbackData.saveAndClose = commonContent.saveAndClose;
            playbackData.signOut = commonContent.signOut;

            testWrapper.testContentNotPresent(done, playbackData);
        });
    });
});
