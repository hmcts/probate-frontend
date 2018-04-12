const TestWrapper = require('test/util/TestWrapper'),
sinon = require('sinon'),
when = require('when'),
services = require('app/components/services'),
CoApplicantStartPage = require('app/steps/ui/coapplicant/startpage/index');

describe('pin-page', () => {
    let testWrapper;
    let loadFormDataStub;
    const expectedNextUrlForCoAppStartPage = CoApplicantStartPage.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('PinPage');
        loadFormDataStub = sinon.stub(services, 'loadFormData');
    });

    afterEach(() => {
        testWrapper.destroy();
        loadFormDataStub.restore();

    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test right content loaded on the page', (done) => {
            const excludeKeys = [];
            testWrapper.agent.post('/prepare-session-field/validLink/true')
                .end(() => {
                    testWrapper.testContent(done, excludeKeys);
                });
        });

        it(`test it redirects to next page: ${expectedNextUrlForCoAppStartPage}`, (done) => {
            loadFormDataStub.returns(when(Promise.resolve({formdata: {declaration: {}}})));
            const data = {pin: '12345'};
            testWrapper.agent.post('/prepare-session-field/pin/12345')
                .end(() => {
                    testWrapper.testRedirect(done, data, expectedNextUrlForCoAppStartPage);
                });
        });


        it('test error messages displayed for missing data', (done) => {
            const data = {pin: ''};

            testWrapper.testErrors(done, data, 'required', ['pin']);
        });

        it('test error messages displayed for invalid data', (done) => {
            const data = {pin: 'NOT_A_PIN'};

            testWrapper.testErrors(done, data, 'invalid', ['pin']);
        });

        it('test error messages displayed for incorrect pin data', (done) => {
            const data = {pin: '12345'};
            testWrapper.agent.post('/prepare-session-field/pin/54321')
                .end(() => {
                    testWrapper.testErrors(done, data, 'incorrect', ['pin']);
            });
        });

    });
});
