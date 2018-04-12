const TestWrapper = require('test/util/TestWrapper'),
services = require('app/components/services'),
sinon = require('sinon');


describe('co-applicant-start-page', () => {
    let testWrapper, checkAllAgreedStub;

    beforeEach(() => {
        testWrapper = new TestWrapper('CoApplicantStartPage');
        checkAllAgreedStub = sinon.stub(services, 'checkAllAgreed');
    });

    afterEach(() => {
        testWrapper.destroy();
        checkAllAgreedStub.restore();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test correct content is loaded on the page', (done) => {
            checkAllAgreedStub.returns(Promise.resolve('false'))
            const sessionData = {
                'applicant': {
                    'firstName': 'john', 'lastName': 'theapplicant'
                },
                'deceased': {
                    'firstName': 'dave', 'lastName': 'bassett'
                },
                'pin': '12345'
            };

            const excludeKeys = [];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {

                    const contentData = {
                        leadExecutorName: 'john theapplicant',
                        deceasedName: 'dave bassett',
                        pin: ''
                    };
                    testWrapper.testContent(done, excludeKeys, contentData);
                });
        });

    });
});