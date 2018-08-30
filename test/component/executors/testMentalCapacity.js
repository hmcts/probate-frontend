'use strict';

const TestWrapper = require('test/util/TestWrapper');
const IhtCompleted = require('app/steps/ui/iht/completed/index');
const StopPage = require('app/steps/ui/stoppage/index');
const json = require('app/resources/en/translation/deceased/domicile.json');

describe('mental-capacity', () => {
    let testWrapper;
    const expectedNextUrlForIhtCompleted = IhtCompleted.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('mentalCapacity');

    beforeEach(() => {
        testWrapper = new TestWrapper('MentalCapacity');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done, [], {});
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {};
            testWrapper.testErrors(done, data, 'required');
        });

        it(`test it redirects to iht completed if all executors are mentally capable: ${expectedNextUrlForIhtCompleted}`, (done) => {
            const data = {
                'mentalCapacity': json.optionYes
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForIhtCompleted);
        });

        it(`test it redirects to stop page if not all executors are mentally capable: ${expectedNextUrlForStopPage}`, (done) => {
            const data = {
                'mentalCapacity': json.optionNo
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
        });
    });
});
