'use strict';

const journey = require('app/journeys/probate');
const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const WillOriginal = steps.WillOriginal;
const content = require('app/resources/en/translation/screeners/willoriginal');

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
                    form: {},
                    journeyType: 'Probate'
                },
                body: {
                    original: content.optionYes
                }
            };
            const res = {};

            const ctx = WillOriginal.getContextData(req, res);
            expect(ctx).to.deep.equal({
                sessionID: 'dummy_sessionId',
                original: content.optionYes,
                journeyType: 'Probate'
            });
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when Yes is given', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                original: content.optionYes
            };
            const nextStepUrl = WillOriginal.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/applicant-executor');
            done();
        });

        it('should return the correct url when No is given', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                original: content.optionNo
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
                    value: content.optionYes,
                    choice: 'isOriginal'
                }]
            });
            done();
        });
    });
});
