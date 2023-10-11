'use strict';

const initSteps = require('app/core/initSteps');
const journeyProbate = require('../../../app/journeys/probate');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const EnglishForeignDeathCert = steps.EnglishForeignDeathCert;
const PreviousStep = steps.DiedEnglandOrWales;

describe('EnglishForeignDeathCert', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = EnglishForeignDeathCert.constructor.getUrl();
            expect(url).to.equal('/english-foreign-death-cert');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct next step options', (done) => {
            const ctx = {
                isStopIHTOnline: true,
                checkData: false,
                iht: {
                    method: 'optionOnline'
                }
            };
            const result = EnglishForeignDeathCert.nextStepOptions(ctx);
            expect(result).to.deep.equal({
                options: [{
                    key: 'englishForeignDeathCert',
                    value: 'optionYes',
                    choice: 'foreignDeathCertIsInEnglish'
                }]
            });
            done();
        });

        it('should return the correct next step options for IHT Paper', (done) => {
            const ctx = {
                isStopIHTOnline: true,
                checkData: true,
                iht: {
                    method: 'optionPaper'
                }
            };
            const result = EnglishForeignDeathCert.nextStepOptions(ctx);
            expect(result).to.deep.equal({
                options: [{
                    key: 'englishForeignDeathCert',
                    value: 'optionYes',
                    choice: 'ihtPaper'
                }]
            });
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
                            address: {
                                addressLine1: '143 Caerfai Bay Road',
                                postTown: 'town',
                                newPostCode: 'L23 6WW',
                                country: 'United Kingdon',
                                postcode: 'L23 6WW'
                            },
                            diedEngOrWales: 'optionNo'
                        }
                    }
                }
            };
            req.session.journey = journeyProbate;
            ctx = {};
            EnglishForeignDeathCert.previousStepUrl(req, res, ctx);
            expect(ctx.previousUrl).to.equal(PreviousStep.constructor.getUrl());
            done();
        });
    });

});
