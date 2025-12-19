'use strict';

const TestWrapper = require('test/util/TestWrapper');
const testCommonContent = require('test/component/common/testCommonContent');
const caseTypes = require('app/utils/CaseTypes');

describe('executors-names', () => {
    let testWrapper, sessionData;

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorsNames');
        sessionData = {
            type: caseTypes.GOP,
            ccdCase: {
                state: 'Pending',
                id: 1234567890123456
            },
            applicant: {
                firstName: 'John',
                lastName: 'TheApplicant'
            },
            executors: {
                executorsNumber: 2,
                list: [
                    {firstName: 'John', lastName: 'TheApplicant', isApplying: 'optionYes', isApplicant: true}
                ]
            }
        };
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ExecutorsNames', null, null, [], false, {type: caseTypes.GOP});

        it('test correct content loaded on the page when lead applicant does not have an alias', (done) => {
            const idsToExclude = ['questionWithCodicil', 'paragraphWithCodicil'];
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, {}, idsToExclude);
                });
        });

        it('test correct content loaded on the page when lead applicant does have an alias', (done) => {
            sessionData.executors.list[0].alias = 'Bobby Alias';
            const idsToExclude = ['questionWithCodicil', 'paragraphWithCodicil'];
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, {}, idsToExclude);
                });
        });

        it('test errors message displayed for invalid data', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        executorName: ['x']
                    };
                    const errorsToTest = ['executorName'];

                    testWrapper.testErrors(done, data, 'invalid', errorsToTest);
                });
        });

        it('test errors message displayed for no name entered', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        executorName: ''
                    };
                    const errorsToTest = ['executorName'];

                    testWrapper.testErrors(done, data, 'required', errorsToTest);
                });
        });

        it('test errors message displayed when invalid name entered', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        executorName: ['>bob bassett']
                    };
                    const errorsToTest = ['executorName'];

                    testWrapper.testErrors(done, data, 'invalid', errorsToTest);
                });
        });
    });
});
