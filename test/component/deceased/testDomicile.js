'use strict';

const TestWrapper = require('test/util/TestWrapper');
const testCommonContent = require('test/component/common/testCommonContent.js');
const DeathCertificateInterim = require('app/steps/ui/deceased/deathcertificate');
const IhtMethod = require('app/steps/ui/iht/method');
const probateNewJourney = require('app/journeys/probatenewdeathcertflow');

describe('deceased-domicile', () => {
    let testWrapper;
    const expectedNextUrlForDeathCertificateInterim = DeathCertificateInterim.getUrl();
    const expectedNextUrlForIhtMethod = IhtMethod.getUrl();

    beforeEach(() => {
        let ftValue;
        testWrapper = new TestWrapper('DomicileEnglandOrWales', ftValue, probateNewJourney);
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('DomicileEnglandOrWales');

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

        it('test domicile schema validation when no data is entered', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to death certificate interim page: ${expectedNextUrlForDeathCertificateInterim}`, (done) => {
            const data = {
                domicile: 'optionYes'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForDeathCertificateInterim);
        });

        it(`test it redirects to iht method page: ${expectedNextUrlForIhtMethod}`, (done) => {
            const data = {
                domicile: 'optionNo'
            };

            testWrapper.agent.post('/prepare-session/form')
                .end(() => {
                    testWrapper.testRedirect(done, data, expectedNextUrlForIhtMethod);
                });
        });
    });
});
