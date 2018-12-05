'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const IhtPaper = steps.IhtPaper;

describe('IhtPaper', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = IhtPaper.constructor.getUrl();
            expect(url).to.equal('/iht-paper');
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return the ctx with the iht form and values and the screening_question feature toggle on', (done) => {
            const req = {
                sessionID: 'dummy_sessionId',
                session: {form: {}, featureToggles: {screening_questions: true}},
                body: {
                    form: 'IHT205',
                    grossIHT205: '500000',
                    netIHT205: '400000'
                }
            };
            const ctx = IhtPaper.getContextData(req);
            expect(ctx).to.deep.equal({
                form: 'IHT205',
                grossIHT205: '500000',
                netIHT205: '400000',
                isToggleEnabled: true,
                sessionID: 'dummy_sessionId'
            });
            done();
        });

        it('should return the ctx with the iht form and values and the screening_question feature toggle off', (done) => {
            const req = {
                sessionID: 'dummy_sessionId',
                session: {form: {}, featureToggles: {screening_questions: false}},
                body: {
                    form: 'IHT205',
                    grossIHT205: '500000',
                    netIHT205: '400000'
                }
            };
            const ctx = IhtPaper.getContextData(req);
            expect(ctx).to.deep.equal({
                form: 'IHT205',
                grossIHT205: '500000',
                netIHT205: '400000',
                isToggleEnabled: false,
                sessionID: 'dummy_sessionId'
            });
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = IhtPaper.nextStepOptions();
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
        it('test it cleans up context', () => {
            const ctx = {
                grossValuePaper: 500000,
                netValuePaper: 400000,
                isToggleEnabled: false
            };
            IhtPaper.action(ctx);
            assert.isUndefined(ctx.grossValuePaper);
            assert.isUndefined(ctx.netValuePaper);
            assert.isUndefined(ctx.isToggleEnabled);
        });
    });
});
