'use strict';

const isEmpty = require('lodash').isEmpty;
const TestWrapper = require('test/util/TestWrapper');
const commonContent = require('app/resources/en/translation/common');
let localSessionData;

class TestCommonContent {
    static runTest(page, beforeEachParam, afterEachParam, cookies = [], pageOutsideIdam = false, sessionData = {}) {
        const testWrapper = new TestWrapper(page);

        describe('Test the help content', () => {
            beforeEach(() => {
                localSessionData = {
                    ccdCase: {
                        state: 'Pending',
                        id: 1234567890123456
                    }
                };

                if (!isEmpty(sessionData)) {
                    localSessionData = Object.assign(localSessionData, sessionData);
                }
            });

            it('test help block content is loaded on page', (done) => {
                if (typeof beforeEachParam === 'function') {
                    beforeEachParam();
                }

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

                testWrapper.agent.post('/prepare-session/form')
                    .send(localSessionData)
                    .end(() => {
                        testWrapper.testDataPlayback(done, playbackData, [], cookies);
                    });
            });

            testWrapper.destroy();
            if (typeof afterEachParam === 'function') {
                afterEachParam();
            }
        });

        describe('Test the navigation links', () => {
            if (pageOutsideIdam) {
                it('test "my account" and "sign out" links are not displayed on the page when the user is not logged in', (done) => {
                    if (typeof beforeEachParam === 'function') {
                        beforeEachParam();
                    }

                    const playbackData = {
                        myApplications: commonContent.myApplications,
                        signOut: commonContent.signOut
                    };

                    testWrapper.testContentNotPresent(done, playbackData);
                });

                it('test "sign in" is displayed on the page when the user is not logged in', (done) => {
                    if (typeof beforeEachParam === 'function') {
                        beforeEachParam();
                    }

                    const playbackData = {
                        signIn: commonContent.signIn
                    };

                    testWrapper.testDataPlayback(done, playbackData);
                });
            }

            it('test "my account" and "sign out" links are displayed on the page when the user is logged in', (done) => {
                if (typeof beforeEachParam === 'function') {
                    beforeEachParam();
                }

                localSessionData.applicantEmail = 'test@email.com';

                testWrapper.agent.post('/prepare-session/form')
                    .send(localSessionData)
                    .end(() => {
                        const playbackData = {
                            myApplications: commonContent.myApplications,
                            signOut: commonContent.signOut
                        };

                        testWrapper.testDataPlayback(done, playbackData);
                    });
            });

            it('test "sign in" is not displayed on the page when the user is logged in', (done) => {
                if (typeof beforeEachParam === 'function') {
                    beforeEachParam();
                }

                localSessionData.applicantEmail = 'test@email.com';

                testWrapper.agent.post('/prepare-session/form')
                    .send(localSessionData)
                    .end(() => {
                        const playbackData = {
                            signIn: commonContent.signIn
                        };

                        testWrapper.testContentNotPresent(done, playbackData);
                    });
            });

            testWrapper.destroy();
            if (typeof afterEachParam === 'function') {
                afterEachParam();
            }
        });
    }
}

module.exports = TestCommonContent;
