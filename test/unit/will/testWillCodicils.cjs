'use strict';

const journey = require('app/journeys/probate');
const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const coreContextMockData = require('../../data/core-context-mock-data.json');
const WillCodicils = steps.WillCodicils;

describe('WillCodicils', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = WillCodicils.constructor.getUrl();
            expect(url).to.equal('/will-codicils');
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return the ctx with the will codicils', (done) => {
            const req = {
                sessionID: 'dummy_sessionId',
                session: {
                    language: 'en',
                    form: {
                        caseType: 'gop',
                        ccdCase: {
                            id: 1234567890123456,
                            state: 'Pending'
                        }
                    },
                    caseType: 'gop'
                },
                body: {
                    codicils: 'optionYes'
                }
            };
            const ctx = WillCodicils.getContextData(req);
            expect(ctx).to.deep.equal({
                ...coreContextMockData,
                codicils: 'optionYes',
                sessionID: 'dummy_sessionId'
            });
            done();
        });
    });

    describe('nextStepUrl() for will condition toggle OFF', () => {
        it('should return url for the next step if there are codicils', (done) => {
            const req = {
                session: {
                    journey: journey,
                    form: {
                        caseType: 'gop'
                    },
                    featureToggles: {
                        screening_questions: false,
                        ft_will_condition: false
                    },
                    caseType: 'gop'
                },
                body: {
                    codicils: 'optionYes'
                }
            };
            const ctx = {
                codicils: 'optionYes'
            };
            const WillCodicils = steps.WillCodicils;
            const nextStepUrl = WillCodicils.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/codicils-number');
            done();
        });

        it('should return the url for the next step if there are no codicils', (done) => {
            const req = {
                session: {
                    journey: journey,
                    featureToggles: {
                        ft_will_condition: false
                    }
                }
            };
            const ctx = {
                codicils: 'optionNo'
            };
            const WillCodicils = steps.WillCodicils;
            const nextStepUrl = WillCodicils.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/task-list');
            done();
        });
    });

    describe('nextStepUrl() for will condition toggle ON', () => {
        it('should return url for the next step if there are codicils', (done) => {
            const req = {
                session: {
                    journey: journey,
                    form: {
                        caseType: 'gop'
                    },
                    featureToggles: {
                        screening_questions: false,
                        ft_will_condition: true
                    },
                    caseType: 'gop'
                },
                body: {
                    codicils: 'optionYes'
                }
            };
            const ctx = {
                codicils: 'optionYes'
            };
            const WillCodicils = steps.WillCodicils;
            const nextStepUrl = WillCodicils.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/codicils-number');
            done();
        });

        it('should return the url for the next step if there are no codicils', (done) => {
            const req = {
                session: {
                    journey: journey,
                    featureToggles: {
                        screening_questions: false,
                        ft_will_condition: true
                    }
                }
            };
            const ctx = {
                codicils: 'optionNo'
            };
            const WillCodicils = steps.WillCodicils;
            const nextStepUrl = WillCodicils.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/deceased-written-wishes');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = WillCodicils.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'codicils',
                    value: 'optionNo',
                    choice: 'noCodicils'
                }]
            });
            done();
        });
    });

    describe('action()', () => {
        it('test it cleans up context', () => {
            const ctx = {
                codicils: 'optionNo',
                codicilsNumber: 3
            };
            WillCodicils.action(ctx);
            assert.isUndefined(ctx.codicilsNumber);
        });
    });

    describe('resetValues()', () => {
        it('should reset values for no will updates', (done) => {
            const ctx = {
                codicilsHasVisibleDamage: 'optionYes',
                codicilsDamageReasonKnown: 'optionYes',
                codicilsDamageReasonDescription: 'desc',
                codicilsDamageCulpritKnown: 'optionYes',
                codicilsDamageCulpritName: {
                    firstName: 'fn',
                    lastName: 'ln'
                },
                codicilsDamageDateKnown: 'optionYes',
                codicilsDamageDate: '/12/2020'
            };
            WillCodicils.resetValues(ctx);
            expect(ctx.codicilsHasVisibleDamage).to.equal('optionNo');
            expect(ctx.codicilsDamageReasonKnown).to.equal('optionNo');
            expect(ctx.codicilsDamageReasonDescription).to.equal('');
            expect(ctx.codicilsDamageCulpritKnown).to.equal('optionNo');
            expect(ctx.codicilsDamageCulpritName).to.eql({});
            expect(ctx.codicilsDamageDateKnown).to.equal('optionNo');
            expect(ctx.codicilsDamageDate).to.equal('');
            done();
        });
    });

});
