const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const DivorceDate = steps.DivorceDate;

describe('DivorceDate', () => {

    const ctxWithYes = {
        divorceDateKnown: 'optionYes',
        divorceDate: '4/10/2025'
    };

    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DivorceDate.constructor.getUrl();
            expect(url).to.equal('/deceased-divorce-date');
            done();
        });
    });

    describe('handleGet()', () => {
        it('should split divorceDate to separate fields, and add to the context', (done) => {
            const [ctx] = DivorceDate.handleGet(ctxWithYes);
            expect(ctx).to.deep.equal({
                'divorceDateKnown': 'optionYes',
                'divorceDate': '4/10/2025',
                'divorce-day': '4',
                'divorce-month': '10',
                'divorce-year': '2025'
            });
            done();
        });
    });

    describe('handlePost()', () => {
        it ('should reset divorce date when date is not known', (done) => {
            const ctxIn = {
                'divorceDateKnown': 'optionNo',
                'divorceDate': '4/10/2025'
            };
            const [ctx] = DivorceDate.handlePost(ctxIn);
            const ctxOut = {
                'divorceDateKnown': 'optionNo',
                'divorceDate': ''
            };
            expect(ctx).to.deep.equal(ctxOut);
            done();
        });

        it ('should create an error when no year no month no day has been entered', (done) => {
            const ctxIn = {
                'divorceDateKnown': 'optionYes'
            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = DivorceDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'divorceDate-day-month-year',
                'href': '#divorceDate-day-month-year',
                'msg': 'Enter the date the divorce or dissolution took place'
            }]);
            done();
        });

        it ('should create an error when no year has been entered', (done) => {
            const ctxIn = {
                'divorceDateKnown': 'optionYes',
                'divorce-day': '4',
                'divorce-month': '10',

            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = DivorceDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'divorceDate-year',
                'href': '#divorceDate-year',
                'msg': 'Date of divorce or dissolution must include a year'
            }]);
            done();
        });

        it ('should create an error when no month has been entered', (done) => {
            const ctxIn = {
                'divorceDateKnown': 'optionYes',
                'divorce-day': '4',
                'divorce-year': '2025',

            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = DivorceDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'divorceDate-month',
                'href': '#divorceDate-month',
                'msg': 'Date of divorce or dissolution must include a month'
            }]);
            done();
        });

        it ('should create an error when no day has been entered', (done) => {
            const ctxIn = {
                'divorceDateKnown': 'optionYes',
                'divorce-month': '10',
                'divorce-year': '2025',

            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = DivorceDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'divorceDate-day',
                'href': '#divorceDate-day',
                'msg': 'Date of divorce or dissolution must include a day'
            }]);
            done();
        });

        it ('should create an error when day but no year and no month', (done) => {
            const ctxIn = {
                'divorceDateKnown': 'optionYes',
                'divorce-day': '4',
            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = DivorceDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'divorceDate-month-year',
                'href': '#divorceDate-month-year',
                'msg': 'Date of divorce or dissolution must include a month and year'
            }]);
            done();
        });

        it ('should create an error when month but no day and no year', (done) => {
            const ctxIn = {
                'divorceDateKnown': 'optionYes',
                'divorce-month': '10',
            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = DivorceDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'divorceDate-day-year',
                'href': '#divorceDate-day-year',
                'msg': 'Date of divorce or dissolution must include a day and year'
            }]);
            done();
        });

        it ('should create an error when year but no day and no month', (done) => {
            const ctxIn = {
                'divorceDateKnown': 'optionYes',
                'divorce-year': '2025',
            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = DivorceDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'divorceDate-day-month',
                'href': '#divorceDate-day-month',
                'msg': 'Date of divorce or dissolution must include a day and month'
            }]);
            done();
        });

        it ('should create an error when a future date has been entered', (done) => {
            const ctxIn = {
                'divorceDateKnown': 'optionYes',
                'divorce-day': '4',
                'divorce-month': '10',
                'divorce-year': '3000'
            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = DivorceDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'divorceDate',
                'href': '#divorceDate',
                'msg': 'The date of divorce or dissolution must be before {deceasedName}’s date of death'
            }]);
            done();
        });

        it ('should create an error if negative day, month or year entered', (done) => {
            const ctxIn = {
                'divorceDateKnown': 'optionYes',
                'divorce-day': '-4',
                'divorce-month': '10',
                'divorce-year': '2022'
            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = DivorceDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'divorceDate',
                'href': '#divorceDate',
                'msg': 'Date of divorce or dissolution must be a real date'
            }]);
            done();
        });

        it ('should create an error when an invalid date has been entered', (done) => {
            const ctxIn = {
                'divorceDateKnown': 'optionYes',
                'divorce-day': 'a',
                'divorce-month': 'b',
                'divorce-year': 'c'
            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = DivorceDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'divorceDate',
                'href': '#divorceDate',
                'msg': 'Date of divorce or dissolution must be a real date'
            }]);
            done();
        });

        it ('should add the date with day, month and year as a formatted string to the context', (done) => {
            const ctxIn = {
                'divorceDateKnown': 'optionYes',
                'divorceDate-day': '4',
                'divorceDate-month': '08',
                'divorceDate-year': '2025',
                'divorce-day': '4',
                'divorce-month': '08',
                'divorce-year': '2025'
            };
            const [ctx] = DivorceDate.handlePost(ctxIn);
            const ctxOut = {
                'divorceDateKnown': 'optionYes',
                'divorceDate': '4/08/2025',
                'divorceDate-day': '4',
                'divorceDate-month': '08',
                'divorceDate-year': '2025',
                'divorce-day': '4',
                'divorce-month': '08',
                'divorce-year': '2025'
            };
            expect(ctx).to.deep.equal(ctxOut);
            done();
        });
    });

    describe('action()', () => {
        it('should clean up context', () => {
            const ctxIn = {
                'divorceDate-day': '4',
                'divorceDate-month': '10',
                'divorceDate-year': '2025'
            };
            const [ctx] = DivorceDate.action(ctxIn);
            expect(ctx).to.deep.equal({});
        });
    });
});
