'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ExecutorCurrentName = require('app/steps/ui/executors/currentname/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

describe('executors-other-names', () => {
    let testWrapper, sessionData;
    const expectedNextUrlForExecCurrentName = ExecutorCurrentName.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorsWithOtherNames');
        sessionData = {
            applicant: {
                firstName: 'John',
                lastName: 'TheApplicant'
            },
            executors: {
                executorsNumber: 2,
                list: [
                    {firstName: 'John', lastName: 'TheApplicant', isApplying: 'Yes', isApplicant: true},
                    {fullName: 'Wibble Wobble-Woo', isApplying: true}
                ]
            }
        };
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('ExecutorsWithOtherNames');

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done);
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {};

            testWrapper.testErrors(done, data, 'required');
        });

        it(`test it redirects to Executors Current Name page: ${expectedNextUrlForExecCurrentName}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        executorsWithOtherNames: 'Wibble Wobble-Woo'
                    };
                    testWrapper.testRedirect(done, data, expectedNextUrlForExecCurrentName);
                });
        });
    });
});
