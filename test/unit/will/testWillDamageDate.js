const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const WillDamageDate = steps.WillDamageDate;

describe('WillDamageDate', () => {

    const ctxWithYes = {
        willDamageDateKnown: 'optionYes',
        willDamageDate: '4/10/2021'
    };

    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = WillDamageDate.constructor.getUrl();
            expect(url).to.equal('/will-damage-date');
            done();
        });
    });

    describe('handleGet()', () => {
        it('should split willDamageDate to separate fields, and add to the context', (done) => {
            const [ctx] = WillDamageDate.handleGet(ctxWithYes);
            expect(ctx).to.deep.equal({
                'willDamageDateKnown': 'optionYes',
                'willDamageDate': '4/10/2021',
                'willdamagedate-day': '4',
                'willdamagedate-month': '10',
                'willdamagedate-year': '2021'
            });
            done();
        });

        it('should handle just a year', (done) => {
            const ctxIn = {
                willDamageDateKnown: 'optionYes',
                willDamageDate: '2021'
            };
            const [ctx] = WillDamageDate.handleGet(ctxIn);
            expect(ctx).to.deep.equal({
                'willDamageDateKnown': 'optionYes',
                'willDamageDate': '2021',
                'willdamagedate-day': '',
                'willdamagedate-month': '',
                'willdamagedate-year': '2021'
            });
            done();
        });

        it('should handle a year and a month', (done) => {
            const ctxIn = {
                willDamageDateKnown: 'optionYes',
                willDamageDate: '04/2021'
            };
            const [ctx] = WillDamageDate.handleGet(ctxIn);
            expect(ctx).to.deep.equal({
                'willDamageDateKnown': 'optionYes',
                'willDamageDate': '04/2021',
                'willdamagedate-day': '',
                'willdamagedate-month': '04',
                'willdamagedate-year': '2021'
            });
            done();
        });

        it('should return the context unchanged when willDamageDate is empty', (done) => {
            const ctxIn = {
                willDamageDateKnown: 'optionNo',
                willDamageDate: ''
            };
            const [ctx] = WillDamageDate.handleGet(ctxIn);
            expect(ctx).to.deep.equal(ctxIn);
            done();
        });
    });

    describe('handlePost()', () => {
        it ('should reset will damage date when date is not known', (done) => {
            const ctxIn = {
                'willDamageDateKnown': 'optionNo',
                'willDamageDate': '4/10/2021',
                'willdamagedate-day': '4',
                'willdamagedate-month': '10',
                'willdamagedate-year': '2021'
            };
            const [ctx] = WillDamageDate.handlePost(ctxIn);
            const ctxOut = {
                'willDamageDateKnown': 'optionNo',
                'willDamageDate': ''
            };
            expect(ctx).to.deep.equal(ctxOut);
            done();
        });

        it ('should create an error when no year has been entered', (done) => {
            const ctxIn = {
                'willDamageDateKnown': 'optionYes'
            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = WillDamageDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'willdamagedate-year',
                'href': '#willdamagedate-year',
                'msg': 'Enter the year when visible damages or marks appeared on the will'
            }]);
            done();
        });

        it ('should create an error when day and year but no month', (done) => {
            const ctxIn = {
                'willDamageDateKnown': 'optionYes',
                'willdamagedate-day': '4',
                'willdamagedate-year': '2018'
            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = WillDamageDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'willdamagedate-month',
                'href': '#willdamagedate-month',
                'msg': 'Please enter the month if you know the day it was damaged'
            }]);
            done();
        });

        it ('should create an error when a future date has been entered', (done) => {
            const ctxIn = {
                'willDamageDateKnown': 'optionYes',
                'willdamagedate-day': '4',
                'willdamagedate-month': '10',
                'willdamagedate-year': '3000'
            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = WillDamageDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'willdamagedate',
                'href': '#willdamagedate',
                'msg': 'The date of when damages or marks appeared on the will must be in the past or today'
            }]);
            done();
        });

        it ('should create an error if negative day, month or year entered', (done) => {
            const ctxIn = {
                'willDamageDateKnown': 'optionYes',
                'willdamagedate-day': '-4',
                'willdamagedate-month': '10',
                'willdamagedate-year': '2019'
            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = WillDamageDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'willdamagedate',
                'href': '#willdamagedate',
                'msg': 'Please enter a valid date'
            }]);
            done();
        });

        it ('should create an error when an invalid date has been entered', (done) => {
            const ctxIn = {
                'willDamageDateKnown': 'optionYes',
                'willdamagedate-day': 'a',
                'willdamagedate-month': 'b',
                'willdamagedate-year': 'c'
            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = WillDamageDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'willdamagedate',
                'href': '#willdamagedate',
                'msg': 'Please enter a valid date'
            }]);
            done();
        });

        it ('should add the date with month and year as a formatted string to the context', (done) => {
            const ctxIn = {
                'willDamageDateKnown': 'optionYes',
                'willdamagedate-month': '10',
                'willdamagedate-year': '2021'
            };
            const [ctx] = WillDamageDate.handlePost(ctxIn);
            const ctxOut = {
                'willDamageDateKnown': 'optionYes',
                'willdamagedate-month': '10',
                'willdamagedate-year': '2021',
                'willDamageDate': '10/2021',
            };
            expect(ctx).to.deep.equal(ctxOut);
            done();
        });

        it ('should add the date with day, month and year as a formatted string to the context', (done) => {
            const ctxIn = {
                'willDamageDateKnown': 'optionYes',
                'willdamagedate-day': '4',
                'willdamagedate-month': '10',
                'willdamagedate-year': '2021'
            };
            const [ctx] = WillDamageDate.handlePost(ctxIn);
            const ctxOut = {
                'willDamageDateKnown': 'optionYes',
                'willdamagedate-day': '4',
                'willdamagedate-month': '10',
                'willdamagedate-year': '2021',
                'willDamageDate': '4/10/2021',
            };
            expect(ctx).to.deep.equal(ctxOut);
            done();
        });
    });

    it ('should add the date as a formatted string to the context, only year entered', (done) => {
        const ctxIn = {
            'willDamageDateKnown': 'optionYes',
            'willdamagedate-year': '2021'
        };
        const [ctx] = WillDamageDate.handlePost(ctxIn);
        const ctxOut = {
            'willDamageDateKnown': 'optionYes',
            'willdamagedate-year': '2021',
            'willDamageDate': '2021',
        };
        expect(ctx).to.deep.equal(ctxOut);
        done();
    });

    describe('action()', () => {
        it('should clean up context', () => {
            const ctxIn = {
                'willdamagedate-day': '4',
                'willdamagedate-month': '10',
                'willdamagedate-year': '2021'
            };
            const [ctx] = WillDamageDate.action(ctxIn);
            expect(ctx).to.deep.equal({});
        });
    });
});
