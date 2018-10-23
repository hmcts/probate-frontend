'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
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

        it('should return the ctx with the deceased dob', (done) => {
            ctx = {
                dob_day: '02',
                dob_month: '03',
                dob_year: '1952'
            };
            errors = [];
            [ctx, errors] = DeceasedDob.handlePost(ctx, errors);
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
            [ctx, errors] = DeceasedDob.handlePost(ctx, errors);
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
    });
});
