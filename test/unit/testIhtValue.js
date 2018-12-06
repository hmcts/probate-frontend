'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const IhtValue = steps.IhtValue;

describe('IhtValue', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = IhtValue.constructor.getUrl();
            expect(url).to.equal('/iht-value');
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return the ctx with the iht values and the screening_question feature toggle on', (done) => {
            const req = {
                sessionID: 'dummy_sessionId',
                session: {form: {}, featureToggles: {screening_questions: true}},
                body: {
                    grossValueOnline: '500000',
                    netValueOnline: '400000'
                }
            };
            const ctx = IhtValue.getContextData(req);
            expect(ctx).to.deep.equal({
                grossValueOnline: '500000',
                netValueOnline: '400000',
                isToggleEnabled: true,
                sessionID: 'dummy_sessionId'
            });
            done();
        });

        it('should return the ctx with the iht values and the screening_question feature toggle off', (done) => {
            const req = {
                sessionID: 'dummy_sessionId',
                session: {form: {}, featureToggles: {screening_questions: false}},
                body: {
                    grossValueOnline: '500000',
                    netValueOnline: '400000'
                }
            };
            const ctx = IhtValue.getContextData(req);
            expect(ctx).to.deep.equal({
                grossValueOnline: '500000',
                netValueOnline: '400000',
                isToggleEnabled: false,
                sessionID: 'dummy_sessionId'
            });
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = IhtValue.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'isToggleEnabled',
                    value: true,
                    choice: 'toggleOn'
                }]
            });
            done();
        });
    });

    describe('action', () => {
        it('test isToggleEnabled is removed from the context', () => {
            const ctx = {
                isToggleEnabled: false
            };
            IhtValue.action(ctx);
            assert.isUndefined(ctx.isToggleEnabled);
        });
    });
});
