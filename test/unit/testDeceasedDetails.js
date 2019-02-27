'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const DeceasedDetails = steps.DeceasedDetails;

describe('DeceasedDetails', () => {
    describe('dateName()', () => {
        it('should return the date names array', (done) => {
            const dateName = DeceasedDetails.dateName();
            expect(dateName).to.deep.equal(['dob', 'dod']);
            done();
        });
    });

    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedDetails.constructor.getUrl();
            expect(url).to.equal('/deceased-details');
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx;
        let errors;

        it('should return the ctx with the deceased name, dob and dod', (done) => {
            ctx = {
                firstName: 'Dee',
                lastName: 'Ceased',
                dob_day: '02',
                dob_month: '03',
                dob_year: '1952',
                dod_day: '02',
                dod_month: '03',
                dod_year: '2000'
            };
            errors = [];
            [ctx, errors] = DeceasedDetails.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                firstName: 'Dee',
                lastName: 'Ceased',
                dob_day: '02',
                dob_month: '03',
                dob_year: '1952',
                dod_day: '02',
                dod_month: '03',
                dod_year: '2000'
            });
            done();
        });

        it('should return an error if dob is in the future', (done) => {
            ctx = {
                firstName: 'Dee',
                lastName: 'Ceased',
                dob_day: '02',
                dob_month: '03',
                dob_year: '3000',
                dod_day: '02',
                dod_month: '03',
                dod_year: '2000'
            };
            errors = [];
            [ctx, errors] = DeceasedDetails.handlePost(ctx, errors);
            expect(errors).to.deep.equal([
                {
                    msg: {
                        message: 'Enter a date in the past',
                        summary: 'You must enter a date of birth in the past'
                    },
                    param: 'dob_date'
                }
            ]);
            done();
        });

        it('should return an error if dod is in the future', (done) => {
            ctx = {
                firstName: 'Dee',
                lastName: 'Ceased',
                dob_day: '02',
                dob_month: '03',
                dob_year: '2012',
                dod_day: '02',
                dod_month: '03',
                dod_year: '3000'
            };
            errors = [];
            [ctx, errors] = DeceasedDetails.handlePost(ctx, errors);
            expect(errors).to.deep.equal([
                {
                    msg: {
                        message: 'Enter a date in the past',
                        summary: 'You must enter a date of death in the past'
                    },
                    param: 'dod_date'
                }
            ]);
            done();
        });

        it('should return an error if dob is after dod', (done) => {
            ctx = {
                firstName: 'Dee',
                lastName: 'Ceased',
                dob_day: '02',
                dob_month: '03',
                dob_year: '2018',
                dod_day: '02',
                dod_month: '03',
                dod_year: '2012'
            };
            errors = [];
            [ctx, errors] = DeceasedDetails.handlePost(ctx, errors);
            expect(errors).to.deep.equal([
                {
                    msg: {
                        message: 'Enter a date of birth that is before the date of death',
                        summary: 'The date of birth you entered is after the date of death'
                    },
                    param: 'dob_date'
                }
            ]);
            done();
        });
    });
});
