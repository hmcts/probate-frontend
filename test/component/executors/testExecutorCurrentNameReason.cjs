'use strict';

const TestWrapper = require('test/util/TestWrapper.cjs');
const caseTypes = require('app/utils/CaseTypes.cjs');

describe('/executor-current-name-reason/', () => {
    let testWrapper, sessionData;

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorCurrentNameReason');
        sessionData = {
            type: caseTypes.GOP,
            ccdCase: {
                state: 'Pending',
                id: 1234567890123456
            },
            executors: {
                list: [
                    {firstName: 'John', lastName: 'TheApplicant', isApplying: true, isApplicant: true},
                    {fullName: 'Executor Name1', isApplying: false},
                    {fullName: 'Executor Name2', isApplying: true, currentName: 'Name2 Executor', hasOtherName: true},
                    {fullName: 'Executor Name3', isApplying: true, hasOtherName: false},
                    {fullName: 'Executor Name4', isApplying: true, hasOtherName: true},
                    {fullName: 'Executor Name5', isApplying: false},
                    {fullName: 'Executor Name6', isApplying: false}
                ]
            }
        };
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test content loaded on the page', (done) => {
            const idsToExclude = ['questionWithCodicil'];
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        executorFullName: 'Executor Name2',
                        executorName: 'Name2 Executor',
                        list: [
                            {firstName: 'John', lastName: 'TheApplicant', isApplying: true, isApplicant: true},
                            {fullName: 'Executor Name1', isApplying: false},
                            {fullName: 'Executor Name2', isApplying: true, currentName: 'Name2 Executor', hasOtherName: true},
                        ]
                    };

                    testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(2);
                    testWrapper.testContent(done, contentData, idsToExclude);
                });
        });

        it('test alias reason validation when no data is entered for current name reason', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(2);
            const errorsToTest = ['currentNameReason'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        currentNameReason: '',
                        executorName: 'Executor Name2'
                    };

                    testWrapper.testErrors(done, data, 'required', errorsToTest);
                });
        });

        it('test alias reason validation when other is selected but no reason is entered', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(2);
            const errorsToTest = ['otherReason'];
            const data = {
                currentNameReason: 'optionOther',
                otherReason: '',
                list: [
                    {firstName: 'John', lastName: 'TheApplicant', isApplying: true, isApplicant: true},
                    {fullName: 'Executor Name1', isApplying: false},
                    {fullName: 'Executor Name2', isApplying: true, currentName: 'Name2 Executor', hasOtherName: true},
                ]
            };

            testWrapper.testErrors(done, data, 'required', errorsToTest);
        });
    });
});
