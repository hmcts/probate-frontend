'use strict';

const journey = require('../../../app/journeys/intestacy');
const initSteps = require('../../../app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const ParentAdoptedIn = steps.CoApplicantParentAdoptedIn;
const content = require('app/resources/en/translation/executors/parentadoptedin');
const stepUrl='/parent-adopted-in/1';
const optionYesUrl='/intestacy/parent-adoption-place/1';
const optionNoUrl='/intestacy/parent-adopted-out/1';

describe('ParentAdoptedIn', () => {
    describe('ParentAdoptedIn.getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ParentAdoptedIn.constructor.getUrl('1');
            expect(url).to.equal(stepUrl);
            done();
        });
    });

    describe('ParentAdoptedIn.getContextData()', () => {
        let ctx;
        let req;

        it('should return the context with the deceased name', (done) => {
            req = {
                session: {
                    form: {
                        deceased: {
                            firstName: 'John',
                            lastName: 'Doe'
                        },
                        executors: {
                            list: [
                                {fullName: 'Main Applicant1'},
                                {fullName: 'Main Applicant2'}
                            ]
                        },
                    }
                },
                params: [0]
            };

            ctx = ParentAdoptedIn.getContextData(req);
            expect(ctx.index).to.equal(req.params[0]);
            expect(ctx.deceasedName).to.equal('John Doe');
            expect(ctx.applicantName).to.equal('Main Applicant1');
            done();
        });
        it('should sets the index to current index when all details of co-applicant are not entered and return the context with the deceased name', (done) => {
            req = {
                session: {
                    form: {
                        deceased: {
                            firstName: 'John',
                            lastName: 'Doe'
                        },
                        executors: {
                            list: [
                                {fullName: 'Main Applicant1'},
                                {fullName: 'Main Applicant2'}
                            ]
                        },
                    }
                }
            };

            ctx = ParentAdoptedIn.getContextData(req);
            expect(ctx.index).to.equal(1);
            expect(ctx.deceasedName).to.equal('John Doe');
            expect(ctx.applicantName).to.equal('Main Applicant2');
            done();
        });
        it('should sets the index to next index when all details of co-applicant are entered', (done) => {
            req = {
                session: {
                    form: {
                        deceased: {
                            firstName: 'John',
                            lastName: 'Doe'
                        },
                        executors: {
                            list: [
                                {fullName: 'Main Applicant1'},
                                {fullName: 'Cher', isApplying: true, coapplicantRelationshipToDeceased: 'optionGrandchild', email: 'abc@gmail.com', address: {formattedAddress: 'addressLine1',}},
                                {fullName: 'Main Applicant2'}
                            ]
                        },
                    }
                },
                params: ['*']
            };

            ctx = ParentAdoptedIn.getContextData(req);
            expect(ctx.index).to.equal(2);
            expect(ctx.deceasedName).to.equal('John Doe');
            expect(ctx.applicantName).to.equal('Main Applicant2');
            done();
        });
    });

    describe('ParentAdoptedIn.nextStepUrl()', () => {

        it('should return the correct url when the co-applicant is ParentAdopted In', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                caseType: 'intestacy',
                index: '1',
                applicantParentAdoptedIn: 'optionYes',
                list: [{}, {
                    coApplicantRelationshipToDeceased: 'optionGrandchild',
                    grandchildParentAdoptedIn: 'optionYes',
                }],
            };
            const nextStepUrl = ParentAdoptedIn.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal(optionYesUrl);
            done();
        });

        it('should return the correct url when the co-applicant Parent is not adopted In', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                caseType: 'intestacy',
                index: '1',
                list: [{}, {
                    grandchildParentAdoptedIn: 'optionNo',
                }],
            };
            const nextStepUrl = ParentAdoptedIn.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal(optionNoUrl);
            done();
        });

        it('should return the correct url when a whole-blood niece or nephew parent is adopted in', () => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                caseType: 'intestacy',
                index: '1',
                applicantParentAdoptedIn: 'optionYes',
                list: [{}, {
                    coApplicantRelationshipToDeceased: 'optionWholeBloodNieceOrNephew',
                    wholeBloodNieceOrNephewAdoptedIn: 'optionYes',
                }],
            };
            const nextStepUrl = ParentAdoptedIn.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/intestacy/parent-adoption-place/1');
        });

        it('should return the correct url when a whole-blood niece or nephew parent is not adopted in', () => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                caseType: 'intestacy',
                index: '1',
                applicantParentAdoptedIn: 'optionNo',
                list: [{}, {
                    coApplicantRelationshipToDeceased: 'optionWholeBloodNieceOrNephew',
                    wholeBloodNieceOrNephewAdoptedIn: 'optionNo',
                }],
            };
            const nextStepUrl = ParentAdoptedIn.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/intestacy/parent-adopted-out/1');
        });
    });

    describe('ParentAdoptedIn.handlePost', () => {
        it('should set grandchildParentAdoptedIn when relationship is grandchild', () => {
            const ctx = {
                index: '1',
                applicantParentAdoptedIn: 'optionYes',
                list: [
                    {},
                    {coApplicantRelationshipToDeceased: 'optionGrandchild'},
                    {coApplicantRelationshipToDeceased: 'optionGrandchild'}
                ]
            };
            const errors = [];
            const formdata = {
                executors: {
                    list: [
                        {},
                        {},
                        {}
                    ]
                }
            };
            ParentAdoptedIn.handlePost(ctx, errors, formdata);
            expect(ctx.list[1]).to.deep.equal({'coApplicantRelationshipToDeceased': 'optionGrandchild', 'grandchildParentAdoptedIn': 'optionYes'});
        });

        it('should map whole-blood niece or nephew parent adoption to supported field', () => {
            const ctx = {
                index: '1',
                applicantParentAdoptedIn: 'optionYes',
                list: [
                    {},
                    {coApplicantRelationshipToDeceased: 'optionWholeBloodNieceOrNephew'}
                ]
            };
            const errors = [];
            const formdata = {
                executors: {
                    list: [
                        {},
                        {}
                    ]
                }
            };
            ParentAdoptedIn.handlePost(ctx, errors, formdata);
            expect(ctx.list[1]).to.deep.equal({
                coApplicantRelationshipToDeceased: 'optionWholeBloodNieceOrNephew',
                wholeBloodNieceOrNephewAdoptedIn: 'optionYes'
            });
        });

        it('should not persist unsupported wholeBloodNieceOrNephewParentAdoptedIn key', () => {
            const ctx = {
                index: '1',
                applicantParentAdoptedIn: 'optionYes',
                list: [
                    {},
                    {coApplicantRelationshipToDeceased: 'optionWholeBloodNieceOrNephew'}
                ]
            };
            const errors = [];
            const formdata = {executors: {list: [{}, {}]}};
            ParentAdoptedIn.handlePost(ctx, errors, formdata);
            // eslint-disable-next-line no-undefined
            expect(ctx.list[1].wholeBloodNieceOrNephewParentAdoptedIn).to.equal(undefined);
        });
    });

    describe('ParentAdoptedIn.handleGet', () => {
        it('should load saved supported parent field for whole-blood niece or nephew', () => {
            const ctx = {
                index: 1,
                list: [
                    {},
                    {
                        coApplicantRelationshipToDeceased: 'optionWholeBloodNieceOrNephew',
                        wholeBloodNieceOrNephewAdoptedIn: 'optionYes'
                    }
                ]
            };

            const [updatedCtx] = ParentAdoptedIn.handleGet(ctx);
            expect(updatedCtx.applicantParentAdoptedIn).to.equal('optionYes');
        });
    });
    describe('ParentAdoptedIn generateFields()', () => {
        it('should return the correct content fields', (done) => {
            const ctx = {
                language: 'en',
                deceasedName: 'John Doe',
                applicantName: 'Jane Doe'
            };
            const errors = [
                {
                    field: 'applicantParentAdoptedIn',
                    href: '#applicantParentAdoptedIn',
                    msg: content.errors.applicantParentAdoptedIn.required
                }
            ];

            const fields = ParentAdoptedIn.generateFields('en', ctx, errors);
            expect(fields).to.deep.equal({
                language: {
                    error: false,
                    value: 'en'
                },
                applicantParentAdoptedIn: {
                    error: true,
                    href: '#applicantParentAdoptedIn',
                    errorMessage: content.errors.applicantParentAdoptedIn.required
                },
                deceasedName: {
                    error: false,
                    value: 'John Doe'
                },
                applicantName: {
                    error: false,
                    value: 'Jane Doe'
                }
            });
            done();
        });
    });
});
