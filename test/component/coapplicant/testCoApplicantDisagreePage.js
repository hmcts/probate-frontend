const TestWrapper = require('test/util/TestWrapper'),
      sessionData = require('test/data/complete-form-undeclared'),
      services = require('app/components/services'),
sinon = require('sinon');

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
    });
});
