'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const DeceasedDob = steps.DeceasedDob;
const content = require('app/resources/en/translation/deceased/dob');

describe('DeceasedDob', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedDob.constructor.getUrl();
            expect(url).to.equal('/deceased-dob');
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx;
        let errors;
        let formdata;
        const session = {};

        beforeEach(() => {
            session.form = {
                deceased: {
                    dod_day: '01',
                    dod_month: '01',
                    dod_year: '2000'
                }
            };
        });

        it('should return the ctx with the deceased dob and the screening_question feature toggle', (done) => {
            ctx = {
                dob_day: '02',
                dob_month: '03',
                dob_year: '1952'
            };
            errors = [];
            [ctx, errors] = DeceasedDob.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                dob_day: '02',
                dob_month: '03',
                dob_year: '1952'
            });
            done();
        });

        it('should return the error for a date in the future', (done) => {
            ctx = {
                dob_day: '02',
                dob_month: '03',
                dob_year: '3000'
            };
            errors = [];
            [ctx, errors] = DeceasedDob.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    param: 'dob_date',
                    msg: {
                        summary: content.errors.dob_date.dateInFuture.summary,
                        message: content.errors.dob_date.dateInFuture.message
                    }
                }
            ]);
            done();
        });

        it('should return the error for DoD before DoB', (done) => {
            ctx = {
                dob_day: '02',
                dob_month: '03',
                dob_year: '2002'
            };
            errors = [];
            [ctx, errors] = DeceasedDob.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    param: 'dob_date',
                    msg: {
                        summary: content.errors.dob_date.dodBeforeDob.summary,
                        message: content.errors.dob_date.dodBeforeDob.message
                    }
                }
            ]);
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return the ctx with the deceased date of birth and the screening_question feature toggle on', (done) => {
            const req = {
                sessionID: 'dummy_sessionId',
                session: {form: {}, featureToggles: {screening_questions: true}},
                body: {
                    dob_day: '02',
                    dob_month: '03',
                    dob_year: '1952'
                }
            };
            const ctx = DeceasedDob.getContextData(req);
            expect(ctx).to.deep.equal({
                dob_day: 2,
                dob_month: 3,
                dob_year: 1952,
                dob_date: '1952-03-02T00:00:00.000Z',
                dob_formattedDate: '2 March 1952',
                isToggleEnabled: true,
                sessionID: 'dummy_sessionId'
            });
            done();
        });

        it('should return the ctx with the deceased date of birth and the screening_question feature toggle off', (done) => {
            const req = {
                sessionID: 'dummy_sessionId',
                session: {form: {}, featureToggles: {screening_questions: false}},
                body: {
                    dob_day: '02',
                    dob_month: '03',
                    dob_year: '1952'
                }
            };
            const ctx = DeceasedDob.getContextData(req);
            expect(ctx).to.deep.equal({
                dob_day: 2,
                dob_month: 3,
                dob_year: 1952,
                dob_date: '1952-03-02T00:00:00.000Z',
                dob_formattedDate: '2 March 1952',
                isToggleEnabled: false,
                sessionID: 'dummy_sessionId'
            });
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = DeceasedDob.nextStepOptions();
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
            DeceasedDob.action(ctx);
            assert.isUndefined(ctx.isToggleEnabled);
        });
    });
});
