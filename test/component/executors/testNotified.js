'use strict';

const TestWrapper = require('test/util/TestWrapper');
const Equality = require('app/steps/ui/equality');
const ExecutorRoles = require('app/steps/ui/executors/roles');
const commonContent = require('app/resources/en/translation/common');
const caseTypes = require('app/utils/CaseTypes');

describe('executor-notified', () => {
    let testWrapper, sessionData;
    const expectedNextUrlForFirstExec = ExecutorRoles.getUrl(2);
    const expectedNextUrlForSecondExec = ExecutorRoles.getUrl(3);
    const expectedNextUrlForThirdExec = Equality.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorNotified');
        sessionData = {
            type: caseTypes.GOP,
            ccdCase: {
                state: 'Pending',
                id: 1234567890123456
            },
            executors: {
                list: [
                    {firstName: 'John', lastName: 'TheApplicant', isApplying: 'optionYes', isApplicant: true},
                    {fullName: 'Manah Mana'},
                    {fullName: 'Dave Bass'},
                    {fullName: 'Ann Watt'}
                ]
            }
        };
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test help block content is loaded on page', (done) => {
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
                        helpTelephoneOpeningHours3: commonContent.helpTelephoneOpeningHours3,
                        helpTelephoneOpeningHours4: commonContent.helpTelephoneOpeningHours4,
                        helpEmailLabel: commonContent.helpEmailLabel.replace(/{contactEmailAddress}/g, commonContent.helpEmail)
                    };

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

        it('test right content loaded on the page', (done) => {

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {executorName: 'Manah Mana'};

                    testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
                    testWrapper.testContent(done, contentData);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
                    testWrapper.testErrors(done, {}, 'required');
                });

        });

        it(`test it redirects to executor roles (first exec): ${expectedNextUrlForFirstExec}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        executorNotified: 'optionYes',
                    };
                    testWrapper.testRedirect(done, data, expectedNextUrlForFirstExec);
                });
        });

        it(`test it redirects to executor roles (second exec): ${expectedNextUrlForSecondExec}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        executorNotified: 'optionYes'
                    };
                    testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(2);
                    testWrapper.testRedirect(done, data, expectedNextUrlForSecondExec);
                });
        });

        it(`test it redirects to tasklist page: ${expectedNextUrlForThirdExec}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        executorNotified: 'optionNo'
                    };
                    testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(3);
                    testWrapper.testRedirect(done, data, expectedNextUrlForThirdExec);
                });
        });
    });
});
