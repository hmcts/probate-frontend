'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const DeceasedDetails = steps.DeceasedDetails;
const content = require('app/resources/en/translation/deceased/details');

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
                'firstName': 'Dee',
                'lastName': 'Ceased',
                'dob-day': '02',
                'dob-month': '03',
                'dob-year': '1952',
                'dod-day': '02',
                'dod-month': '03',
                'dod-year': '2000'
            };
            errors = [];
            [ctx, errors] = DeceasedDetails.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                'firstName': 'Dee',
                'lastName': 'Ceased',
                'dob-day': '02',
                'dob-month': '03',
                'dob-year': '1952',
                'dod-day': '02',
                'dod-month': '03',
                'dod-year': '2000'
            });
            done();
        });

        it('should return an error if dob is in the future', (done) => {
            ctx = {
                'firstName': 'Dee',
                'lastName': 'Ceased',
                'dob-day': '02',
                'dob-month': '03',
                'dob-year': '3000',
                'dod-day': '02',
                'dod-month': '03',
                'dod-year': '2000'
            };
            errors = [];
            [ctx, errors] = DeceasedDetails.handlePost(ctx, errors);
            expect(errors).to.deep.equal([
                {
                    field: 'dob-date',
                    href: '#dob-date',
                    msg: {
                        summary: content.errors['dob-date'].dateInFuture.summary,
                        message: content.errors['dob-date'].dateInFuture.message
                    }
                }
            ]);
            done();
        });

        it('should return an error if dod is in the future', (done) => {
            ctx = {
                'firstName': 'Dee',
                'lastName': 'Ceased',
                'dob-day': '02',
                'dob-month': '03',
                'dob-year': '2012',
                'dod-day': '02',
                'dod-month': '03',
                'dod-year': '3000'
            };
            errors = [];
            [ctx, errors] = DeceasedDetails.handlePost(ctx, errors);
            expect(errors).to.deep.equal([
                {
                    field: 'dod-date',
                    href: '#dod-date',
                    msg: {
                        summary: content.errors['dod-date'].dateInFuture.summary,
                        message: content.errors['dod-date'].dateInFuture.message
                    }
                }
            ]);
            done();
        });

        it('should return an error if dob is after dod', (done) => {
            ctx = {
                'firstName': 'Dee',
                'lastName': 'Ceased',
                'dob-day': '02',
                'dob-month': '03',
                'dob-year': '2018',
                'dod-day': '02',
                'dod-month': '03',
                'dod-year': '2012'
            };
            errors = [];
            [ctx, errors] = DeceasedDetails.handlePost(ctx, errors);
            expect(errors).to.deep.equal([
                {
                    field: 'dob-date',
                    href: '#dob-date',
                    msg: {
                        summary: content.errors['dob-date'].dodBeforeDob.summary,
                        message: content.errors['dob-date'].dodBeforeDob.message
                    }
                }
            ]);
            done();
        });
    });
});
