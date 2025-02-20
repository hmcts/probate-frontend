'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ExecutorsAlias = require('app/steps/ui/executors/alias');
const ExecutorsCurrentName = require('app/steps/ui/executors/currentname');
const ExecutorContactDetails = require('app/steps/ui/executors/contactdetails');
const caseTypes = require('app/utils/CaseTypes');
const commonContent = require('../../../app/resources/en/translation/common.json');

describe('executors-alias', () => {
    let testWrapper, sessionData;
    const expectedNextUrlForExecOtherNames = ExecutorsCurrentName.getUrl(1);
    const expectedNextUrlForExecContactDetails = ExecutorContactDetails.getUrl(1);

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorsAlias');
        sessionData = {
            type: caseTypes.GOP,
            ccdCase: {
                state: 'Pending',
                id: 1234567890123456
            },
            executors: {
                list: [
                    {firstName: 'John', lastName: 'TheApplicant', isApplying: true, isApplicant: true},
                    {fullName: 'Executor Name1', isApplying: true},
                    {fullName: 'Executor Name2', isApplying: true}
                ]
            },
            deceased: {
                firstName: 'John',
                lastName: 'Doe'
            }
        };
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test help block content is loaded on page', (done) => {
            testWrapper.pageUrl = ExecutorsAlias.getUrl(1);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const playbackData = {
                        helpTitle: commonContent.helpTitle,
                        helpHeading1: commonContent.helpHeading1,
                        helpHeading2: commonContent.helpHeading2,
                        helpHeading3: commonContent.helpHeading3,
                        helpTelephoneNumber: commonContent.helpTelephoneNumber,
                        helpTelephoneOpeningHoursTitle: commonContent.helpTelephoneOpeningHoursTitle,
                        helpTelephoneOpeningHours1: commonContent.helpTelephoneOpeningHours1,
                        helpTelephoneOpeningHours2: commonContent.helpTelephoneOpeningHours2,
                        helpEmailLabel: commonContent.helpEmailLabel.replace(/{contactEmailAddress}/g, commonContent.helpEmail)
                    };

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });
        it('test content loaded on the page', (done) => {
            sessionData.otherExecName = 'Executor Name1';
            testWrapper.pageUrl = ExecutorsAlias.getUrl(1);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        executorWillName: 'Executor Name1',
                        deceasedName: 'John Doe'
                    };
                    testWrapper.testContent(done, contentData);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
            const errorsToTest = ['alias'];
            testWrapper.testErrors(done, {}, 'required', errorsToTest);
        });

        it(`test it redirects to Executor Other Names when Yes: ${expectedNextUrlForExecOtherNames}`, (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
            const data = {
                list: [
                    {firstName: 'John', lastName: 'TheApplicant', isApplying: true, isApplicant: true},
                    {fullName: 'Executor Name1', isApplying: true},
                    {fullName: 'Executor Name2', isApplying: true}
                ],
                alias: 'optionYes'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForExecOtherNames);
        });

        it(`test it redirects to Executor Contact Details when No: ${expectedNextUrlForExecContactDetails}`, (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
            const data = {
                list: [
                    {firstName: 'John', lastName: 'TheApplicant', isApplying: true, isApplicant: true},
                    {fullName: 'Executor Name1', isApplying: true},
                    {fullName: 'Executor Name2', isApplying: true}
                ],
                alias: 'optionNo',
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForExecContactDetails);
        });
    });
});
