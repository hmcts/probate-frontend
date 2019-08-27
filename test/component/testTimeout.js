'use strict';

const TestWrapper = require('test/util/TestWrapper');
const commonContent = require('app/resources/en/translation/common');

describe('time-out', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('Timeout');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test right content loaded on the page', (done) => {
            testWrapper.testContent(done);
        });

        it('test "save and close" link is not displayed on the page', (done) => {
            const playbackData = {
                saveAndClose: commonContent.saveAndClose
            };

            testWrapper.testContentNotPresent(done, playbackData);
        });
    });
});
