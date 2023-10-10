'use strict';

const journey = require('app/journeys/probate');
const initSteps = require('../../../app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const coreContextMockData = require('../../data/core-context-mock-data.json');
const journeyProbate = require('../../../app/journeys/probate');
const WillLeft = steps.WillLeft;
const PreviousStep = steps.IhtCompleted;
const ExceptedEstateValued = steps.ExceptedEstateValued;

describe('WillLeft', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = WillLeft.constructor.getUrl();
            expect(url).to.equal('/will-left');
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return the correct context on GET', (done) => {
            const req = {
                method: 'GET',
                sessionID: 'dummy_sessionId',
                session: {
                    language: 'en',
                    form: {
                        ccdCase: {
                            id: 1234567890123456,
                            state: 'Pending'
                        }
                    },
                    caseType: 'gop'
                },
                body: {
                    left: 'optionYes'
                }
            };
            const res = {};

            const ctx = WillLeft.getContextData(req, res);
            expect(ctx).to.deep.equal({
                ...coreContextMockData,
                sessionID: 'dummy_sessionId',
                left: 'optionYes'
            });
            done();
        });
    });

    describe('handlePost()', () => {
        it('should set session.form.caseType', (done) => {
            const ctxToTest = {
                left: 'optionYes'
            };
            const errorsToTest = {};
            const formdata = {
            };
            const session = {
                form: {}
            };
            const [ctx, errors] = WillLeft.handlePost(ctxToTest, errorsToTest, formdata, session);
            expect(ctx).to.deep.equal({
                left: 'optionYes'
            });
            expect(errors).to.deep.equal({});
            done();
        });

        it('should clear session.form except for retainedList on change of caseType', (done) => {
            const ctxToTest = {
                left: 'optionYes',
                caseType: 'Intestacy'
            };
            const errorsToTest = {};
            const formdata = {
                key: 'value',
                key2: 'value',
                applicantEmail: 'test@email.com',
                payloadVersion: '1.0.1',
                userLoggedIn: true,
                screeners: {
                    deathCertificate: 'optionYes',
                    deathCertificateInEnglish: 'optionYes',
                    domicile: 'optionYes',
                    completed: 'optionYes'
                }
            };
            const session = {};
            session.form = formdata;

            const [ctx, errors] = WillLeft.handlePost(ctxToTest, errorsToTest, formdata, session);
            expect(errors).to.deep.equal({});
            expect(ctx).to.deep.equal({
                caseType: 'Intestacy',
                left: 'optionYes'
            });
            expect(formdata).to.deep.equal({
                applicantEmail: 'test@email.com',
                caseType: 'gop',
                payloadVersion: '1.0.1',
                applicant: {},
                deceased: {},
                userLoggedIn: true,
                screeners: {
                    deathCertificate: 'optionYes',
                    domicile: 'optionYes',
                    deathCertificateInEnglish: 'optionYes',
                    completed: 'optionYes'
                }
            });
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when Yes is given', (done) => {
            const req = {
                session: {
                    journey: journey,
                    form: {
                        screeners: {
                            deathCertificate: 'optionYes',
                            deathCertificateInEnglish: 'optionYes',
                            domicile: 'optionYes',
                            completed: 'optionYes'
                        }
                    }
                }
            };
            const ctx = {
                left: 'optionYes'
            };
            const nextStepUrl = WillLeft.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/will-original');
            done();
        });

        it('should return the correct url when No is given', (done) => {
            const req = {
                session: {
                    journey: journey,
                    form: {
                        screeners: {
                            deathCertificate: 'optionYes',
                            deathCertificateInEnglish: 'optionYes',
                            domicile: 'optionYes',
                            completed: 'optionYes'
                        }
                    }
                }
            };
            const ctx = {
                left: 'optionNo'
            };
            const nextStepUrl = WillLeft.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/died-after-october-2014');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = WillLeft.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {
                        key: 'left',
                        value: 'optionYes',
                        choice: 'withWill'
                    }
                ]
            });
            done();
        });
    });

    describe('previousScrennerStepUrl()', () => {
        let ctx;
        it('should return the previous step url', (done) => {
            const res = {
                redirect: (url) => url
            };
            const req = {
                method: 'GET',
                session: {
                    language: 'en',
                    form: {
                        screeners: {
                            deathCertificate: 'optionYes',
                            deathCertificateInEnglish: 'optionYes',
                            domicile: 'optionYes',
                            eeDeceasedDod: 'optionNo',
                            completed: 'optionYes'
                        }
                    },
                    caseType: 'gop'
                }
            };
            req.session.journey = journeyProbate;
            ctx = {};
            WillLeft.previousScrennerStepUrl(req, res, ctx);
            expect(ctx.previousUrl).to.equal(PreviousStep.constructor.getUrl());
            done();
        });

        it('should return the previous step url', (done) => {
            const res = {
                redirect: (url) => url
            };
            const req = {
                method: 'GET',
                session: {
                    language: 'en',
                    form: {
                        screeners: {
                            deathCertificate: 'optionYes',
                            deathCertificateInEnglish: 'optionYes',
                            domicile: 'optionYes',
                            eeDeceasedDod: 'optionYes',
                            eeEstateValued: 'optionYes',
                            completed: 'optionYes'
                        }
                    },
                    caseType: 'gop'
                }
            };
            req.session.journey = journeyProbate;
            ctx = {};
            WillLeft.previousScrennerStepUrl(req, res, ctx);
            expect(ctx.previousUrl).to.equal(ExceptedEstateValued.constructor.getUrl());
            done();
        });
    });
});
