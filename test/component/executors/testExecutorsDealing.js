'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ExecutorsAlias = require('app/steps/ui/executors/alias');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('executors-dealing-with-estate', () => {
    let testWrapper, sessionData;
    const expectedNextUrlForExecAlias = ExecutorsAlias.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorsDealingWithEstate');
        sessionData = {
            type: caseTypes.GOP,
            ccdCase: {
                state: 'Pending',
                id: 1234567890123456
            },
            executors: {
                executorsNumber: 3,
                list: [
                    {firstName: 'John', lastName: 'TheApplicant', isApplying: true, isApplicant: true},
                    {fullName: 'Many Clouds', isApplying: true},
                    {fullName: 'Harvey Smith', isApplying: false}
                ]
            },
            applicant: {}
        };
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ExecutorsDealingWithEstate', null, null, [], false, {type: caseTypes.GOP});

        it('test correct content loaded on the page when lead applicant does not have an alias', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done);
                });
        });

        it('test correct content loaded on the page when lead applicant does have an alias', (done) => {
            sessionData.applicant.alias = 'Bobby Alias';
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            const errorsToTest = ['executorsApplying'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testErrors(done, {}, 'required', errorsToTest);
                });
        });

        it(`test it redirects to Executors Alias page: ${expectedNextUrlForExecAlias}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        executorsApplying: ['many clouds']
                    };

                    testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl();
                    testWrapper.testRedirect(done, data, expectedNextUrlForExecAlias);
                });
        });

        it('test errors message displayed for more than 3 additional applicants', (done) => {
            const errorsToTest = ['executorsApplying'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        executorsApplying: ['many clouds', 'many clouds', 'many clouds', 'many clouds']
                    };

                    testWrapper.testErrors(done, data, 'invalid', errorsToTest);
                });
        });
    });
});
