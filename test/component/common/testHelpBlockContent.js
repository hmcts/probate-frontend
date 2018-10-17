'use strict';

const TestWrapper = require('test/util/TestWrapper');
const common = require('app/resources/en/translation/common');
const config = require('app/config');

class TestHelpBlockContent {
    static runTest(page, cookies = []) {
        describe('Test the help content', () => {
            const testWrapper = new TestWrapper(page);

            it('test help block content is loaded on page', (done) => {
                const res = testWrapper.agent.get(testWrapper.pageUrl);

                if (cookies.length) {
                    for (let i=0; i<cookies.length; i++) {
                        const cookieName = cookies[i].name;
                        const cookieContent = JSON.stringify(cookies[i].content);

                        cookies[i] = `${cookieName}=${cookieContent}`;
                    }

                    res.set('Cookie', cookies);
                }

                res.then(() => {
                    const playbackData = {};
                    playbackData.helpTitle = common.helpTitle;
                    playbackData.helpText = common.helpText;
                    playbackData.contactTelLabel = common.contactTelLabel.replace('{helpLineNumber}', config.helpline.number);
                    playbackData.contactOpeningTimes = common.contactOpeningTimes.replace('{openingTimes}', config.helpline.hours);
                    playbackData.helpEmailLabel = common.helpEmailLabel;
                    playbackData.contactEmailAddress = common.contactEmailAddress;

                    testWrapper.testDataPlayback(done, playbackData);
                })
                .catch(err => {
                    done(err);
                });
            });

            testWrapper.destroy();
        });
    }
}

module.exports = TestHelpBlockContent;
