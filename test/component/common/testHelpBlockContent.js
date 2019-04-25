'use strict';

const TestWrapper = require('test/util/TestWrapper');
const commonContent = require('app/resources/en/translation/common');
const config = require('app/config');

class TestHelpBlockContent {
    static runTest(page, callback, cookies = []) {
        describe('Test the help content', () => {
            const testWrapper = new TestWrapper(page);

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
                            contactOpeningTimes: commonContent.contactOpeningTimes.replace('{openingTimes}', config.helpline.hours),
                            helpEmailLabel: commonContent.helpEmailLabel.replace(/{contactEmailAddress}/g, config.links.contactEmailAddress)
                        };

                        testWrapper.testDataPlayback(done, playbackData, cookies);
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
