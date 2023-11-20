'use strict';

const TestWrapper = require('test/util/TestWrapper');
const IhtMethod = require('app/steps/ui/iht/method');
const ForeignDeathCertTranslation = require('app/steps/ui/deceased/foreigndeathcerttranslation');
const CalcCheck = require('app/steps/ui/iht/calccheck');
const IhtEstateForm = require('app/steps/ui/iht/estateform');
const IhtPaper = require('app/steps/ui/iht/paper');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('english-foreign-death-cert', () => {
    let testWrapper;
    const ftValue = {ft_new_deathcert_flow: true};
    const expectedNextUrlForIhtMethod = IhtMethod.getUrl();
    const expectedNextUrlForForeignDeathCertTranslation = ForeignDeathCertTranslation.getUrl();
    const expectedNextUrlForCalcCheck = CalcCheck.getUrl();
    const expectedNextUrlForEstateForm = IhtEstateForm.getUrl();
    const expectedNextUrlForIhtPaper = IhtPaper.getUrl();

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('EnglishForeignDeathCert');

        it('test correct content loaded on the page: ENGLISH', (done) => {
            testWrapper = new TestWrapper('EnglishForeignDeathCert');
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
            testWrapper = new TestWrapper('EnglishForeignDeathCert');
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
            testWrapper = new TestWrapper('EnglishForeignDeathCert');
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to document uploads page: ${expectedNextUrlForIhtMethod}`, (done) => {
            testWrapper = new TestWrapper('EnglishForeignDeathCert');
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
            testWrapper = new TestWrapper('EnglishForeignDeathCert');
            const data = {
                englishForeignDeathCert: 'optionNo'
            };

            testWrapper.agent.post('/prepare-session/featureToggles')
                .send(ftValue)
                .end(() => {
                    testWrapper.testRedirect(done, data, expectedNextUrlForForeignDeathCertTranslation);
                });
        });

        it(`test it DOES NOT redirects to estate valued for EE FT on: ${expectedNextUrlForCalcCheck}`, (done) => {
            testWrapper = new TestWrapper('EnglishForeignDeathCert', {ft_excepted_estates: true});

            const data = {
                'dod-date': '2022-12-31',
                englishForeignDeathCert: 'optionYes'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForCalcCheck);
        });
        it(`test it redirects to IHT Paper for EE FT on: ${expectedNextUrlForIhtPaper}`, (done) => {
            testWrapper = new TestWrapper('EnglishForeignDeathCert', {ft_stop_ihtonline: true});

            const data = {
                'dod-date': '2021-12-31',
                englishForeignDeathCert: 'optionYes'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForIhtPaper);
        });
        it('test it redirects to iht method FT when IHT Identifier has value', (done) => {
            testWrapper = new TestWrapper('EnglishForeignDeathCert', {ft_stop_ihtonline: true});

            const sessionData = {
                iht: {
                    method: 'optionOnline',
                    identifier: '12345678F12345'
                },
                'dod-date': '2020-02-20',
                englishForeignDeathCert: 'optionYes'
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testRedirect(done, sessionData, expectedNextUrlForIhtMethod);
                });
        });
        it('test it redirects to iht method FT when IHT Identifier has no value', (done) => {
            testWrapper = new TestWrapper('EnglishForeignDeathCert', {ft_stop_ihtonline: true});

            const sessionData = {
                iht: {
                    method: 'optionOnline'
                },
                'dod-date': '2020-02-20',
                englishForeignDeathCert: 'optionYes'
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testRedirect(done, sessionData, expectedNextUrlForIhtPaper);
                });
        });
        it('test it redirects to iht method FT when IHT method is Paper', (done) => {
            testWrapper = new TestWrapper('EnglishForeignDeathCert', {ft_stop_ihtonline: true});

            const sessionData = {
                iht: {
                    method: 'optionPaper'
                },
                'dod-date': '2020-02-20',
                englishForeignDeathCert: 'optionYes'
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testRedirect(done, sessionData, expectedNextUrlForIhtPaper);
                });
        });
        it('test it redirects to iht method FT when IHT is empty', (done) => {
            testWrapper = new TestWrapper('EnglishForeignDeathCert', {ft_stop_ihtonline: true});

            const sessionData = {
                iht: {},
                'dod-date': '2020-02-20',
                englishForeignDeathCert: 'optionYes'
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testRedirect(done, sessionData, expectedNextUrlForIhtPaper);
                });
        });
        it(`test it redirects to estate valued for EE FT on and foreign death certificate in eng: ${expectedNextUrlForCalcCheck}`, (done) => {
            testWrapper = new TestWrapper('EnglishForeignDeathCert', {ft_excepted_estates: true});

            const data = {
                'dod-date': '2022-01-01',
                englishForeignDeathCert: 'optionYes'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForCalcCheck);
        });

        it(`test it redirects to estate form for EE FT on and foreign death certificate in eng: ${expectedNextUrlForEstateForm}`, (done) => {
            testWrapper = new TestWrapper('EnglishForeignDeathCert', {ft_excepted_estates: true});

            const data = {
                'dod-date': '2021-01-01',
                englishForeignDeathCert: 'optionYes'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForEstateForm);
        });

        it(`test it redirects to foreign death cert translation where no translation FT dod date after ee threshold: ${expectedNextUrlForForeignDeathCertTranslation}`, (done) => {
            testWrapper = new TestWrapper('EnglishForeignDeathCert', {ft_excepted_estates: true});

            const data = {
                'dod-date': '2022-01-01',
                englishForeignDeathCert: 'optionNo'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForForeignDeathCertTranslation);
        });

        it(`test it redirects to estate valued for EE FT on and foreign death certificate in eng INTESTACY: ${expectedNextUrlForCalcCheck}`, (done) => {
            testWrapper = new TestWrapper('EnglishForeignDeathCert', {ft_excepted_estates: true});
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        'dod-date': '2022-01-01',
                        englishForeignDeathCert: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForCalcCheck);
                });
        });

        it(`test it redirects to estate form for EE FT on and foreign death certificate in eng INTESTACY: ${expectedNextUrlForEstateForm}`, (done) => {
            testWrapper = new TestWrapper('EnglishForeignDeathCert', {ft_excepted_estates: true});
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        'dod-date': '2021-01-01',
                        englishForeignDeathCert: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForEstateForm);
                });
        });
    });
});
