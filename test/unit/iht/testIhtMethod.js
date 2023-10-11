'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const sinon = require('sinon');
const journeyProbate = require('../../../app/journeys/probate');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const IhtMethod = steps.IhtMethod;
const PreviousStep = steps.DeathCertificateInterim;
const PreviousStepEnglishForeignDeathCert = steps.EnglishForeignDeathCert;
describe('IhtMethod', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = IhtMethod.constructor.getUrl();
            expect(url).to.equal('/iht-method');
            done();
        });
    });

    describe('generateContent()', () => {
        const formdata = {
            iht: {
                method: 'optionOnline'
            },
            deceased: {
                anyChildren: 'optionYes',
                allChildrenOver18: 'optionYes',
                anyDeceasedChildren: 'optionYes',
                anyGrandchildrenUnder18: 'optionNo'
            }
        };
        const ctx = {};
        it('should not show content about closed HMRC service after end of March', (done) => {
            const expectedContent = 'Say how it will be sent if you haven&rsquo;t sent it yet.';
            const date = new Date(2023, 4, 16, 0, 0);
            const clock = sinon.useFakeTimers({now: date});

            const content = IhtMethod.generateContent(ctx, formdata);
            expect(content.hint).to.equal(expectedContent);
            done();
            clock.restore();
        });

        it('should show content about closed HMRC service before end of March', (done) => {
            const expectedContent = 'HMRC has closed the online';
            const date = new Date(2023, 2, 16, 0, 0);
            const clock = sinon.useFakeTimers({now: date});

            const content = IhtMethod.generateContent(ctx, formdata);
            expect(content.hint).to.include(expectedContent);
            done();
            clock.restore();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct next step options', (done) => {
            const result = IhtMethod.nextStepOptions();
            expect(result).to.deep.equal({
                options: [{
                    key: 'method',
                    value: 'optionOnline',
                    choice: 'online'
                }]
            });
            done();
        });
    });

    describe('action()', () => {
        it('test it cleans up context and formdata if Paper Option chosen', () => {
            let formdata = {
                iht: {
                    method: 'optionOnline'
                },
                deceased: {
                    anyChildren: 'optionYes',
                    allChildrenOver18: 'optionYes',
                    anyDeceasedChildren: 'optionYes',
                    anyGrandchildrenUnder18: 'optionNo'
                }
            };
            let ctx = {
                method: 'optionPaper',
                identifier: '1234567890',
                grossValueField: '500000',
                netValueField: '400000',

                assetsOutside: 'optionYes',
                netValueAssetsOutsideField: '150000',
                netValueAssetsOutside: 150000
            };
            [ctx, formdata] = IhtMethod.action(ctx, formdata);
            expect(ctx).to.deep.equal({
                method: 'optionPaper'
            });
            expect(formdata).to.deep.equal({
                iht: {
                    method: 'optionOnline'
                },
                deceased: {}
            });
        });

        it('test it cleans up context and formdata if Online Option chosen', () => {
            let formdata = {
                iht: {
                    method: 'optionPaper'
                },
                deceased: {
                    anyChildren: 'optionYes',
                    allChildrenOver18: 'optionYes',
                    anyDeceasedChildren: 'optionYes',
                    anyGrandchildrenUnder18: 'optionNo'
                }
            };
            let ctx = {
                method: 'optionOnline',
                form: 'optionIHT205',
                ihtFormId: 'optionIHT205',
                grossValueIHT205: '500000',
                netValueIHT205: '400000',

                assetsOutside: 'optionYes',
                netValueAssetsOutsideField: '150000',
                netValueAssetsOutside: 150000
            };
            [ctx, formdata] = IhtMethod.action(ctx, formdata);
            expect(ctx).to.deep.equal({
                method: 'optionOnline'
            });
            expect(formdata).to.deep.equal({
                iht: {
                    method: 'optionPaper'
                },
                deceased: {}
            });
        });
    });

    describe('previousStepUrl()', () => {
        let ctx;
        it('should return the previous step deathCertificate url', (done) => {
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
                            diedEngOrWales: 'optionYes',
                            deathCertificate: 'optionYes'
                        }
                    }
                }
            };
            req.session.journey = journeyProbate;
            ctx = {};
            IhtMethod.previousStepUrl(req, res, ctx);
            expect(ctx.previousUrl).to.equal(PreviousStep.constructor.getUrl());
            done();
        });

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
                            diedEngOrWales: 'optionNo',
                            englishForeignDeathCert: 'optionYes'
                        }
                    }
                }
            };
            req.session.journey = journeyProbate;
            ctx = {};
            IhtMethod.previousStepUrl(req, res, ctx);
            expect(ctx.previousUrl).to.equal(PreviousStepEnglishForeignDeathCert.constructor.getUrl());
            done();
        });
    });
});
