'use strict';

const TestWrapper = require('test/util/TestWrapper');
const testCommonContent = require('test/component/common/testCommonContent.js');
const IhtMethod = require('app/steps/ui/iht/method');
const probateNewJourney = require('app/journeys/probatenewdeathcertflow');

describe('death-certificate-interim', () => {
    let testWrapper;
    const expectedNextUrlForIhtMethod = IhtMethod.getUrl();

    beforeEach(() => {
        let ftValue;
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
                },
                deceased: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            };
            const contentToExclude = ['theDeceased'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {deceasedName: 'John Doe'};

                    testWrapper.testContent(done, contentData, contentToExclude);
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

            testWrapper.agent.post('/prepare-session/form')
                .end(() => {
                    testWrapper.testRedirect(done, data, expectedNextUrlForIhtMethod);
                });
        });
    });
});
