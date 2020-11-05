'use strict';

const TestWrapper = require('test/util/TestWrapper');
const testCommonContent = require('test/component/common/testCommonContent.js');
const IhtMethod = require('app/steps/ui/iht/method');
const probateNewJourney = require('app/journeys/probatenewdeathcertflow');
const config = require('config');

describe('death-certificate-interim', () => {
    const ftValue = {ft_new_deathcert_flow: true};
    let testWrapper;
    const expectedNextUrlForIhtMethod = IhtMethod.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DeathCertificateInterim', ftValue, probateNewJourney);
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('DeathCertificateInterim');

        it('test right content loaded on the page', (done) => {
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

        it('test death certificate interim schema validation when no data is entered', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to iht method page for option death certificate: ${expectedNextUrlForIhtMethod}`, (done) => {
            const data = {
                deathCertificate: 'optionDeathCertificate'
            };

            testWrapper.agent.post('/prepare-session/featureToggles')
                .send(ftValue)
                .end(() => {
                    testWrapper.testRedirect(done, data, expectedNextUrlForIhtMethod);
                });
        });

        it(`test it redirects to iht method page for option interim certificate: ${expectedNextUrlForIhtMethod}`, (done) => {
            const data = {
                deathCertificate: 'optionInterimCertificate'
            };

            testWrapper.agent.post('/prepare-session/featureToggles')
                .send(ftValue)
                .end(() => {
                    testWrapper.testRedirect(done, data, expectedNextUrlForIhtMethod);
                });
        });
    });
});
