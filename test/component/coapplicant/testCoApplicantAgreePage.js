const TestWrapper = require('test/util/TestWrapper');
const sessionData = require('test/data/complete-form-undeclared');
const services = require('app/components/services');
const sinon = require('sinon');
const commonContent = require('app/resources/en/translation/common');

describe('co-applicant-agree-page', () => {
    let testWrapper;
    let checkAllAgreedStub;
    let contentData;

    beforeEach(() => {
        testWrapper = new TestWrapper('CoApplicantAgreePage');
        checkAllAgreedStub = sinon.stub(services, 'checkAllAgreed');
        contentData = {
            leadExecFullName: 'Bob Smith'
        };
    });

    afterEach(() => {
        testWrapper.destroy();
        checkAllAgreedStub.restore();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test correct content is loaded on the page when there are no codicils', (done) => {
            const contentToExclude = [
                'paragraph4-codicils'
            ];
            checkAllAgreedStub.returns(Promise.resolve('false'));

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData.formdata)
                .end(() => {
                    testWrapper.testContent(done, contentToExclude, contentData);
                });
        });

        it('test correct content is loaded on the page when there are codicils', (done) => {
            sessionData.formdata.will.codicils = commonContent.yes;
            const contentToExclude = [
                'paragraph4'
            ];
            checkAllAgreedStub.returns(Promise.resolve('false'));

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData.formdata)
                .end(() => {
                    testWrapper.testContent(done, contentToExclude, contentData);
                });
        });
    });
});