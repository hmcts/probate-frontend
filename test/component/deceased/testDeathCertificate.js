'use strict';

const TestWrapper = require('test/util/TestWrapper');
const testCommonContent = require('test/component/common/testCommonContent.js');
const IhtMethod = require('app/steps/ui/iht/method');
const IhtPaper = require('app/steps/ui/iht/paper');
const config = require('config');
const caseTypes = require('app/utils/CaseTypes');
const IhtEstateForm = require('app/steps/ui/iht/estateform');
const CalcCheck = require('app/steps/ui/iht/calccheck');

describe('death-certificate-interim', () => {
    let testWrapper;
    const expectedNextUrlForIhtMethod = IhtMethod.getUrl();
    const expectedNextUrlForEstateForm = IhtEstateForm.getUrl();
    const expectedNextUrlForEstateValued = CalcCheck.getUrl();
    const expectedNextUrlForIhtPaper = IhtPaper.getUrl();

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

        it(`test it redirects to estate valued for EE FT on: ${expectedNextUrlForEstateForm}`, (done) => {
            testWrapper = new TestWrapper('DeathCertificateInterim', {ft_excepted_estates: true});

            const data = {
                'dod-date': '2021-12-31',
                deathCertificate: 'optionDeathCertificate'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForEstateForm);
        });
        it(`test it redirects to estate valued for EE FT on: ${expectedNextUrlForEstateValued}`, (done) => {
            testWrapper = new TestWrapper('DeathCertificateInterim', {ft_excepted_estates: true});

            const data = {
                'dod-date': '2022-01-01',
                deathCertificate: 'optionDeathCertificate'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForEstateValued);
        });

        it(`test it redirects to estate valued FT on but dod before EE dod threshold: ${expectedNextUrlForEstateForm}`, (done) => {
            testWrapper = new TestWrapper('DeathCertificateInterim', {ft_excepted_estates: true});

            const data = {
                'dod-date': '2021-12-31',
                deathCertificate: 'optionDeathCertificate'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForEstateForm);
        });

        it(`test it redirects to iht paper FT on but dod before EE dod threshold: ${expectedNextUrlForIhtPaper}`, (done) => {
            testWrapper = new TestWrapper('DeathCertificateInterim', {ft_stop_ihtonline: true});

            const data = {
                'dod-date': '2021-12-31',
                deathCertificate: 'optionDeathCertificate'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForIhtPaper);
        });
        it('test it redirects to iht method FT when IHT Identifier has value', (done) => {
            testWrapper = new TestWrapper('DeathCertificateInterim', {ft_stop_ihtonline: true});
            const sessionData = {
                iht: {
                    method: 'optionOnline',
                    identifier: '12345678F12345'
                },
                'dod-date': '2020-02-20',
                deathCertificate: 'optionDeathCertificate'
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testRedirect(done, sessionData, expectedNextUrlForIhtMethod);
                });
        });

        it('test it redirects to iht paper FT when IHT Identifier has no value', (done) => {
            testWrapper = new TestWrapper('DeathCertificateInterim', {ft_stop_ihtonline: true});
            const sessionData = {
                iht: {
                    method: 'optionOnline'
                },
                'dod-date': '2020-02-20',
                deathCertificate: 'optionDeathCertificate'
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testRedirect(done, sessionData, expectedNextUrlForIhtPaper);
                });
        });

        it('test it redirects to iht paper FT when IHT method paper is selected', (done) => {
            testWrapper = new TestWrapper('DeathCertificateInterim', {ft_stop_ihtonline: true});
            const sessionData = {
                iht: {
                    method: 'optionPaper'
                },
                'dod-date': '2020-02-20',
                deathCertificate: 'optionDeathCertificate'
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testRedirect(done, sessionData, expectedNextUrlForIhtPaper);
                });
        });

        it(`test it redirects to iht paper FT on IHT empty: ${expectedNextUrlForIhtPaper}`, (done) => {
            testWrapper = new TestWrapper('DeathCertificateInterim', {ft_stop_ihtonline: true});
            const sessionData = {
                iht: {},
                'dod-date': '2020-02-20',
                deathCertificate: 'optionDeathCertificate'
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testRedirect(done, sessionData, expectedNextUrlForIhtPaper);
                });
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
