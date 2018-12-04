'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const DeceasedDod = steps.DeceasedDod;

describe('DeceasedDod', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedDod.constructor.getUrl();
            expect(url).to.equal('/deceased-dod');
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return the ctx with the deceased date of death and the screening_question feature toggle on', (done) => {
            const req = {
                sessionID: 'dummy_sessionId',
                session: {form: {}, featureToggles: {screening_questions: true}},
                body: {
                    dod_day: '02',
                    dod_month: '03',
                    dod_year: '1952'
                }
            };
            const ctx = DeceasedDod.getContextData(req);
            expect(ctx).to.deep.equal({
                dod_day: 2,
                dod_month: 3,
                dod_year: 1952,
                dod_date: '1952-03-02T00:00:00.000Z',
                dod_formattedDate: '2 March 1952',
                isToggleEnabled: true,
                sessionID: 'dummy_sessionId'
            });
            done();
        });

        it('should return the ctx with the deceased date of death and the screening_question feature toggle off', (done) => {
            const req = {
                sessionID: 'dummy_sessionId',
                session: {form: {}, featureToggles: {screening_questions: false}},
                body: {
                    dod_day: '02',
                    dod_month: '03',
                    dod_year: '1952'
                }
            };
            const ctx = DeceasedDod.getContextData(req);
            expect(ctx).to.deep.equal({
                dod_day: 2,
                dod_month: 3,
                dod_year: 1952,
                dod_date: '1952-03-02T00:00:00.000Z',
                dod_formattedDate: '2 March 1952',
                isToggleEnabled: false,
                sessionID: 'dummy_sessionId'
            });
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = DeceasedDod.nextStepOptions();
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
            DeceasedDod.action(ctx);
            assert.isUndefined(ctx.isToggleEnabled);
        });
    });
});
