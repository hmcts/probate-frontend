'use strict';

const TestWrapper = require('test/util/TestWrapper');
const OtherApplicants = require('app/steps/ui/screeners/otherapplicants');
const StopPage = require('app/steps/ui/stoppage');
const testCommonContent = require('test/component/common/testCommonContent.js');
const commonContent = require('app/resources/en/translation/common');
const config = require('config');
const caseTypes = require('app/utils/CaseTypes');
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
        testCommonContent.runTest('RelatedToDeceased', null, null, cookies);

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done, {}, [], cookies);
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    testWrapper.testErrors(done, {}, 'required', [], cookies);
                });
        });

        it(`test it redirects to next page: ${expectedNextUrlForOtherApplicants}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                screeners: {
                    deathCertificate: 'optionYes',
                    deathCertificateInEnglish: 'optionYes',
                    domicile: 'optionYes',
                    completed: 'optionYes',
                    left: 'optionNo',
                    diedAfter: 'optionYes'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        related: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForOtherApplicants, cookies);
                });
        });

        it(`test it redirects to stop page: ${expectedNextUrlForStopPage}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                screeners: {
                    deathCertificate: 'optionYes',
                    deathCertificateInEnglish: 'optionYes',
                    domicile: 'optionYes',
                    completed: 'optionYes',
                    left: 'optionNo',
                    diedAfter: 'optionYes'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        related: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForStopPage, cookies);
                });
        });

        it('test "save and close" link is not displayed on the page', (done) => {
            const playbackData = {
                saveAndClose: commonContent.saveAndClose
            };

            testWrapper.testContentNotPresent(done, playbackData);
        });
    });
});
