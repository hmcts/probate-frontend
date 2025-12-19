'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ExecutorCurrentName = require('app/steps/ui/executors/currentname');
const testCommonContent = require('test/component/common/testCommonContent');
const caseTypes = require('app/utils/CaseTypes');

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
                    {firstName: 'John', lastName: 'TheApplicant', isApplying: 'optionYes', isApplicant: true},
                    {fullName: 'Wibble Wobble-Woo', isApplying: true}
                ]
            }
        };
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ExecutorsWithOtherNames', null, null, [], false, {type: caseTypes.GOP});

        it('test content loaded on the page', (done) => {
            const sessionData = {
                type: caseTypes.GOP,
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required');
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
