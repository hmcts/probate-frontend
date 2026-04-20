'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const DeceasedDob = steps.DeceasedDob;
const content = require('app/resources/en/translation/deceased/dob');
//const PreviousStep = steps.DeceasedAliasNameOnWill;

describe('DeceasedDob', () => {
    describe('dateName()', () => {
        it('should return the date names array', (done) => {
            const dateName = DeceasedDob.dateName();
            expect(dateName).to.deep.equal(['dob']);
            done();
        });
    });

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
                    'dod-day': '01',
                    'dod-month': '01',
                    'dod-year': '2000'
                }
            };
        });

        it('should return the ctx with the deceased dob', (done) => {
            ctx = {
                'dob-day': '02',
                'dob-month': '03',
                'dob-year': '1952'
            };
            errors = [];
            [ctx, errors] = DeceasedDob.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                'dob-day': '02',
                'dob-month': '03',
                'dob-year': '1952'
            });
            done();
        });

        it('should return the ctx where the deceased dob is same as dod', (done) => {
            ctx = {
                'dob-day': '01',
                'dob-month': '01',
                'dob-year': '2000'
            };
            errors = [];
            [ctx, errors] = DeceasedDob.handlePost(ctx, errors, formdata, session);
            expect([ctx, errors]).to.deep.equal([{
                'dob-day': '01',
                'dob-month': '01',
                'dob-year': '2000'
            },
            []
            ]);
            done();
        });

        it('should return the error for a date in the future', (done) => {
            ctx = {
                'dob-day': '02',
                'dob-month': '03',
                'dob-year': '3000'
            };
            errors = [];
            [ctx, errors] = DeceasedDob.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'dob-date',
                    href: '#dob-date',
                    msg: content.errors['dob-date'].dateInFuture
                }
            ]);
            done();
        });

        it('should return the error for DoD before DoB', (done) => {
            ctx = {
                'dob-day': '02',
                'dob-month': '03',
                'dob-year': '2002'
            };
            errors = [];
            [ctx, errors] = DeceasedDob.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'dob-date',
                    href: '#dob-date',
                    msg: content.errors['dob-date'].dodBeforeDob
                }
            ]);
            done();
        });
        it('should return the error for DoB when no year has been entered', (done) => {
            ctx = {
                'dob-day': '01',
                'dob-month': '01'
            };
            errors = [];
            [ctx, errors] = DeceasedDob.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'dob-year',
                    href: '#dob-year',
                    msg: content.errors['dob-year'].required
                }
            ]);
            done();
        });

        it('should return the error for DoB when no month has been entered', (done) => {
            ctx = {
                'dob-day': '01',
                'dob-year': '2002'
            };
            errors = [];
            [ctx, errors] = DeceasedDob.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'dob-month',
                    href: '#dob-month',
                    msg: content.errors['dob-month'].required
                }
            ]);
            done();
        });

        it('should return the error for DoB when no day has been entered', (done) => {
            ctx = {
                'dob-month': '01',
                'dob-year': '2002'
            };
            errors = [];
            [ctx, errors] = DeceasedDob.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'dob-day',
                    href: '#dob-day',
                    msg: content.errors['dob-day'].required
                }
            ]);
            done();
        });

        it('should return the error for DoB when no day no year has been entered', (done) => {
            ctx = {
                'dob-month': '01'
            };
            errors = [];
            [ctx, errors] = DeceasedDob.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'dob-day-year',
                    href: '#dob-day-year',
                    msg: content.errors['dob-day-year'].required
                }
            ]);
            done();
        });
        it('should return the error for Dob when no day no month has been entered', (done) => {
            ctx = {
                'dob-year': '2002'
            };
            errors = [];
            [ctx, errors] = DeceasedDob.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'dob-day-month',
                    href: '#dob-day-month',
                    msg: content.errors['dob-day-month'].required
                }
            ]);
            done();
        });
        it('should return the error for DoB when no month no year has been entered', (done) => {
            ctx = {
                'dob-day': '01'
            };
            errors = [];
            [ctx, errors] = DeceasedDob.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'dob-month-year',
                    href: '#dob-month-year',
                    msg: content.errors['dob-month-year'].required
                }
            ]);
            done();
        });
        it('should return the error for DoB if negative day, month or year entered', (done) => {
            ctx = {
                'dob-day': '-01',
                'dob-month': '01',
                'dob-year': '2000'
            };
            errors = [];
            [ctx, errors] = DeceasedDob.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'dob-date',
                    href: '#dob-date',
                    msg: content.errors['dob-date'].invalid
                }
            ]);
            done();
        });

        it('should return the error for DoB when an invalid date has been entered', (done) => {
            ctx = {
                'dob-day': 'a',
                'dob-month': 'b',
                'dob-year': 'c'
            };
            errors = [];
            [ctx, errors] = DeceasedDob.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'dob-date',
                    href: '#dob-date',
                    msg: content.errors['dob-date'].invalid
                }
            ]);
            done();
        });
    });

    describe('shouldHaveBackLink()', () => {
        it('should have a back link', (done) => {
            const actual = DeceasedDob.shouldHaveBackLink();
            expect(actual).to.equal(true);
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
                            'dob-date': '1918-01-01'
                        }
                    }
                }
            };

            ctx = DeceasedDob.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });
});
