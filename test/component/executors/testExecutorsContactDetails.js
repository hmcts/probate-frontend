'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ExecutorAddress = require('app/steps/ui/executors/address/index');

describe('executors-contact-details', () => {
    let testWrapper, sessionData;
    const expectedNextUrlForExecAddress = ExecutorAddress.getUrl(1);

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorContactDetails');
        sessionData = {
            'applicant': {
                'firstName': 'john', 'lastName': 'theapplicant'
            },
            'executors': {
                'executorsNumber': 3,
                'list': [
                    {'fullName': 'john', 'isApplying': true, 'isApplicant': true},
                    {'fullName': 'other applicant', 'isApplying': true, 'isApplicant': true},
                    {'fullName': 'harvey', 'isApplying': true, 'isApplicant': true}
                ]
            }
        };
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test correct content is loaded on the page', (done) => {
            const excludeKeys = [];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {

                    const contentData = {
                        executorName: 'other applicant'
                    };
                    testWrapper.testContent(done, excludeKeys, contentData);
                });

        });

        it('test error messages displayed if no data entered', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const errorsToTest = ['email', 'mobile'];
                    const data = {
                        index: 1,
                        email: '',
                        mobile: ''
                    };
                    testWrapper.testErrors(done, data, 'required', errorsToTest);
                });
        });

        it('test error messages displayed if no email entered', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        index: 1,
                        executorName: 'other applicant',
                        email: '',
                        mobile: '07336622022'
                    };
                    testWrapper.testErrors(done, data, 'required', ['email']);
                });
        });

        it('test error messages displayed if no mobile number entered', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        index: 1,
                        executorName: 'other applicant',
                        email: 'test@hotmail.com',
                        mobile: ''
                    };
                    testWrapper.testErrors(done, data, 'required', ['mobile']);
                });
        });

        it('test error messages displayed if invalid email entered', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        index: 1,
                        executorName: 'other applicant',
                        email: 'test@.com',
                        mobile: '+447663382082'
                    };
                    testWrapper.testErrors(done, data, 'invalid', ['email']);
                });
        });

        it('test error messages displayed if invalid mobile number entered', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        index: 1,
                        executorName: 'other applicant',
                        email: 'test@hotmail.com',
                        mobile: '+rr53t6463'
                    };
                    testWrapper.testErrors(done, data, 'invalid', ['mobile']);
                });
        });

        it('test error messages displayed if invalid data entered', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        index: 1,
                        executorName: 'other applicant',
                        email: 'b@.m',
                        mobile: '075r5r5r5r'
                    };
                    testWrapper.testErrors(done, data, 'invalid');
                });
        });

        it(`test it redirects to address page: ${expectedNextUrlForExecAddress}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        executorName: 'other applicant',
                        email: 'test@hotmail.com',
                        mobile: '+447663382082'
                    };
                    testWrapper.testRedirect(done, data, expectedNextUrlForExecAddress);
                });
        });

    });
});
