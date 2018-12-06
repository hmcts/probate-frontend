'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const DeceasedName = steps.DeceasedName;

describe('DeceasedName', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedName.constructor.getUrl();
            expect(url).to.equal('/deceased-name');
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return the ctx with the deceased name and the screening_question feature toggle on', (done) => {
            const req = {
                sessionID: 'dummy_sessionId',
                session: {form: {}, featureToggles: {screening_questions: true}},
                body: {
                    firstName: 'Deceased FN',
                    lastName: 'Deceased FN'
                }
            };
            const ctx = DeceasedName.getContextData(req);
            expect(ctx).to.deep.equal({
                firstName: 'Deceased FN',
                lastName: 'Deceased FN',
                isToggleEnabled: true,
                sessionID: 'dummy_sessionId'
            });
            done();
        });

        it('should return the ctx with the deceased name and the screening_question feature toggle off', (done) => {
            const req = {
                sessionID: 'dummy_sessionId',
                session: {form: {}, featureToggles: {screening_questions: false}},
                body: {
                    firstName: 'Deceased FN',
                    lastName: 'Deceased FN'
                }
            };
            const ctx = DeceasedName.getContextData(req);
            expect(ctx).to.deep.equal({
                firstName: 'Deceased FN',
                lastName: 'Deceased FN',
                isToggleEnabled: false,
                sessionID: 'dummy_sessionId'
            });
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = DeceasedName.nextStepOptions();
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
            DeceasedName.action(ctx);
            assert.isUndefined(ctx.isToggleEnabled);
        });
    });
});
