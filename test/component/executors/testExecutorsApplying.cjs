'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ExecutorsAlias = require('app/steps/ui/executors/alias');
const ExecutorRoles = require('app/steps/ui/executors/roles');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('executors-applying', () => {
    let testWrapper;
    const expectedNextUrlForExecAliasWith = ExecutorsAlias.getUrl('*');
    const expectedNextUrlForExecRoles = ExecutorRoles.getUrl('*');

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorsApplying');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ExecutorsApplying', null, null, [], false, {type: caseTypes.GOP});

        it('test content loaded on the page for single executor', (done) => {
            const sessionData = {
                type: caseTypes.GOP,
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
                executors: {
                    executorsNumber: 3,
                    list: [
                        {firstName: 'John', lastName: 'TheApplicant', isApplying: true, isApplicant: true},
                        {fullName: 'Many Clouds', isApplying: true}
                    ]
                },
                applicant: {
                    alias: 'Bobby Alias'
                },
                deceased: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            };
            const contentToExclude = ['multiExecQuestion'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {deceasedName: 'John Doe', executorName: 'Many Clouds'};

                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test content loaded on the page for multiple executors', (done) => {
            const sessionData = {
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
                        {fullName: 'Executor Two', isApplying: true}
                    ]
                },
                applicant: {
                    alias: 'Bobby Alias'
                },
                deceased: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            };
            const contentToExclude = ['oneOtherExecQuestion', 'optionYes', 'optionNo'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {deceasedName: 'John Doe', executorName: 'Many Clouds'};

                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });
        it('test errors message displayed for missing data', (done) => {
            const sessionData = {
                type: caseTypes.GOP,
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
                executors: {
                    executorsNumber: 3,
                    list: [
                        {firstName: 'John', lastName: 'TheApplicant', isApplying: true, isApplicant: true},
                        {fullName: 'Many Clouds', isApplying: true}
                    ]
                },
                applicant: {}
            };
            const errorsToTest = ['otherExecutorsApplying'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        otherExecutorsApplying: '',
                        executorName: 'Many Clouds'
                    };

                    testWrapper.testErrors(done, data, 'required', errorsToTest);
                });
        });

        it('test errors message displayed for more than 3 additional applicants', (done) => {
            const sessionData = {
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

        it(`test it redirects to ExecutorsAlias if there are single other executor dealing with the estate: ${expectedNextUrlForExecAliasWith}`, (done) => {
            const data = {
                list: [
                    {firstName: 'John', lastName: 'TheApplicant', isApplying: true, isApplicant: true},
                    {fullName: 'Executor Name 1', isApplying: true}
                ],
                otherExecutorsApplying: 'optionYes'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForExecAliasWith);
        });

        it(`test it redirects to ExecutorsAlias if there are multi executors dealing with the estate: ${expectedNextUrlForExecAliasWith}`, (done) => {
            const data = {
                list: [
                    {firstName: 'John', lastName: 'TheApplicant', isApplying: true, isApplicant: true},
                    {fullName: 'Executor Name 1', isApplying: true},
                    {fullName: 'Executor Name 2', isApplying: true}
                ],
                executorsApplying: ['Executor Name 1', 'Executor Name 2']
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForExecAliasWith);
        });
        it(`test it redirects to executors roles if there are no executor dealing with the estate: ${expectedNextUrlForExecRoles}`, (done) => {
            const data = {
                list: [
                    {firstName: 'John', lastName: 'TheApplicant', isApplying: true, isApplicant: true},
                    {fullName: 'Executor Name 1', isApplying: true}
                ],
                otherExecutorsApplying: 'optionNo'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForExecRoles);
        });

        it(`test it redirects to executors roles if there are no multi executors dealing with the estate: ${expectedNextUrlForExecRoles}`, (done) => {
            const data = {
                list: [
                    {firstName: 'John', lastName: 'TheApplicant', isApplying: true, isApplicant: true},
                    {fullName: 'Executor Name 1', isApplying: true},
                    {fullName: 'Executor Name 2', isApplying: true},
                    {fullName: 'Executor Name 3', isApplying: true},
                ],
                executorsApplying: [' ']
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForExecRoles);
        });
    });
});
