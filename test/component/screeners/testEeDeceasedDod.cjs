'use strict';

const TestWrapper = require('test/util/TestWrapper');
const IhtCompleted = require('app/steps/ui/screeners/ihtcompleted');
const ExceptedEstateValued = require('app/steps/ui/screeners/eeestatevalued');
const testCommonContent = require('test/component/common/testCommonContent.js');
const commonContent = require('app/resources/en/translation/common');
const config = require('config');
const cookies = [{
    name: config.redis.eligibilityCookie.name,
    content: {
        nextStepUrl: '/ee-deceased-dod',
        pages: [
            '/death-certificate',
            '/deceased-domicile'
        ]
    }
}];

describe('/ee-deceased-dod', () => {
    let testWrapper;
    const expectedNextUrlForIhtCompleted = IhtCompleted.getUrl();
    const expectedNextUrlForExceptedEstateValued = ExceptedEstateValued.getUrl();

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ExceptedEstateDeceasedDod', null, null, cookies);

        it('test content loaded on the page', (done) => {
            testWrapper = new TestWrapper('ExceptedEstateDeceasedDod');
            testWrapper.testContent(done, {}, [], cookies);
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper = new TestWrapper('ExceptedEstateDeceasedDod');
            testWrapper.testErrors(done, {}, 'required', [], cookies);
        });

        it(`test it redirects to next page when dod is after EE date: ${expectedNextUrlForExceptedEstateValued}`, (done) => {
            testWrapper = new TestWrapper('ExceptedEstateDeceasedDod', {ft_excepted_estates: true});
            const sessionData = {
                screeners: {
                    deathCertificate: 'optionYes',
                    deathCertificateInEnglish: 'optionNo',
                    deathCertificateTranslation: 'optionYes',
                    domicile: 'optionYes'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        eeDeceasedDod: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForExceptedEstateValued, cookies);
                });
        });

        it(`test it redirects to next when dod is before EE date: ${expectedNextUrlForIhtCompleted}`, (done) => {
            testWrapper = new TestWrapper('ExceptedEstateDeceasedDod', {ft_excepted_estates: true});
            const sessionData = {
                screeners: {
                    deathCertificate: 'optionYes',
                    deathCertificateInEnglish: 'optionNo',
                    deathCertificateTranslation: 'optionYes',
                    domicile: 'optionYes'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        eeDeceasedDod: 'optionNo',
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForIhtCompleted, cookies);
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
