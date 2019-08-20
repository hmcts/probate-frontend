'use strict';

const TestWrapper = require('test/util/TestWrapper');
const OtherApplicants = require('app/steps/ui/screeners/otherapplicants');
const StopPage = require('app/steps/ui/stoppage');
const testCommonContent = require('test/component/common/testCommonContent.js');
const commonContent = require('app/resources/en/translation/common');
const config = require('app/config');
const cookies = [{
    name: config.redis.eligibilityCookie.name,
    content: {
        nextStepUrl: '/related-to-deceased',
        pages: [
            '/death-certificate',
            '/deceased-domicile',
            '/iht-completed',
            '/will-left',
            '/died-after-october-2014'
        ]
    }
}];

describe('related-to-deceased', () => {
    let testWrapper;
    const expectedNextUrlForOtherApplicants = OtherApplicants.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('notRelated');

    beforeEach(() => {
        testWrapper = new TestWrapper('RelatedToDeceased');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('RelatedToDeceased', null, cookies);

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done, [], {}, cookies);
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: 'intestacy'})
                .end(() => {
                    testWrapper.testErrors(done, {}, 'required', [], cookies);
                });
        });

        it(`test it redirects to next page: ${expectedNextUrlForOtherApplicants}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: 'intestacy'})
                .end(() => {
                    const data = {
                        related: 'Yes'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForOtherApplicants, cookies);
                });
        });

        it(`test it redirects to stop page: ${expectedNextUrlForStopPage}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: 'intestacy'})
                .end(() => {
                    const data = {
                        related: 'No'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForStopPage, cookies);
                });
        });

        it('test save and close link is not displayed on the page', (done) => {
            const playbackData = {};
            playbackData.saveAndClose = commonContent.saveAndClose;

            testWrapper.testContentNotPresent(done, playbackData);
        });
    });
});
