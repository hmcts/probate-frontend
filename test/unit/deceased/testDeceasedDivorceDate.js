const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const DivorceDate = steps.DivorceDate;
const content = require('app/resources/en/translation/deceased/divorcedate');

describe('DivorceDate', () => {

    const ctxWithYes = {
        divorceDateKnown: 'optionYes',
        divorceDate: '2025-10-04'
    };

    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DivorceDate.constructor.getUrl();
            expect(url).to.equal('/deceased-divorce-or-separation-date');
            done();
        });
    });

    describe('handleGet()', () => {
        it('should split divorceDate to separate fields, and add to the context', (done) => {
            const [ctx] = DivorceDate.handleGet(ctxWithYes);
            expect(ctx).to.deep.equal({
                'divorceDateKnown': 'optionYes',
                'divorceDate': '2025-10-04',
                'divorceDate-day': '04',
                'divorceDate-month': '10',
                'divorceDate-year': '2025'
            });
            done();
        });
    });

    describe('handlePost()', () => {
        it ('should reset divorce date when date is not known', (done) => {
            const ctxIn = {
                'divorceDateKnown': 'optionNo',
                'divorceDate': '2025-10-04'
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
                'divorceDateKnown': 'optionYes',
                'legalProcess': 'divorce or dissolution',
            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = DivorceDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'divorceDate',
                'href': '#divorceDate',
                'msg': content.errors.divorceDate.required
            }]);
            done();
        });

        it ('should create an error when no year has been entered', (done) => {
            const ctxIn = {
                'divorceDateKnown': 'optionYes',
                'divorceDate-day': '4',
                'divorceDate-month': '10',

            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = DivorceDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'divorceDate-year',
                'href': '#divorceDate-year',
                'msg': content.errors['divorceDate-year'].required
            }]);
            done();
        });

        it ('should create an error when no month has been entered', (done) => {
            const ctxIn = {
                'divorceDateKnown': 'optionYes',
                'divorceDate-day': '4',
                'divorceDate-year': '2025',

            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = DivorceDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'divorceDate-month',
                'href': '#divorceDate-month',
                'msg': content.errors['divorceDate-month'].required
            }]);
            done();
        });

        it ('should create an error when no day has been entered', (done) => {
            const ctxIn = {
                'divorceDateKnown': 'optionYes',
                'divorceDate-month': '10',
                'divorceDate-year': '2025',

            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = DivorceDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'divorceDate-day',
                'href': '#divorceDate-day',
                'msg': content.errors['divorceDate-day'].required
            }]);
            done();
        });

        it ('should create an error when day but no year and no month', (done) => {
            const ctxIn = {
                'divorceDateKnown': 'optionYes',
                'divorceDate-day': '4',
            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = DivorceDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'divorceDate-month-year',
                'href': '#divorceDate-month-year',
                'msg': content.errors['divorceDate-month-year'].required
            }]);
            done();
        });

        it ('should create an error when month but no day and no year', (done) => {
            const ctxIn = {
                'divorceDateKnown': 'optionYes',
                'divorceDate-month': '10',
            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = DivorceDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'divorceDate-day-year',
                'href': '#divorceDate-day-year',
                'msg': content.errors['divorceDate-day-year'].required
            }]);
            done();
        });

        it ('should create an error when year but no day and no month', (done) => {
            const ctxIn = {
                'divorceDateKnown': 'optionYes',
                'divorceDate-year': '2025',
            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = DivorceDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'divorceDate-day-month',
                'href': '#divorceDate-day-month',
                'msg': content.errors['divorceDate-day-month'].required
            }]);
            done();
        });

        it ('should create an error when a future date has been entered', (done) => {
            const ctxIn = {
                'divorceDateKnown': 'optionYes',
                'divorceDate-day': '4',
                'divorceDate-month': '10',
                'divorceDate-year': '3000'
            };
            const errorsIn = [];
            const formdata = {};
            const session = {
            };
            const [, errors] = DivorceDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'divorceDate',
                'href': '#divorceDate',
                'msg': content.errors.divorceDate.future
            }]);
            done();
        });

        it ('should create an error if negative day, month or year entered', (done) => {
            const ctxIn = {
                'divorceDateKnown': 'optionYes',
                'divorceDate-day': '-4',
                'divorceDate-month': '10',
                'divorceDate-year': '2022'
            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = DivorceDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'divorceDate',
                'href': '#divorceDate',
                'msg': content.errors.divorceDate.invalid
            }]);
            done();
        });

        it ('should create an error when an invalid date has been entered', (done) => {
            const ctxIn = {
                'divorceDateKnown': 'optionYes',
                'divorceDate-day': 'a',
                'divorceDate-month': 'b',
                'divorceDate-year': 'c'
            };
            const errorsIn = [];
            const formdata = {};
            const session = {};
            const [, errors] = DivorceDate.handlePost(ctxIn, errorsIn, formdata, session);
            expect(errors).to.deep.equal([{
                'field': 'divorceDate',
                'href': '#divorceDate',
                'msg': content.errors.divorceDate.invalid
            }]);
            done();
        });

        it ('should add the date with day, month and year as a formatted string to the context', (done) => {
            const ctxIn = {
                'divorceDateKnown': 'optionYes',
                'divorceDate-day': '04',
                'divorceDate-month': '08',
                'divorceDate-year': '2025'
            };
            const [ctx] = DivorceDate.handlePost(ctxIn);
            const ctxOut = {
                'divorceDateKnown': 'optionYes',
                'divorceDate-day': '04',
                'divorceDate-month': '08',
                'divorceDate-year': '2025',
                'divorceDate': '2025-08-04'
            };
            expect(ctx).to.deep.equal(ctxOut);
            done();
        });
    });

    describe('getContextData()', () => {
        let ctx;
        let req;

        it('should return the context with the deceased name and legal process as divorced', (done) => {
            req = {
                session: {
                    language: 'en',
                    form: {
                        deceased: {
                            firstName: 'John',
                            lastName: 'Doe',
                            'dob-date': '1918-01-01',
                            'dod-date': '2020-03-02',
                            'maritalStatus': 'optionDivorced'
                        }
                    }
                }
            };

            ctx = DivorceDate.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            expect(ctx.legalProcess).to.equal('divorce or dissolution');
            done();
        });

        it('should return the context with the deceased name and legal process as separated', (done) => {
            req = {
                session: {
                    language: 'en',
                    form: {
                        deceased: {
                            firstName: 'John',
                            lastName: 'Doe',
                            'dob-date': '1918-01-01',
                            'dod-date': '2020-03-02',
                            'maritalStatus': 'optionSeparated'
                        }
                    }
                }
            };

            ctx = DivorceDate.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            expect(ctx.legalProcess).to.equal('legal separation');
            done();
        });
    });

    describe('action()', () => {
        it('should clean up context', () => {
            const ctxIn = {
                'divorceDate-day': '4',
                'divorceDate-month': '10',
                'divorceDate-year': '2025',
                legalProcess: 'divorce or dissolution'
            };
            const [ctx] = DivorceDate.action(ctxIn);
            expect(ctx).to.deep.equal({});
        });
    });
});
