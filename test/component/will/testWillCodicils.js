'use strict';
const TestWrapper = require('test/util/TestWrapper'),
    IhtCompleted = require('app/steps/ui/iht/completed/index'),
    CodicilsNumber = require('app/steps/ui/will/codicilsnumber/index');

describe('will-codicils', () => {
    let testWrapper;
    const expectedNextUrlForIhtComplete = IhtCompleted.getUrl();
    const expectedNextUrlForCodicilsNumber = CodicilsNumber.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('WillCodicils');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test correct content loaded on the page', (done) => {
            const excludeKeys = [];

            testWrapper.testContent(done, excludeKeys);
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {};

            testWrapper.testErrors(done, data, 'required', []);
        });

        it(`test it redirects to iht completed page: ${expectedNextUrlForIhtComplete}`, (done) => {
            const data = {
                'codicils': 'No'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForIhtComplete);
        });

        it(`test it redirects to codicils number page: ${expectedNextUrlForCodicilsNumber}`, (done) => {
            const data = {
                'codicils': 'Yes'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForCodicilsNumber);
        });

    });
});
