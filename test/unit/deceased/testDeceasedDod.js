'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const DeceasedDod = steps.DeceasedDod;
const content = require('app/resources/en/translation/deceased/dod');

describe('DeceasedDod', () => {
    describe('dateName()', () => {
        it('should return the date names array', (done) => {
            const dateName = DeceasedDod.dateName();
            expect(dateName).to.deep.equal(['dod']);
            done();
        });
    });

    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedDod.constructor.getUrl();
            expect(url).to.equal('/deceased-dod');
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx;
        let errors;
        let formdata;
        const session = {};

        beforeEach(() => {
            session.form = {};
        });

        it('should return the ctx with the deceased dod', (done) => {
            ctx = {
                'dod-day': '02',
                'dod-month': '03',
                'dod-year': '1952'
            };
            errors = [];
            [ctx, errors] = DeceasedDod.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                'dod-day': '02',
                'dod-month': '03',
                'dod-year': '1952'
            });
            done();
        });

        it('should return the ctx where the deceased dod is same as dob', (done) => {
            session.form = {
                deceased: {
                    'dob-day': '01',
                    'dob-month': '01',
                    'dob-year': '2000'
                }
            };
            ctx = {
                'dod-day': '01',
                'dod-month': '01',
                'dod-year': '2000'
            };
            errors = [];
            [ctx, errors] = DeceasedDod.handlePost(ctx, errors, formdata, session);
            expect([ctx, errors]).to.deep.equal([{
                'dod-day': '01',
                'dod-month': '01',
                'dod-year': '2000'
            },
            []
            ]);
            done();
        });

        it('should return the error for a date in the future', (done) => {
            ctx = {
                'dod-day': '02',
                'dod-month': '03',
                'dod-year': '3000'
            };
            errors = [];
            [ctx, errors] = DeceasedDod.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'dod-date',
                    href: '#dod-date',
                    msg: content.errors['dod-date'].dateInFuture
                }
            ]);
            done();
        });

        it('should return the error for DoD before DoB', (done) => {
            session.form = {
                deceased: {
                    'dob-day': '02',
                    'dob-month': '03',
                    'dob-year': '2002'
                }
            };
            ctx = {
                'dod-day': '01',
                'dod-month': '01',
                'dod-year': '2000'
            };
            errors = [];
            [ctx, errors] = DeceasedDod.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'dod-date',
                    href: '#dod-date',
                    msg: content.errors['dod-date'].dodBeforeDob
                }
            ]);
            done();
        });

        it('should return the error for DoD when no year has been entered', (done) => {
            ctx = {
                'dod-day': '01',
                'dod-month': '01'
            };
            errors = [];
            [ctx, errors] = DeceasedDod.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'dod-year',
                    href: '#dod-year',
                    msg: content.errors['dod-year'].required
                }
            ]);
            done();
        });

        it('should return the error for DoD when no month has been entered', (done) => {
            ctx = {
                'dod-day': '01',
                'dod-year': '2002'
            };
            errors = [];
            [ctx, errors] = DeceasedDod.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'dod-month',
                    href: '#dod-month',
                    msg: content.errors['dod-month'].required
                }
            ]);
            done();
        });

        it('should return the error for DoD when no day has been entered', (done) => {
            ctx = {
                'dod-month': '01',
                'dod-year': '2002'
            };
            errors = [];
            [ctx, errors] = DeceasedDod.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'dod-day',
                    href: '#dod-day',
                    msg: content.errors['dod-day'].required
                }
            ]);
            done();
        });

        it('should return the error for DoD when no day no year has been entered', (done) => {
            ctx = {
                'dod-month': '01'
            };
            errors = [];
            [ctx, errors] = DeceasedDod.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'dod-day-year',
                    href: '#dod-day-year',
                    msg: content.errors['dod-day-year'].required
                }
            ]);
            done();
        });
        it('should return the error for DoD when no day no month has been entered', (done) => {
            ctx = {
                'dod-year': '2002'
            };
            errors = [];
            [ctx, errors] = DeceasedDod.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'dod-day-month',
                    href: '#dod-day-month',
                    msg: content.errors['dod-day-month'].required
                }
            ]);
            done();
        });
        it('should return the error for DoD when no month no year has been entered', (done) => {
            ctx = {
                'dod-day': '01'
            };
            errors = [];
            [ctx, errors] = DeceasedDod.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'dod-month-year',
                    href: '#dod-month-year',
                    msg: content.errors['dod-month-year'].required
                }
            ]);
            done();
        });
        it('should return the error for DoD if negative day, month or year entered', (done) => {
            ctx = {
                'dod-day': '-01',
                'dod-month': '01',
                'dod-year': '2000'
            };
            errors = [];
            [ctx, errors] = DeceasedDod.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'dod-date',
                    href: '#dod-date',
                    msg: content.errors['dod-date'].invalid
                }
            ]);
            done();
        });

        it('should return the error for DoD when an invalid date has been entered', (done) => {
            ctx = {
                'dod-day': 'a',
                'dod-month': 'b',
                'dod-year': 'c'
            };
            errors = [];
            [ctx, errors] = DeceasedDod.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'dod-date',
                    href: '#dod-date',
                    msg: content.errors['dod-date'].invalid
                }
            ]);
            done();
        });
    });

    describe('getContextData()', () => {
        let ctx;
        let req;

        it('should return the context with the deceased name', (done) => {
            req = {
                session: {
                    form: {
                        deceased: {
                            firstName: 'John',
                            lastName: 'Doe',
                            'dob-date': '1918-01-01',
                            'dod-date': '2020-03-02'
                        }
                    }
                }
            };

            ctx = DeceasedDod.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('shouldHaveBackLink()', () => {
        it('should have a back link', (done) => {
            const actual = DeceasedDod.shouldHaveBackLink();
            expect(actual).to.equal(true);
            done();
        });
    });
});
