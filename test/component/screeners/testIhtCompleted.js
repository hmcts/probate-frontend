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
        nextStepUrl: '/iht-completed',
        pages: [
            '/death-certificate',
            '/deceased-domicile'
        ]
    }
}];

describe('iht-completed', () => {
    let testWrapper;
    const expectedNextUrlForWillLeft = WillLeft.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('ihtNotCompleted');

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('IhtCompleted', null, null, cookies);

        it('test content loaded on the page', (done) => {
            testWrapper = new TestWrapper('IhtCompleted');
            testWrapper.testContent(done, {}, [], cookies);
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper = new TestWrapper('IhtCompleted');
            testWrapper.testErrors(done, {}, 'required', [], cookies);
        });

        it(`test it redirects to next page: ${expectedNextUrlForWillLeft}`, (done) => {
            testWrapper = new TestWrapper('IhtCompleted');
            const sessionData = {
                screeners: {
                    deathCertificate: 'optionYes',
                    deathCertificateInEnglish: 'optionYes',
                    domicile: 'optionYes',
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        completed: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForWillLeft, cookies);
                });
        });

        it(`test it redirects to next page EE FT ON: ${expectedNextUrlForWillLeft}`, (done) => {
            testWrapper = new TestWrapper('IhtCompleted', {ft_excepted_estates: true});
            const sessionData = {
                screeners: {
                    deathCertificate: 'optionYes',
                    deathCertificateInEnglish: 'optionYes',
                    domicile: 'optionYes',
                    eeDeceasedDod: 'optionNo'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        completed: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForWillLeft, cookies);
                });
        });

        it(`test it redirects to stop page: ${expectedNextUrlForStopPage}`, (done) => {
            testWrapper = new TestWrapper('IhtCompleted');
            const sessionData = {
                screeners: {
                    deathCertificate: 'optionYes',
                    deathCertificateInEnglish: 'optionYes',
                    domicile: 'optionYes',
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        completed: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForStopPage, cookies);
                });
        });

        it('test "save and close" link is not displayed on the page', (done) => {
            testWrapper = new TestWrapper('IhtCompleted');
            const playbackData = {
                saveAndClose: commonContent.saveAndClose
            };

            testWrapper.testContentNotPresent(done, playbackData);
        });
    });
});
