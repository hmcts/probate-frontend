'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const CodicilsNumber = steps.CodicilsNumber;

describe('CodicilsNumber', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = CodicilsNumber.constructor.getUrl();
            expect(url).to.equal('/codicils-number');
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return the ctx with a valid will codicils number and the screening_question feature toggle', (done) => {
            const req = {
                sessionID: 'dummy_sessionId',
                session: {form: {}, featureToggles: {screening_questions: true}},
                body: {
                    codicilsNumber: '3'
                }
            };
            const ctx = CodicilsNumber.getContextData(req);
            expect(ctx).to.deep.equal({
                codicilsNumber: 3,
                isToggleEnabled: true,
                sessionID: 'dummy_sessionId'
            });
            done();
        });

        it('should return the ctx with a null will codicils number and the screening_question feature toggle', (done) => {
            const req = {
                sessionID: 'dummy_sessionId',
                session: {form: {}, featureToggles: {screening_questions: false}},
                body: {
                    codicilsNumber: null
                }
            };
            const ctx = CodicilsNumber.getContextData(req);
            expect(ctx).to.deep.equal({
                codicilsNumber: null,
                isToggleEnabled: false,
                sessionID: 'dummy_sessionId'
            });
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx;
        let errors;

        it('should return the ctx with the will codicils number when there are codicils', (done) => {
            ctx = {
                codicilsNumber: '3'
            };
            errors = {};
            [ctx, errors] = CodicilsNumber.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                codicilsNumber: '3'
            });
            done();
        });

        it('should return the ctx with the will codicils number when there are no codicils', (done) => {
            ctx = {};
            errors = {};
            [ctx, errors] = CodicilsNumber.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                codicilsNumber: 0
            });
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = CodicilsNumber.nextStepOptions();
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
            CodicilsNumber.action(ctx);
            assert.isUndefined(ctx.isToggleEnabled);
        });

        it('should remove isToggleEnabled from the context', () => {
            const ctx = {
                isToggleEnabled: false
            };
            const [testCtx] = CodicilsNumber.action(ctx);
            expect(testCtx).to.deep.equal({});
        });
    });

    describe('isComplete()', () => {
        it('should return false when is less than 1', (done) => {
            const ctx = {codicilsNumber: -1};
            const codicilsNumber = steps.CodicilsNumber;
            const val = codicilsNumber.isComplete(ctx);
            expect(val).to.deep.equal([false, 'inProgress']);
            done();
        });

        it('should return true when codicilsNumber is 2', (done) => {
            const ctx = {codicilsNumber: 2};
            const codicilsNumber = steps.CodicilsNumber;
            const val = codicilsNumber.isComplete(ctx);
            expect(val).to.deep.equal([true, 'inProgress']);
            done();
        });

        it('should return true when codicilsNumber is 0', (done) => {
            const ctx = {codicilsNumber: 0};
            const codicilsNumber = steps.CodicilsNumber;
            const val = codicilsNumber.isComplete(ctx);
            expect(val).to.deep.equal([true, 'inProgress']);
            done();
        });

    });

});
