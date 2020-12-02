'use strict';

const TestWrapper = require('test/util/TestWrapper');
const IhtMethod = require('app/steps/ui/iht/method');
const ForeignDeathCertTranslation = require('app/steps/ui/deceased/foreigndeathcerttranslation');
const testCommonContent = require('test/component/common/testCommonContent.js');

describe('english-foreign-death-cert', () => {
    let testWrapper;
    const ftValue = {ft_new_deathcert_flow: true};
    const expectedNextUrlForIhtMethod = IhtMethod.getUrl();
    const expectedNextUrlForForeignDeathCertTranslation = ForeignDeathCertTranslation.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('EnglishForeignDeathCert');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('EnglishForeignDeathCert');

        it('test correct content loaded on the page: ENGLISH', (done) => {
            const sessionData = {
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done);
                });
        });

        it('test correct content loaded on the page: WELSH', (done) => {
            const sessionData = {
                form: {
                    ccdCase: {
                        state: 'Pending',
                        id: 1234567890123456
                    }
                },
                language: 'cy'
            };

            testWrapper.agent.post('/prepare-session-field')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, {}, [], [], 'cy');
                });
        });

        it('test englishForeignDeathCert schema validation when no data is entered', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to document uploads page: ${expectedNextUrlForIhtMethod}`, (done) => {
            const data = {
                englishForeignDeathCert: 'optionYes'
            };

            testWrapper.agent.post('/prepare-session/featureToggles')
                .send(ftValue)
                .end(() => {
                    testWrapper.testRedirect(done, data, expectedNextUrlForIhtMethod);
                });
        });

        it(`test it redirects to foreign death cert translated  page: ${expectedNextUrlForForeignDeathCertTranslation}`, (done) => {
            const data = {
                englishForeignDeathCert: 'optionNo'
            };

            testWrapper.agent.post('/prepare-session/featureToggles')
                .send(ftValue)
                .end(() => {
                    testWrapper.testRedirect(done, data, expectedNextUrlForForeignDeathCertTranslation);
                });
        });
    });
});
