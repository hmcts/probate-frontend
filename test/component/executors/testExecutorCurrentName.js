const TestWrapper = require('test/util/TestWrapper'),
    ExecutorContactDetails = require('app/steps/ui/executors/contactdetails/index'),
    ExecutorCurrentName  = require('app/steps/ui/executors/currentname/index');

describe('executor-current-name', () => {
    let testWrapper, sessionData;
    const ContactDetailsURL = ExecutorContactDetails.getUrl();
    const FirstExecURL = ExecutorCurrentName.getUrl(4);
    const NextExecURL = ExecutorCurrentName.getUrl(6);

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorCurrentName');
        sessionData = {
            'executors': {
                'list': [
                    {'firstName': 'john', 'lastName': 'theapplicant', 'isApplying': true, 'isApplicant': true},
                    {'fullName': 'executor name1', hasOtherName: false},
                    {'fullName': 'executor name2', hasOtherName: true},
                    {'fullName': 'executor name3', hasOtherName: false},
                    {'fullName': 'executor name4', hasOtherName: true},
                    {'fullName': 'executor name5', hasOtherName: false},
                    {'fullName': 'executor name6', hasOtherName: true}
                ]
            }
        };
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test content loaded on the page', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        executorFullName: 'executor name2',
                    };
                    testWrapper.testContent(done, [], contentData);
            });
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {};

            testWrapper.testErrors(done, data, 'required');
        });

        it('test errors message displayed for invalid currentname', (done) => {
            const errorsToTest = ['currentName'];
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        currentName: '< brian'
                    };
                testWrapper.testErrors(done, data, 'invalid', errorsToTest);
            });
        });

        it(`test it redirects to next executor current name page, first exec: ${FirstExecURL}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        currentName: 'another name2'
                    };
                    testWrapper.testRedirect(done, data, FirstExecURL);
                });
        });

        it(`test it redirects to next executor current name page, subsequent exec: ${NextExecURL}`, (done) => {
            testWrapper.pageUrl = FirstExecURL;
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        currentName: 'another name'
                    };
                    testWrapper.testRedirect(done, data, NextExecURL);
                });
        });

        it(`test it redirects to executor contact details page, final exec: ${ContactDetailsURL}`, (done) => {
            testWrapper.pageUrl = NextExecURL;
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        currentName: 'another name also'
                    };
                    testWrapper.testRedirect(done, data, ContactDetailsURL);
                });
        });
    });
});
