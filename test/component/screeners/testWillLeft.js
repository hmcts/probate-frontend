'use strict';

const TestWrapper = require('test/util/TestWrapper');
const WillOriginal = require('app/steps/ui/screeners/willoriginal');
const DiedAfterOctober2014 = require('app/steps/ui/screeners/diedafteroctober2014');
const testCommonContent = require('test/component/common/testCommonContent.js');
const commonContent = require('app/resources/en/translation/common');
const config = require('config');
const cookies = [{
    name: config.redis.eligibilityCookie.name,
    content: {
        nextStepUrl: '/will-left',
        pages: [
            '/death-certificate',
            '/deceased-domicile',
            '/iht-completed'
        ]
    }
}];

describe('will-left', () => {
    let testWrapper;
    const expectedNextUrlForWillOriginal = WillOriginal.getUrl();
    const expectedNextUrlForDiedAfterOctober2014 = DiedAfterOctober2014.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('WillLeft');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('WillLeft', null, null, cookies);

        it('test content loaded on the page', (done) => {
            const contentData = {willIsLegal: config.links.willIsLegal};
            testWrapper.testContent(done, contentData, [], cookies);
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required', [], cookies);
        });

        it(`test it redirects to next page: ${expectedNextUrlForWillOriginal}`, (done) => {
            const sessionData = {
                screeners: {
                    deathCertificate: 'optionYes',
                    deathCertificateInEnglish: 'optionYes',
                    domicile: 'optionYes',
                    completed: 'optionYes'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        left: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForWillOriginal, cookies);
                });
        });

        it(`test it redirects to next page: ${expectedNextUrlForDiedAfterOctober2014}`, (done) => {
            const sessionData = {
                screeners: {
                    deathCertificate: 'optionYes',
                    deathCertificateInEnglish: 'optionYes',
                    domicile: 'optionYes',
                    completed: 'optionYes'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        left: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForDiedAfterOctober2014, cookies);
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
