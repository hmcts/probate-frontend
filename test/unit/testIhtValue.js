'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const IhtValue = steps.IhtValue;
const json = require('app/resources/en/translation/iht/value');

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

        it('returns invalidCurrencyFormat error when numbers are negative', (done) => {
            let testCtx = {
                grossValueOnline: '-1',
                netValueOnline: '-1'
            };
            let testErrors = [];
            [testCtx, testErrors] = IhtValue.handlePost(testCtx, testErrors);
            expect(testErrors[0].msg.message).to.equal(json.errors.grossValueOnline.invalidCurrencyFormat.message);
            expect(testErrors[1].msg.message).to.equal(json.errors.netValueOnline.invalidCurrencyFormat.message);
            done();
        });

        it('returns netValueGreaterThanGross error when netValue is less than grossValue', (done) => {
            let testCtx = {
                grossValueOnline: '1',
                netValueOnline: '7'
            };
            let testErrors = [];
            [testCtx, testErrors] = IhtValue.handlePost(testCtx, testErrors);
            expect(testErrors[0].msg.message).to.equal(json.errors.netValueOnline.netValueGreaterThanGross.message);
            done();
        });

        it('converts grossValueOnline and netValueOnline to number', (done) => {
            const ctx = {
                grossValueOnline: '1',
                netValueOnline: '1'
            };
            const [testCtx] = IhtValue.handlePost(ctx);
            assert.isNumber(testCtx.grossValue);
            assert.isNumber(testCtx.netValue);
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
        it('test isToggleEnabled is removed from the context', (done) => {
            const ctx = {
                isToggleEnabled: false
            };
            const [testCtx] = IhtValue.action(ctx);
            assert.isUndefined(ctx.isToggleEnabled);
            expect(testCtx).to.deep.equal({});
            done();
        });
    });
});
