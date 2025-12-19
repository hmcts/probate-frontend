const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const CodicilsDamageDate = steps.CodicilsDamageDate;

describe('CodicilsDamageDate', () => {

    const ctxWithYes = {
        codicilsDamageDateKnown: 'optionYes',
        codicilsDamageDate: '4/10/2021'
    };

    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = CodicilsDamageDate.constructor.getUrl();
            expect(url).to.equal('/codicils-damage-date');
            done();
        });
    });

    describe('handleGet()', () => {
        it('should split codicilsDamageDate to separate fields, and add to the context', (done) => {
            const [ctx] = CodicilsDamageDate.handleGet(ctxWithYes);
            expect(ctx).to.deep.equal({
                'codicilsDamageDateKnown': 'optionYes',
                'codicilsDamageDate': '4/10/2021',
                'codicilsdamagedate-day': '4',
                'codicilsdamagedate-month': '10',
                'codicilsdamagedate-year': '2021'
            });
            done();
        });

        it('should handle just a year', (done) => {
            const ctxIn = {
                codicilsDamageDateKnown: 'optionYes',
                codicilsDamageDate: '2021'
            };
            const [ctx] = CodicilsDamageDate.handleGet(ctxIn);
            expect(ctx).to.deep.equal({
                'codicilsDamageDateKnown': 'optionYes',
                'codicilsDamageDate': '2021',
                'codicilsdamagedate-day': '',
                'codicilsdamagedate-month': '',
                'codicilsdamagedate-year': '2021'
            });
            done();
        });

        it('should handle a year and a month', (done) => {
            const ctxIn = {
                codicilsDamageDateKnown: 'optionYes',
                codicilsDamageDate: '04/2021'

            };
            const [ctx] = CodicilsDamageDate.handleGet(ctxIn);
            expect(ctx).to.deep.equal({
                'codicilsDamageDateKnown': 'optionYes',
                'codicilsDamageDate': '04/2021',
                'codicilsdamagedate-day': '',
                'codicilsdamagedate-month': '04',
                'codicilsdamagedate-year': '2021'
            });
            done();
        });

        it('should return the context unchanged when codicilsDamageDate is empty', (done) => {
            const ctxIn = {
                codicilsDamageDateKnown: 'optionNo',
                codicilsDamageDate: ''
            };
            const [ctx] = CodicilsDamageDate.handleGet(ctxIn);
            expect(ctx).to.deep.equal(ctxIn);
            done();
        });
    });

    describe('handlePost()', () => {
        it ('should reset codicils damage date when date is not known', (done) => {
            const ctxIn = {
                'codicilsDamageDateKnown': 'optionNo',
                'codicilsDamageDate': '4/10/2021',
                'codicilsdamagedate-day': '4',
                'codicilsdamagedate-month': '10',
                'codicilsdamagedate-year': '2021'
            };
            const [ctx] = CodicilsDamageDate.handlePost(ctxIn);
            const ctxOut = {
                'codicilsDamageDateKnown': 'optionNo',
                'codicilsDamageDate': ''
            };
            expect(ctx).to.deep.equal(ctxOut);
            done();
        });

        it ('should create an error when no year has been entered', (done) => {
            const ctxIn = {
                'codicilsDamageDateKnown': 'optionYes'
            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = CodicilsDamageDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'codicilsdamagedate-year',
                'href': '#codicilsdamagedate-year',
                'msg': 'Date the codicils were damaged or marked must include the year'
            }]);
            done();
        });

        it ('should create an error when day and year but no month', (done) => {
            const ctxIn = {
                'codicilsDamageDateKnown': 'optionYes',
                'codicilsdamagedate-day': '4',
                'codicilsdamagedate-year': '2018'
            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = CodicilsDamageDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'codicilsdamagedate-month',
                'href': '#codicilsdamagedate-month',
                'msg': 'Please enter the month if you know the day it was damaged'
            }]);
            done();
        });

        it ('should create an error when a future date has been entered', (done) => {
            const ctxIn = {
                'codicilsDamageDateKnown': 'optionYes',
                'codicilsdamagedate-day': '4',
                'codicilsdamagedate-month': '10',
                'codicilsdamagedate-year': '3000'
            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = CodicilsDamageDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'codicilsdamagedate',
                'href': '#codicilsdamagedate',
                'msg': 'Date the codicils were damaged or marked must be today or in the past'
            }]);
            done();
        });

        it ('should create an error if negative day, month or year entered', (done) => {
            const ctxIn = {
                'codicilsDamageDateKnown': 'optionYes',
                'codicilsdamagedate-day': '-4',
                'codicilsdamagedate-month': '10',
                'codicilsdamagedate-year': '2019'
            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = CodicilsDamageDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'codicilsdamagedate',
                'href': '#codicilsdamagedate',
                'msg': 'Date the codicils were damaged or marked must be a real date'
            }]);
            done();
        });

        it ('should create an error when an invalid date has been entered', (done) => {
            const ctxIn = {
                'codicilsDamageDateKnown': 'optionYes',
                'codicilsdamagedate-day': 'a',
                'codicilsdamagedate-month': 'b',
                'codicilsdamagedate-year': 'c'
            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = CodicilsDamageDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'codicilsdamagedate',
                'href': '#codicilsdamagedate',
                'msg': 'Date the codicils were damaged or marked must be a real date'
            }]);
            done();
        });

        it ('should add the date with month and year as a formatted string to the context', (done) => {
            const ctxIn = {
                'codicilsDamageDateKnown': 'optionYes',
                'codicilsdamagedate-month': '10',
                'codicilsdamagedate-year': '2021'
            };
            const [ctx] = CodicilsDamageDate.handlePost(ctxIn);
            const ctxOut = {
                'codicilsDamageDateKnown': 'optionYes',
                'codicilsdamagedate-month': '10',
                'codicilsdamagedate-year': '2021',
                'codicilsDamageDate': '10/2021',
            };
            expect(ctx).to.deep.equal(ctxOut);
            done();
        });

        it ('should add the date with day, month and year as a formatted string to the context', (done) => {
            const ctxIn = {
                'codicilsDamageDateKnown': 'optionYes',
                'codicilsdamagedate-day': '4',
                'codicilsdamagedate-month': '10',
                'codicilsdamagedate-year': '2021'
            };
            const [ctx] = CodicilsDamageDate.handlePost(ctxIn);
            const ctxOut = {
                'codicilsDamageDateKnown': 'optionYes',
                'codicilsdamagedate-day': '4',
                'codicilsdamagedate-month': '10',
                'codicilsdamagedate-year': '2021',
                'codicilsDamageDate': '4/10/2021',
            };
            expect(ctx).to.deep.equal(ctxOut);
            done();
        });
    });

    it ('should add the date as a formatted string to the context, only year entered', (done) => {
        const ctxIn = {
            'codicilsDamageDateKnown': 'optionYes',
            'codicilsdamagedate-year': '2021'
        };
        const [ctx] = CodicilsDamageDate.handlePost(ctxIn);
        const ctxOut = {
            'codicilsDamageDateKnown': 'optionYes',
            'codicilsdamagedate-year': '2021',
            'codicilsDamageDate': '2021',
        };
        expect(ctx).to.deep.equal(ctxOut);
        done();
    });

    describe('action()', () => {
        it('should clean up context', () => {
            const ctxIn = {
                'codicilsdamagedate-day': '4',
                'codicilsdamagedate-month': '10',
                'codicilsdamagedate-year': '2021'
            };
            const [ctx] = CodicilsDamageDate.action(ctxIn);
            expect(ctx).to.deep.equal({});
        });
    });
});
