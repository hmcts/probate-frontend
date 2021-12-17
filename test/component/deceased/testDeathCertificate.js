'use strict';

const TestWrapper = require('test/util/TestWrapper');
const testCommonContent = require('test/component/common/testCommonContent.js');
const IhtMethod = require('app/steps/ui/iht/method');
const IhtEstateValued = require('app/steps/ui/iht/estatevalued');
const config = require('config');
const caseTypes = require('app/utils/CaseTypes');

describe('death-certificate-interim', () => {
    let testWrapper;
    const expectedNextUrlForIhtMethod = IhtMethod.getUrl();
    const expectedNextUrlForEstateValued = IhtEstateValued.getUrl();

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('DeathCertificateInterim');

        it('test right content loaded on the page: ENGLISH', (done) => {
            testWrapper = new TestWrapper('DeathCertificateInterim');
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
            testWrapper = new TestWrapper('DeathCertificateInterim');
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
            testWrapper = new TestWrapper('DeathCertificateInterim');
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to iht method page for option death certificate: ${expectedNextUrlForIhtMethod}`, (done) => {
            testWrapper = new TestWrapper('DeathCertificateInterim');
            const data = {
                deathCertificate: 'optionDeathCertificate'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForIhtMethod);
        });

        it(`test it redirects to iht method page for option interim certificate: ${expectedNextUrlForIhtMethod}`, (done) => {
            testWrapper = new TestWrapper('DeathCertificateInterim');
            const data = {
                deathCertificate: 'optionInterimCertificate'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForIhtMethod);
        });

        it(`test it DOES NOT redirects to estate valued for EE FT on: ${expectedNextUrlForIhtMethod}`, (done) => {
            testWrapper = new TestWrapper('DeathCertificateInterim', {ft_excepted_estates: true});

            const data = {
                'dod-date': '2021-12-31',
                deathCertificate: 'optionDeathCertificate'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForIhtMethod);
        });
        it(`test it redirects to estate valued for EE FT on: ${expectedNextUrlForEstateValued}`, (done) => {
            testWrapper = new TestWrapper('DeathCertificateInterim', {ft_excepted_estates: true});

            const data = {
                'dod-date': '2022-01-01',
                deathCertificate: 'optionDeathCertificate'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForEstateValued);
        });

        it(`test it redirects to iht method FT on but dod before EE dod threshold: ${expectedNextUrlForIhtMethod}`, (done) => {
            testWrapper = new TestWrapper('DeathCertificateInterim', {ft_excepted_estates: true});

            const data = {
                'dod-date': '2021-12-31',
                deathCertificate: 'optionDeathCertificate'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForIhtMethod);
        });

        it(`test it redirects to estate valued for EE FT on INTESTACY: ${expectedNextUrlForEstateValued}`, (done) => {
            testWrapper = new TestWrapper('DeathCertificateInterim', {ft_excepted_estates: true});
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        'dod-date': '2022-01-01',
                        deathCertificate: 'optionDeathCertificate'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForEstateValued);
                });
        });

        it(`test it redirects to state valued with interim certificate for EE FT on INTESTACY: ${expectedNextUrlForEstateValued}`, (done) => {
            testWrapper = new TestWrapper('DeathCertificateInterim', {ft_excepted_estates: true});
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        'dod-date': '2022-01-01',
                        deathCertificate: 'optionInterimCertificate'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForEstateValued);
                });
        });
    });
});
