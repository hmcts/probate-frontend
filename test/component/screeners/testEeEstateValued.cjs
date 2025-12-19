'use strict';

const TestWrapper = require('test/util/TestWrapper');
const WillLeft = require('app/steps/ui/screeners/willleft');
const StopPage = require('app/steps/ui/stoppage');
const testCommonContent = require('test/component/common/testCommonContent.js');
const commonContent = require('app/resources/en/translation/common');
const config = require('config');
const cookies = [{
    name: config.redis.eligibilityCookie.name,
    content: {
        nextStepUrl: '/ee-estate-valued',
        pages: [
            '/death-certificate',
            '/deceased-domicile',
            '/ee-deceased-dod'
        ]
    }
}];

describe('/ee-estate-valued', () => {
    let testWrapper;
    const expectedNextUrlForWillLeft = WillLeft.getUrl();
    const expectedNextUrlForExceptedEstateStopPage = StopPage.getUrl('eeEstateNotValued');

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ExceptedEstateValued', null, null, cookies);

        it('test content loaded on the page', (done) => {
            testWrapper = new TestWrapper('ExceptedEstateValued');
            const contentData = {ihtChecker: config.links.ihtChecker};
            testWrapper.testContent(done, contentData, [], cookies);
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper = new TestWrapper('ExceptedEstateValued');
            testWrapper.testErrors(done, {}, 'required', [], cookies);
        });

        it(`test it redirects to next page when estate has been valued: ${expectedNextUrlForWillLeft}`, (done) => {
            testWrapper = new TestWrapper('ExceptedEstateValued', {ft_excepted_estates: true});
            const sessionData = {
                screeners: {
                    deathCertificate: 'optionYes',
                    deathCertificateInEnglish: 'optionNo',
                    deathCertificateTranslation: 'optionYes',
                    domicile: 'optionYes',
                    eeDeceasedDod: 'optionYes'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        eeEstateValued: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForWillLeft, cookies);
                });
        });

        it(`test it redirects to next when estate has not been valued: ${expectedNextUrlForExceptedEstateStopPage}`, (done) => {
            testWrapper = new TestWrapper('ExceptedEstateValued', {ft_excepted_estates: true});
            const sessionData = {
                screeners: {
                    deathCertificate: 'optionYes',
                    deathCertificateInEnglish: 'optionNo',
                    deathCertificateTranslation: 'optionYes',
                    domicile: 'optionYes',
                    eeDeceasedDod: 'optionYes'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        eeEstateValued: 'optionNo',
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForExceptedEstateStopPage, cookies);
                });
        });

        it('test "save and close" link is not displayed on the page', (done) => {
            testWrapper = new TestWrapper('DeceasedDomicile');
            const playbackData = {
                saveAndClose: commonContent.saveAndClose
            };

            testWrapper.testContentNotPresent(done, playbackData);
        });
    });
});
