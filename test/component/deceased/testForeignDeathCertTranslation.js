'use strict';

const TestWrapper = require('test/util/TestWrapper');
const IhtMethod = require('app/steps/ui/iht/method');
const CalcCheck = require('app/steps/ui/iht/calccheck');
const IhtEstateForm = require('app/steps/ui/iht/estateform');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');
const IhtPaper = require('app/steps/ui/iht/paper');

describe('foreign-death-cert-translation', () => {
    let testWrapper;
    const expectedNextUrlForIhtMethod = IhtMethod.getUrl();
    const expectedNextUrlForCalcCheck = CalcCheck.getUrl();
    const expectedNextUrlForIhtPaper = IhtPaper.getUrl();
    const expectedNextUrlForEstateForm = IhtEstateForm.getUrl();

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ForeignDeathCertTranslation');

        it('test correct content loaded on the page: ENGLISH', (done) => {
            testWrapper = new TestWrapper('ForeignDeathCertTranslation');
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
            testWrapper = new TestWrapper('ForeignDeathCertTranslation');
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

        it('test foreignDeathCertTranslation schema validation when no data is entered', (done) => {
            testWrapper = new TestWrapper('ForeignDeathCertTranslation');
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to iht method page: ${expectedNextUrlForIhtMethod}`, (done) => {
            const data = {
                foreignDeathCertTranslation: 'optionYes'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForIhtMethod);
        });

        it(`test it DOES NOT redirects to estate valued for EE FT on: ${expectedNextUrlForEstateForm}`, (done) => {
            testWrapper = new TestWrapper('ForeignDeathCertTranslation', {ft_excepted_estates: true});

            const data = {
                'dod-date': '2021-12-31',
                foreignDeathCertTranslation: 'optionYes'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForEstateForm);
        });

        it(`test it redirects to IHT paper for EE FT on: ${expectedNextUrlForIhtPaper}`, (done) => {
            testWrapper = new TestWrapper('ForeignDeathCertTranslation', {ft_stop_ihtonline: true});

            const data = {
                'dod-date': '2021-12-31',
                foreignDeathCertTranslation: 'optionYes'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForIhtPaper);
        });

        it('test it redirects to IHT method for EE FT when IHT Identifier has value', (done) => {
            testWrapper = new TestWrapper('ForeignDeathCertTranslation', {ft_stop_ihtonline: true});
            const sessionData = {
                iht: {
                    method: 'optionOnline',
                    identifier: '12345678F12345'
                },
                'dod-date': '2020-02-20',
                foreignDeathCertTranslation: 'optionYes'
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testRedirect(done, sessionData, expectedNextUrlForIhtMethod);
                });
        });

        it('test it redirects to IHT paper for EE FT when IHT Identifier has no value', (done) => {
            testWrapper = new TestWrapper('ForeignDeathCertTranslation', {ft_stop_ihtonline: true});
            const sessionData = {
                iht: {
                    method: 'optionOnline',
                },
                'dod-date': '2020-02-20',
                foreignDeathCertTranslation: 'optionYes'
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testRedirect(done, sessionData, expectedNextUrlForIhtPaper);
                });
        });

        it('test it redirects to IHT paper for EE FT when IHT paper method', (done) => {
            testWrapper = new TestWrapper('ForeignDeathCertTranslation', {ft_stop_ihtonline: true});
            const sessionData = {
                iht: {
                    method: 'optionPaper',
                },
                'dod-date': '2020-02-20',
                foreignDeathCertTranslation: 'optionYes'
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testRedirect(done, sessionData, expectedNextUrlForIhtPaper);
                });
        });

        it('test it redirects to IHT paper for EE FT when IHT is null', (done) => {
            testWrapper = new TestWrapper('ForeignDeathCertTranslation', {ft_stop_ihtonline: true});

            const sessionData = {
                iht: {},
                'dod-date': '2020-02-20',
                foreignDeathCertTranslation: 'optionYes'
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testRedirect(done, sessionData, expectedNextUrlForIhtPaper);
                });
        });

        it('test it DOES NOT redirects to estate valued for EE FT ', (done) => {
            testWrapper = new TestWrapper('ForeignDeathCertTranslation', {ft_stop_ihtonline: true});

            const data = {
                'dod-date': '2021-12-31',
                foreignDeathCertTranslation: 'optionYes'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForIhtPaper);
        });

        it(`test it redirects to estate valued for EE FT on: ${expectedNextUrlForCalcCheck}`, (done) => {
            testWrapper = new TestWrapper('ForeignDeathCertTranslation', {ft_excepted_estates: true});

            const data = {
                'dod-date': '2022-01-01',
                foreignDeathCertTranslation: 'optionYes'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForCalcCheck);
        });

        it(`test it redirects to estate form for EE FT on: ${expectedNextUrlForEstateForm}`, (done) => {
            testWrapper = new TestWrapper('ForeignDeathCertTranslation', {ft_excepted_estates: true});

            const data = {
                'dod-date': '2021-01-01',
                foreignDeathCertTranslation: 'optionYes'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForEstateForm);
        });

        it(`test it redirects to estate valued for EE FT on INTESTACY: /intestacy${expectedNextUrlForCalcCheck}`, (done) => {
            testWrapper = new TestWrapper('ForeignDeathCertTranslation', {ft_excepted_estates: true});
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        'dod-date': '2022-01-01',
                        foreignDeathCertTranslation: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForCalcCheck}`);
                });
        });

        it(`test it redirects to estate form for EE FT on INTESTACY: /intestacy${expectedNextUrlForEstateForm}`, (done) => {
            testWrapper = new TestWrapper('ForeignDeathCertTranslation', {ft_excepted_estates: true});
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        'dod-date': '2021-01-01',
                        foreignDeathCertTranslation: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForEstateForm}`);
                });
        });
    });
});
