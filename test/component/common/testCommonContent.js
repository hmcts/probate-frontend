'use strict';

const TestWrapper = require('test/util/TestWrapper');
const commonContent = require('app/resources/en/translation/common');
const config = require('app/config');

class TestCommonContent {
    static runTest(page, callback, cookies = [], pageOutsideIdam = false) {
        const testWrapper = new TestWrapper(page);

        describe('Test the help content', () => {
            it('test help block content is loaded on page', (done) => {
                if (typeof callback === 'function') {
                    callback();
                }

                testWrapper.agent
                    .get(testWrapper.pageUrl)
                    .then(() => {
                        const playbackData = {
                            helpTitle: commonContent.helpTitle,
                            helpHeading1: commonContent.helpHeading1,
                            helpHeading2: commonContent.helpHeading2,
                            helpEmailLabel: commonContent.helpEmailLabel.replace(/{contactEmailAddress}/g, config.links.contactEmailAddress)
                        };

                        testWrapper.testDataPlayback(done, playbackData, cookies);
                    })
                    .catch(err => {
                        done(err);
                    });
            });
        });

        describe('Test the navigation links', () => {
            if (pageOutsideIdam) {
                it('test "my account" and "sign out" links are not displayed on the page when the user is not logged in', (done) => {
                    if (typeof callback === 'function') {
                        callback();
                    }

                    testWrapper.agent
                        .get(testWrapper.pageUrl)
                        .then(() => {
                            const playbackData = {
                                myAccount: commonContent.myAccount,
                                signOut: commonContent.signOut
                            };

                            testWrapper.testContentNotPresent(done, playbackData);
                        })
                        .catch(err => {
                            done(err);
                        });
                });
            }

            it('test "my account" and "sign out" links are displayed on the page when the user is logged in', (done) => {
                if (typeof callback === 'function') {
                    callback();
                }

                const sessionData = {
                    applicantEmail: 'test@email.com'
                };

                testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                        testWrapper.agent
                            .get(testWrapper.pageUrl)
                            .then(() => {
                                const playbackData = {
                                    myAccount: commonContent.myAccount,
                                    signOut: commonContent.signOut
                                };

                                testWrapper.testDataPlayback(done, playbackData);
                            })
                            .catch(err => {
                                done(err);
                            });
                    });
            });

            testWrapper.destroy();
        });
    }
}

module.exports = TestCommonContent;
