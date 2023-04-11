'use strict';

const TestWrapper = require('test/util/TestWrapper');
const IhtIdentifier = require('app/steps/ui/iht/identifier');
const IhtPaper = require('app/steps/ui/iht/paper');
const testCommonContent = require('test/component/common/testCommonContent.js');

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
        testCommonContent.runTest('IhtMethod');

        it('test correct iht method page content is loaded', (done) => {
            const sessionData = {
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                }
            };
            const contentToExclude = ['paragraph2'];
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, {}, contentToExclude);
                });
        });

        it('test iht method schema validation when no data is entered', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to iht paper: ${expectedNextUrlForIhtPaper}`, (done) => {
            const data = {
                method: 'optionPaper'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForIhtPaper);
        });

        it(`test it redirects to iht identifier: ${expectedNextUrlForIhtIdentifier}`, (done) => {
            const data = {
                method: 'optionOnline'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForIhtIdentifier);
        });
    });
});
