'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ihtMethodContent = require('app/resources/en/translation/iht/method');
const IhtIdentifier = require('app/steps/ui/iht/identifier/index');
const IhtPaper = require('app/steps/ui/iht/paper/index');

describe('iht-method', () => {
    let testWrapper;
    const expectedNextUrlForIhtPaper = IhtPaper.getUrl();
    const expectedNextUrlForIhtIdentifier = IhtIdentifier.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('IhtMethod');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test correct iht method page content is loaded', (done) => {
            const contentToExclude = [];
            testWrapper.testContent(done, contentToExclude);
        });

        it('test iht method schema validation when no data is entered', (done) => {
            const errorsToTest = [];
            const data = {};
            testWrapper.testErrors(done, data, 'required', errorsToTest);
        });

        it(`test it redirects to iht paper: ${expectedNextUrlForIhtPaper}`, (done) => {
            const data = {
                'method': ihtMethodContent.paperOption
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForIhtPaper);
        });

        it(`test it redirects to iht identifier: ${expectedNextUrlForIhtIdentifier}`, (done) => {
            const data = {
                'method': ihtMethodContent.onlineOption
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForIhtIdentifier);
        });

    });
});
