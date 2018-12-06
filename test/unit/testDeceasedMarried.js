'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const DeceasedMarried = steps.DeceasedMarried;

describe('DeceasedMarried', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedMarried.constructor.getUrl();
            expect(url).to.equal('/deceased-married');
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return the ctx with the deceased marital status and the screening_question feature toggle on', (done) => {
            const req = {
                sessionID: 'dummy_sessionId',
                session: {form: {}, featureToggles: {screening_questions: true}},
                body: {
                    married: 'Yes'
                }
            };
            const ctx = DeceasedMarried.getContextData(req);
            expect(ctx).to.deep.equal({
                married: 'Yes',
                isToggleEnabled: true,
                sessionID: 'dummy_sessionId'
            });
            done();
        });

        it('should return the ctx with the deceased marital status and the screening_question feature toggle off', (done) => {
            const req = {
                sessionID: 'dummy_sessionId',
                session: {form: {}, featureToggles: {screening_questions: false}},
                body: {
                    married: 'Yes'
                }
            };
            const ctx = DeceasedMarried.getContextData(req);
            expect(ctx).to.deep.equal({
                married: 'Yes',
                isToggleEnabled: false,
                sessionID: 'dummy_sessionId'
            });
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = DeceasedMarried.nextStepOptions();
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
            DeceasedMarried.action(ctx);
            assert.isUndefined(ctx.isToggleEnabled);
        });
    });
});
