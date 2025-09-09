const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const SeparationDate = steps.SeparationDate;

describe('SeparationDate', () => {

    const ctxWithYes = {
        separationDateKnown: 'optionYes',
        separationDate: '4/10/2025'
    };

    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = SeparationDate.constructor.getUrl();
            expect(url).to.equal('/deceased-separation-date');
            done();
        });
    });

    describe('handleGet()', () => {
        it('should split SeparationDate to separate fields, and add to the context', (done) => {
            const [ctx] = SeparationDate.handleGet(ctxWithYes);
            expect(ctx).to.deep.equal({
                'separationDateKnown': 'optionYes',
                'separationDate': '4/10/2025',
                'separation-day': '4',
                'separation-month': '10',
                'separation-year': '2025'
            });
            done();
        });
    });

    describe('handlePost()', () => {
        it ('should reset separation date when date is not known', (done) => {
            const ctxIn = {
                'separationDateKnown': 'optionNo',
                'separationDate': '4/10/2025'
            };
            const [ctx] = SeparationDate.handlePost(ctxIn);
            const ctxOut = {
                'separationDateKnown': 'optionNo',
                'separationDate': ''
            };
            expect(ctx).to.deep.equal(ctxOut);
            done();
        });

        it ('should create an error when no year no month no day has been entered', (done) => {
            const ctxIn = {
                'separationDateKnown': 'optionYes'
            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = SeparationDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'separationDate-day-month-year',
                'href': '#separationDate-day-month-year',
                'msg': 'Enter the date the legal separation took place'
            }]);
            done();
        });

        it ('should create an error when no year has been entered', (done) => {
            const ctxIn = {
                'separationDateKnown': 'optionYes',
                'separation-day': '4',
                'separation-month': '10',

            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = SeparationDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'separationDate-year',
                'href': '#separationDate-year',
                'msg': 'Date of legal separation must include a year'
            }]);
            done();
        });

        it ('should create an error when no month has been entered', (done) => {
            const ctxIn = {
                'separationDateKnown': 'optionYes',
                'separation-day': '4',
                'separation-year': '2025',

            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = SeparationDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'separationDate-month',
                'href': '#separationDate-month',
                'msg': 'Date of legal separation must include a month'
            }]);
            done();
        });

        it ('should create an error when no day has been entered', (done) => {
            const ctxIn = {
                'separationDateKnown': 'optionYes',
                'separation-month': '10',
                'separation-year': '2025',

            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = SeparationDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'separationDate-day',
                'href': '#separationDate-day',
                'msg': 'Date of legal separation must include a day'
            }]);
            done();
        });

        it ('should create an error when day but no year and no month', (done) => {
            const ctxIn = {
                'separationDateKnown': 'optionYes',
                'separation-day': '4',
            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = SeparationDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'separationDate-month-year',
                'href': '#separationDate-month-year',
                'msg': 'Date of legal separation must include a month and year'
            }]);
            done();
        });

        it ('should create an error when month but no day and no year', (done) => {
            const ctxIn = {
                'separationDateKnown': 'optionYes',
                'separation-month': '10',
            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = SeparationDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'separationDate-day-year',
                'href': '#separationDate-day-year',
                'msg': 'Date of legal separation must include a day and year'
            }]);
            done();
        });

        it ('should create an error when year but no day and no month', (done) => {
            const ctxIn = {
                'separationDateKnown': 'optionYes',
                'separation-year': '2025',
            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = SeparationDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'separationDate-day-month',
                'href': '#separationDate-day-month',
                'msg': 'Date of legal separation must include a day and month'
            }]);
            done();
        });

        it ('should create an error when a future date has been entered', (done) => {
            const ctxIn = {
                'separationDateKnown': 'optionYes',
                'separation-day': '4',
                'separation-month': '10',
                'separation-year': '3000'
            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = SeparationDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'separationDate',
                'href': '#separationDate',
                'msg': 'The date of legal separation must be before {deceasedName}’s date of death'
            }]);
            done();
        });

        it ('should create an error if negative day, month or year entered', (done) => {
            const ctxIn = {
                'separationDateKnown': 'optionYes',
                'separation-day': '-4',
                'separation-month': '10',
                'separation-year': '2022'
            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = SeparationDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'separationDate',
                'href': '#separationDate',
                'msg': 'Date of legal separation must be a real date'
            }]);
            done();
        });

        it ('should create an error when an invalid date has been entered', (done) => {
            const ctxIn = {
                'separationDateKnown': 'optionYes',
                'separation-day': 'a',
                'separation-month': 'b',
                'separation-year': 'c'
            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = SeparationDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'separationDate',
                'href': '#separationDate',
                'msg': 'Date of legal separation must be a real date'
            }]);
            done();
        });

        it ('should add the date with day, month and year as a formatted string to the context', (done) => {
            const ctxIn = {
                'separationDateKnown': 'optionYes',
                'separationDate-day': '4',
                'separationDate-month': '08',
                'separationDate-year': '2025',
                'separation-day': '4',
                'separation-month': '08',
                'separation-year': '2025'
            };
            const [ctx] = SeparationDate.handlePost(ctxIn);
            const ctxOut = {
                'separationDateKnown': 'optionYes',
                'separationDate': '4/08/2025',
                'separationDate-day': '4',
                'separationDate-month': '08',
                'separationDate-year': '2025',
                'separation-day': '4',
                'separation-month': '08',
                'separation-year': '2025'
            };
            expect(ctx).to.deep.equal(ctxOut);
            done();
        });
    });

    describe('action()', () => {
        it('should clean up context', () => {
            const ctxIn = {
                'separationDate-day': '4',
                'separationDate-month': '10',
                'separationDate-year': '2025'
            };
            const [ctx] = SeparationDate.action(ctxIn);
            expect(ctx).to.deep.equal({});
        });
    });
});
