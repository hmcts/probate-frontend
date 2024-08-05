'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const DeceasedDob = steps.DeceasedDob;
const content = require('app/resources/en/translation/deceased/dob');
const journeyProbate = require('../../../app/journeys/probate');
const PreviousStep = steps.DeceasedNameAsOnWill;
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
    });

    describe('previousStepUrl()', () => {
        let ctx;
        it('should return the previous step url', (done) => {
            const res = {
                redirect: (url) => url
            };
            const req = {
                session: {
                    language: 'en',
                    form: {
                        language: {
                            bilingual: 'optionYes'
                        },
                        deceased: {
                            firstName: 'John',
                            lastName: 'Doe',
                        },
                        declaration: {
                            declarationCheckbox: 'true'
                        }
                    },
                    back: ['hello']
                }
            };
            req.session.journey = journeyProbate;
            ctx = {};
            DeceasedDob.previousStepUrl(req, res, ctx);
            expect(ctx.previousUrl).to.equal(PreviousStep.constructor.getUrl());
            done();
        });
    });

});
