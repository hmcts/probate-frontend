'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ExecutorsWhenDied = require('app/steps/ui/executors/whendied/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

describe('executors-who-died', () => {
    let testWrapper, sessionData;
    const expectedNextUrlForExecsWhenDied = ExecutorsWhenDied.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorsWhoDied');
        sessionData = {
            'applicant': {
                'firstName': 'john', 'lastName': 'theapplicant'
            },
            'executors': {
                'executorsNumber': 3,
                'list': [
                    {'firstName': 'john', 'lastName': 'theapplicant', 'isApplying': 'Yes', 'isApplicant': true},
                    {'fullName': 'another name'},
                    {'fullName': 'harvey smith'}
                ]
            },
            'executorName': ['many', 'harvey']
        };
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        testHelpBlockContent.runTest('WillLeft');

        it('test content loaded on the page', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            const errorsToTest = ['executorsWhoDied'];
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {};
                    testWrapper.testErrors(done, data, 'required', errorsToTest);
                });
        });

        it(`test it redirects to next page: ${expectedNextUrlForExecsWhenDied}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        executorsWhoDied: 'harvey smith'
                    };
                    testWrapper.testRedirect(done, data, expectedNextUrlForExecsWhenDied);
                });
        });
    });
});
