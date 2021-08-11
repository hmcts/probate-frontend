'use strict';

const TestWrapper = require('test/util/TestWrapper');
const testCommonContent = require('test/component/common/testCommonContent.js');
const IhtMethod = require('app/steps/ui/iht/method');
const config = require('config');

describe('death-certificate-interim', () => {
    let testWrapper;
    const expectedNextUrlForIhtMethod = IhtMethod.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DeathCertificateInterim');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('DeathCertificateInterim');

        it('test right content loaded on the page: ENGLISH', (done) => {
            const sessionData = {
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {deathReportedToCoroner: config.links.deathReportedToCoroner};

                    testWrapper.testContent(done, contentData);
                });
        });

        it('test right content loaded on the page: WELSH', (done) => {
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
                    const contentData = {deathReportedToCoroner: config.links.deathReportedToCoroner};

                    testWrapper.testContent(done, contentData, [], [], 'cy');
                });
        });

        it('test death certificate interim schema validation when no data is entered', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to iht method page for option death certificate: ${expectedNextUrlForIhtMethod}`, (done) => {
            const data = {
                deathCertificate: 'optionDeathCertificate'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForIhtMethod);
        });

        it(`test it redirects to iht method page for option interim certificate: ${expectedNextUrlForIhtMethod}`, (done) => {
            const data = {
                deathCertificate: 'optionInterimCertificate'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForIhtMethod);
        });
    });
});
