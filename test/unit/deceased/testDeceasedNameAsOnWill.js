'use strict';

const initSteps = require('app/core/initSteps');
const journeyProbate = require('../../../app/journeys/probate');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const DeceasedNameAsOnWill = steps.DeceasedNameAsOnWill;
const PreviousStep = steps.DeceasedName;

describe('DeceasedNameAsOnWill', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedNameAsOnWill.constructor.getUrl();
            expect(url).to.equal('/deceased-name-as-on-will');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct next step options', (done) => {
            const result = DeceasedNameAsOnWill.nextStepOptions();
            expect(result).to.deep.equal({
                options: [{
                    key: 'nameAsOnTheWill',
                    value: 'optionNo',
                    choice: 'hasAlias'
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
                            'dod-date': '2022-01-01',
                        }
                    }
                }
            };

            ctx = DeceasedNameAsOnWill.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
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
                            nameAsOnTheWill: 'Yes',
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
            DeceasedNameAsOnWill.previousStepUrl(req, res, ctx);
            expect(ctx.previousUrl).to.equal(PreviousStep.constructor.getUrl());
            done();
        });
    });

});
