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

    describe('nextStepUrl()', () => {
        it('should return url for the next step if there are codicils', (done) => {
            const req = {
                session: {
                    journey: journey,
                    form: {
                        caseType: 'gop'
                    },
                    featureToggles: {
                        screening_questions: false
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
                    journey: journey
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
});
