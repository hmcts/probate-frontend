'use strict';

const journey = require('app/journeys/probate');
const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const IhtCompleted = steps.IhtCompleted;
const content = require('app/resources/en/translation/screeners/ihtcompleted');

describe('IhtCompleted', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = IhtCompleted.constructor.getUrl();
            expect(url).to.equal('/iht-completed');
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
                    completed: content.optionYes
                }
            };
            const res = {};

            const ctx = IhtCompleted.getContextData(req, res);
            expect(ctx).to.deep.equal({
                sessionID: 'dummy_sessionId',
                completed: content.optionYes,
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
                completed: content.optionYes
            };
            const nextStepUrl = IhtCompleted.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/will-left');
            done();
        });

        it('should return the correct url when No is given', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                completed: content.optionNo
            };
            const nextStepUrl = IhtCompleted.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/ihtNotCompleted');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = IhtCompleted.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'completed',
                    value: content.optionYes,
                    choice: 'completed'
                }]
            });
            done();
        });
    });
});
