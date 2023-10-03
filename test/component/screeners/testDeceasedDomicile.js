'use strict';

const TestWrapper = require('test/util/TestWrapper');
const IhtCompleted = require('app/steps/ui/screeners/ihtcompleted');
const ExceptedEstateDeceasedDod = require('app/steps/ui/screeners/eedeceaseddod');
const StopPage = require('app/steps/ui/stoppage');
const testCommonContent = require('test/component/common/testCommonContent.js');
const commonContent = require('app/resources/en/translation/common');
const config = require('config');
const cookies = [{
    name: config.redis.eligibilityCookie.name,
    content: {
        nextStepUrl: '/deceased-domicile',
        pages: [
            '/death-certificate'
        ]
    }
}];

describe('deceased-domicile', () => {
    let testWrapper;
    const expectedNextUrlForIhtCompleted = IhtCompleted.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('notInEnglandOrWales');
    const expectedNextUrlForExceptedEstateDeceasedDod = ExceptedEstateDeceasedDod.getUrl();

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('DeceasedDomicile', null, null, cookies);

        it('test content loaded on the page', (done) => {
            testWrapper = new TestWrapper('DeceasedDomicile');
            testWrapper.testContent(done, {}, [], cookies);
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper = new TestWrapper('DeceasedDomicile');
            testWrapper.testErrors(done, {}, 'required', [], cookies);
        });

        it(`test it redirects to next page: ${expectedNextUrlForIhtCompleted}`, (done) => {
            testWrapper = new TestWrapper('DeceasedDomicile');
            const sessionData = {
                screeners: {
                    deathCertificate: 'optionYes',
                    deathCertificateInEnglish: 'optionNo',
                    deathCertificateTranslation: 'optionYes'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        domicile: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForExceptedEstateDeceasedDod, cookies);
                });
        });

        it(`test it redirects to next page with EE FT ON: ${expectedNextUrlForExceptedEstateDeceasedDod}`, (done) => {
            testWrapper = new TestWrapper('DeceasedDomicile', {ft_excepted_estates: true});
            const sessionData = {
                screeners: {
                    deathCertificate: 'optionYes',
                    deathCertificateInEnglish: 'optionNo',
                    deathCertificateTranslation: 'optionYes'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        domicile: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForExceptedEstateDeceasedDod, cookies);
                });
        });

        it(`test it redirects to next page with domicile No and  EE FT ON: ${expectedNextUrlForStopPage}`, (done) => {
            testWrapper = new TestWrapper('DeceasedDomicile', {ft_excepted_estates: true});
            const sessionData = {
                screeners: {
                    deathCertificate: 'optionYes',
                    deathCertificateInEnglish: 'optionNo',
                    deathCertificateTranslation: 'optionYes'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        domicile: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForStopPage, cookies);
                });
        });

        it(`test it redirects to stop page: ${expectedNextUrlForStopPage}`, (done) => {
            testWrapper = new TestWrapper('DeceasedDomicile');
            const sessionData = {
                screeners: {
                    deathCertificate: 'optionYes',
                    deathCertificateInEnglish: 'optionNo',
                    deathCertificateTranslation: 'optionYes'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        domicile: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForStopPage, cookies);
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
