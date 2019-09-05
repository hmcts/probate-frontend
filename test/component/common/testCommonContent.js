'use strict';

const TestWrapper = require('test/util/TestWrapper');
const commonContent = require('app/resources/en/translation/common');
const config = require('app/config');

class TestCommonContent {
    static runTest(page, beforeEach, afterEach, cookies = []) {
        const testWrapper = new TestWrapper(page);

        describe('Test the help content', () => {
            it('test help block content is loaded on page', (done) => {
                if (typeof beforeEach === 'function') {
                    beforeEach();
                }

                const playbackData = {
                    helpTitle: commonContent.helpTitle,
                    helpHeading1: commonContent.helpHeading1,
                    helpHeading2: commonContent.helpHeading2,
                    helpEmailLabel: commonContent.helpEmailLabel.replace(/{contactEmailAddress}/g, config.links.contactEmailAddress)
                };

                testWrapper.testDataPlayback(done, playbackData, [], cookies);
            });

            testWrapper.destroy();
            if (typeof afterEach === 'function') {
                afterEach();
            }
        });
    }
}

module.exports = TestCommonContent;
