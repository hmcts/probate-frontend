'use strict';

const TestWrapper = require('test/util/TestWrapper');
const StartApply = require('app/steps/ui/startapply/index');
const StopPage = require('app/steps/ui/stoppage/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

describe('iht-completed', () => {
    let testWrapper;
    let cookies;
    const expectedNextUrlForStopPage = StopPage.getUrl('ihtNotCompleted');
    const expectedNextUrlForStartApply = StartApply.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('IhtCompleted');

        cookies = [{
            name: '__eligibility',
            content: {
                nextStepUrl: '/iht-completed',
                pages: [
                    '/will-left',
                    '/will-original',
                    '/death-certificate',
                    '/deceased-domicile',
                    '/applicant-executor',
                    '/mental-capacity'
                ]
            }
        }];
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it ('test the help block content is present', () => {
            testHelpBlockContent.runTest('IhtCompleted', cookies);
        });

        it('test right content loaded on the page', (done) => {
            const excludeKeys = [];

            testWrapper.testContent(done, excludeKeys, {}, cookies);
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {};

            testWrapper.testErrors(done, data, 'required', [], cookies);
        });

        it(`test it redirects to Start Apply page: ${expectedNextUrlForStartApply}`, (done) => {
            const data = {
                completed: 'Yes'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForStartApply, cookies);
        });

        it(`test it redirects to stop page: ${expectedNextUrlForStopPage}`, (done) => {
            const data = {
                completed: 'No'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForStopPage, cookies);
        });

    });
});
