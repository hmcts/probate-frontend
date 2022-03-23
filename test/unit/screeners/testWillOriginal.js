'use strict';

const journey = require('app/journeys/probate');
const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const coreContextMockData = require('../../data/core-context-mock-data.json');
const WillOriginal = steps.WillOriginal;

describe('WillOriginal', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = WillOriginal.constructor.getUrl();
            expect(url).to.equal('/will-original');
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
                    original: 'optionYes'
                }
            };
            const res = {};

            const ctx = WillOriginal.getContextData(req, res);
            expect(ctx).to.deep.equal({
                ...coreContextMockData,
                sessionID: 'dummy_sessionId',
                original: 'optionYes'
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
                            completed: 'optionYes',
                            left: 'optionYes'
                        }
                    }
                }
            };
            const ctx = {
                original: 'optionYes'
            };
            const nextStepUrl = WillOriginal.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/applicant-executor');
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
                            completed: 'optionYes',
                            left: 'optionYes'
                        }
                    }
                }
            };
            const ctx = {
                original: 'optionNo'
            };
            const nextStepUrl = WillOriginal.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/notOriginal');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = WillOriginal.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'original',
                    value: 'optionYes',
                    choice: 'isOriginal'
                }]
            });
            done();
        });
    });
});
