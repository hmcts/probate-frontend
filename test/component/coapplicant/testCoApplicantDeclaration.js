const TestWrapper = require('test/util/TestWrapper'),
    sinon = require('sinon'),
    when = require('when'),
    services = require('app/components/services'),
    json = require('app/resources/en/translation/coapplicant/declaration.json'),
    sessionData = require('test/data/complete-form-undeclared'),
    CoApplicantAgreePage = require('app/steps/ui/coapplicant/agreepage/index'),
    CoApplicantDisagreePage = require('app/steps/ui/coapplicant/disagreepage/index');

describe('co-applicant-declaration', () => {
    let testWrapper, updateInviteDataStub, checkAllAgreedStub;
    const expectedNextUrlForCoAppAgree = CoApplicantAgreePage.getUrl();
    const expectedNextUrlForCoAppDisagree = CoApplicantDisagreePage.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('CoApplicantDeclaration');
        updateInviteDataStub = sinon.stub(services, 'updateInviteData');
        checkAllAgreedStub = sinon.stub(services, 'checkAllAgreed');

    });

    afterEach(() => {
        testWrapper.destroy();
        updateInviteDataStub.restore();
        checkAllAgreedStub.restore();

    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test right content loaded on the page', (done) => {
            checkAllAgreedStub.returns(Promise.resolve('false'));
            const contentToExclude = [
                'executorNotApplyingHeader'
            ];

            testWrapper.agent.post('/prepare-session/form')
            .send(sessionData.formdata)
            .end(() => {
                const contentData = {
                    mainApplicantName: 'Bob Smith'
                };

                testWrapper.testContent(done, contentToExclude, contentData);
            });
        });

        it('test errors message displayed for missing data', (done) => {
            checkAllAgreedStub.returns(Promise.resolve('false'));

            const data = {};

            testWrapper.testErrors(done, data, 'required', []);
        });

        it(`test it redirects to agree page: ${expectedNextUrlForCoAppAgree}`, (done) => {
            checkAllAgreedStub.returns(Promise.resolve('false'));
            updateInviteDataStub.returns(when(Promise.resolve('Make it pass!')));
            const data = {
                'agreement': json.optionYes
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForCoAppAgree);
        });

        it(`test it redirects to disagree page: ${expectedNextUrlForCoAppDisagree}`, (done) => {
            updateInviteDataStub.returns(when(Promise.resolve('Make it pass!')));
            checkAllAgreedStub.returns(Promise.resolve('false'));

            const data = {
                'agreement': json.optionNo
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForCoAppDisagree);
        });

    });
});
