'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ExecutorCurrentName = require('app/steps/ui/executors/currentname');
const commonContent = require('app/resources/en/translation/common');
const caseTypes = require('app/utils/CaseTypes');

describe('executor-current-name', () => {
    let testWrapper, sessionData;
    const FirstExecURL = ExecutorCurrentName.getUrl(4);

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorCurrentName');
        sessionData = {
            type: caseTypes.GOP,
            ccdCase: {
                state: 'Pending',
                id: 1234567890123456
            },
            executors: {
                list: [
                    {firstName: 'John', lastName: 'TheApplicant', isApplying: true, isApplicant: true},
                    {fullName: 'Executor Name 1', hasOtherName: false},
                    {fullName: 'Executor Name 2', hasOtherName: true},
                    {fullName: 'Executor Name 3', hasOtherName: false},
                    {fullName: 'Executor Name 4', hasOtherName: true},
                    {fullName: 'Executor Name 5', hasOtherName: false},
                    {fullName: 'Executor Name 6', hasOtherName: true}
                ]
            }
        };
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test help block content is loaded on page', (done) => {
            testWrapper.pageUrl = FirstExecURL;
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
            testWrapper.pageUrl = ExecutorCurrentName.getUrl(2);

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        executorFullName: 'Executor Name 2',
                    };

                    testWrapper.testContent(done, contentData);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
            const errorsToTest = ['currentName'];
            testWrapper.testErrors(done, {}, 'required', errorsToTest);
        });
    });
});
