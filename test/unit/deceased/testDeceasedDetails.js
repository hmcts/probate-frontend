'use strict';

const journey = require('app/journeys/intestacy');
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
            expect(url).to.equal('/deceased-details*');
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
            [ctx, errors] = DeceasedDetails.handlePost(ctx, errors, {}, {language: 'en'});
            expect(errors).to.deep.equal([
                {
                    field: 'dob-date',
                    href: '#dob-date',
                    msg: content.errors['dob-date'].dateInFuture
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
            [ctx, errors] = DeceasedDetails.handlePost(ctx, errors, {}, {language: 'en'});
            expect(errors).to.deep.equal([
                {
                    field: 'dod-date',
                    href: '#dod-date',
                    msg: content.errors['dod-date'].dateInFuture
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
            [ctx, errors] = DeceasedDetails.handlePost(ctx, errors, {}, {language: 'en'});
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

    describe('nextStepUrl()', () => {
        it('should return the correct url when a valid date on or after 1 Oct 2014 is given', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                'dod-day': '13',
                'dod-month': '04',
                'dod-year': '2015'
            };
            const nextStepUrl = DeceasedDetails.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/deceased-address*');
            done();
        });

        it('should return the correct url when a valid date before 1 Oct 2014 is given', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                'dod-day': '13',
                'dod-month': '04',
                'dod-year': '2010'
            };
            const nextStepUrl = DeceasedDetails.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/notDiedAfterOctober2014');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {
                'dod-day': '13',
                'dod-month': '04',
                'dod-year': '2015'
            };
            const nextStepOptions = DeceasedDetails.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'diedAfterOctober2014',
                    value: true,
                    choice: 'diedAfter'
                }]
            });
            done();
        });
    });

    describe('action()', () => {
        it('test that context variables are removed and empty object returned', () => {
            let formdata = {};
            let ctx = {
                diedAfterOctober2014: true
            };
            [ctx, formdata] = DeceasedDetails.action(ctx, formdata);
            expect(ctx).to.deep.equal({});
        });
    });
});
