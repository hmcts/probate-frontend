'use strict';

const initSteps = require('app/core/initSteps');
const journeyProbate = require('../../../app/journeys/probate');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const DiedEnglandOrWales = steps.DiedEnglandOrWales;
const PreviousStep = steps.DeceasedAddress;
describe('DiedEnglandOrWales', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DiedEnglandOrWales.constructor.getUrl();
            expect(url).to.equal('/died-eng-or-wales');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct next step options', (done) => {
            const result = DiedEnglandOrWales.nextStepOptions();
            expect(result).to.deep.equal({
                options: [{
                    key: 'diedEngOrWales',
                    value: 'optionYes',
                    choice: 'hasDiedEngOrWales'
                }]
            });
            done();
        });
    });

    describe('getContextData()', () => {
        let ctx;
        let req;

        it('should return the context with the deceased name', (done) => {
            req = {
                session: {
                    form: {
                        deceased: {
                            firstName: 'John',
                            lastName: 'Doe',
                            'dod-date': '2022-01-01'
                        }
                    }
                }
            };

            ctx = DiedEnglandOrWales.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('action()', () => {
        it('test that deceased name is removed from context', () => {
            const formdata = {
                deceased: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            };
            let ctx = {
                deceasedName: 'Dee Ceased',
            };
            [ctx] = DiedEnglandOrWales.action(ctx, formdata);
            expect(ctx).to.deep.equal({});
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
                            'dob-day': '02',
                            'dob-month': '03',
                            'dob-year': '2002',
                            'dod-day': '02',
                            'dod-month': '03',
                            'dod-year': '2003',
                            address: {
                                addressLine1: '143 Caerfai Bay Road',
                                postTown: 'town',
                                newPostCode: 'L23 6WW',
                                country: 'United Kingdon',
                                postcode: 'L23 6WW'
                            }

                        }
                    }
                }
            };
            req.session.journey = journeyProbate;
            ctx = {};
            DiedEnglandOrWales.previousStepUrl(req, res, ctx);
            expect(ctx.previousUrl).to.equal(PreviousStep.constructor.getUrl());
            done();
        });
    });

});
