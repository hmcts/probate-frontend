'use strict';

const TestWrapper = require('test/util/TestWrapper');
const StopPage = require('app/steps/ui/stoppage');
const TaskList = require('app/steps/ui/tasklist');
const commonContent = require('app/resources/en/translation/common');
const contentMaritalStatus = require('app/resources/en/translation/deceased/maritalstatus');
const config = require('app/config');
const caseTypes = require('app/utils/CaseTypes');

describe('divorce-place', () => {
    let testWrapper;
    const expectedNextUrlForStopPage = StopPage.getUrl('divorcePlace');
    const expectedNextUrlForTaskList = TaskList.getUrl();
    const sessionData = {
        ccdCase: {
            state: 'Pending',
            id: 1234567890123456
        },
        caseType: caseTypes.INTESTACY,
        deceased: {
            maritalStatus: 'optionDivorced'
        }
    };

    beforeEach(() => {
        testWrapper = new TestWrapper('DivorcePlace');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test help block content is loaded on page', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const playbackData = {};
                    playbackData.helpTitle = commonContent.helpTitle;
                    playbackData.helpHeading1 = commonContent.helpHeading1;
                    playbackData.helpHeading2 = commonContent.helpHeading2;
                    playbackData.helpEmailLabel = commonContent.helpEmailLabel.replace(/{contactEmailAddress}/g, config.links.contactEmailAddress);

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

        it('test content loaded on the page', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {legalProcess: contentMaritalStatus.divorce};

                    testWrapper.testContent(done, contentData);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        '{legalProcess}': 'divorce'
                    };

                    testWrapper.testErrors(done, data, 'required');
                });
        });

        it(`test it redirects to stop page: ${expectedNextUrlForStopPage}`, (done) => {
            const data = {
                divorcePlace: 'optionNo'
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
                });
        });

        it(`test it redirects to tasklist: ${expectedNextUrlForTaskList}`, (done) => {
            const data = {
                divorcePlace: 'optionYes'
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testRedirect(done, data, expectedNextUrlForTaskList);
                });
        });
    });
});
