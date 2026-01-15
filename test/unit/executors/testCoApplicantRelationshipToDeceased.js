'use strict';
/* eslint-disable max-lines */
const initSteps = require('app/core/initSteps');
const journey = require('app/journeys/intestacy');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const CoApplicantRelationshipToDeceased = steps.CoApplicantRelationshipToDeceased;

describe('Co-applicant-relationship', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = CoApplicantRelationshipToDeceased.constructor.getUrl();
            expect(url).to.equal('/coapplicant-relationship-to-deceased/*');
            done();
        });
    });

    describe('CoApplicantRelationshipToDeceased handleGet', () => {
        let ctx;

        beforeEach(() => {
            ctx = {
                list: [{fullName: 'Applicant'}, {fullName: 'CoApplicant 1', coApplicantRelationshipToDeceased: 'optionChild'}, {fullName: 'CoApplicant 2'},],
                index: 0
            };
        });

        it('should set coApplicantRelationshipToDeceased to optionYes if index1 has coApplicantRelationshipToDeceased', () => {
            ctx.index = 1;
            [ctx] = CoApplicantRelationshipToDeceased.handleGet(ctx);
            expect(ctx.coApplicantRelationshipToDeceased).to.equal('optionChild');
        });

        it('should set coApplicantRelationshipToDeceased to undefined if no relationship  for index2', () => {
            ctx.index = 2;
            [ctx] = CoApplicantRelationshipToDeceased.handleGet(ctx);
            // eslint-disable-next-line no-undefined
            expect(ctx.coApplicantRelationshipToDeceased).to.equal(undefined);
        });
    });
    describe('CoApplicantRelationshipToDeceased nextStepUrl', () => {
        let ctx;
        let req;
        beforeEach(() => {
            ctx = {
                coApplicantRelationshipToDeceased: '',
                index: 0,
                list: [{fullName: 'Applicant'}, {fullName: 'CoApplicant 1'}, {fullName: 'CoApplicant 2'}, {fullName: 'CoApplicant 3'}]
            };
            req = {
                session: {
                    journey: journey
                }
            };
        });

        it('should return the correct URL if the relationship to deceased is child', () => {
            ctx.index = 1;
            ctx.coApplicantRelationshipToDeceased = 'optionChild';
            const url = CoApplicantRelationshipToDeceased.nextStepUrl(req, ctx);
            expect(url).to.equal('/coapplicant-name/1');
        });

        it('should return the correct URL if the relationship to deceased is Half-blood sibling', () => {
            ctx.index = 3;
            ctx.coApplicantRelationshipToDeceased = 'optionHalfBloodSibling';
            const url = CoApplicantRelationshipToDeceased.nextStepUrl(req, ctx);
            expect(url).to.equal('/coapplicant-name/3');
        });

        it('should return the correct URL if the relationship to deceased is Half-blood Niece or Nephew', () => {
            ctx.index = 3;
            ctx.coApplicantRelationshipToDeceased = 'optionHalfBloodNieceOrNephew';
            const url = CoApplicantRelationshipToDeceased.nextStepUrl(req, ctx);
            expect(url).to.equal('/parent-die-before/3');
        });

        it('should return the correct URL if the relationship to deceased is Whole-blood sibling', () => {
            ctx.index = 3;
            ctx.coApplicantRelationshipToDeceased = 'optionWholeBloodSibling';
            const url = CoApplicantRelationshipToDeceased.nextStepUrl(req, ctx);
            expect(url).to.equal('/coapplicant-name/3');
        });

        it('should return the correct URL if the relationship to deceased is Whole-blood Niece or Nephew', () => {
            ctx.index = 3;
            ctx.coApplicantRelationshipToDeceased = 'optionWholeBloodNieceOrNephew';
            const url = CoApplicantRelationshipToDeceased.nextStepUrl(req, ctx);
            expect(url).to.equal('/parent-die-before/3');
        });

        it('should return the correct URL if the relationship to deceased is Grandchild', () => {
            ctx.index = 2;
            ctx.coApplicantRelationshipToDeceased = 'optionGrandchild';
            const url = CoApplicantRelationshipToDeceased.nextStepUrl(req, ctx);
            expect(url).to.equal('/parent-die-before/2');
        });

        it('should return the stop page url if the relationship to deceased is Other', () => {
            ctx.coApplicantRelationshipToDeceased = 'optionOther';
            const url = CoApplicantRelationshipToDeceased.nextStepUrl(req, ctx);
            expect(url).to.equal('/stop-page/otherCoApplicantRelationship');
        });
    });
    describe('CoApplicantRelationship generateFields', () => {
        let ctx;
        let errors;
        let language;

        beforeEach(() => {
            ctx = {
                list: [{fullName: 'Applicant'}, {fullName: 'CoApplicant 1', coApplicantRelationshipToDeceased: 'optionChild'},
                    {fullName: 'CoApplicant 2', coApplicantRelationshipToDeceased: 'optionGrandchild'},
                ],
                deceasedName: 'John Doe',
            };
            errors = [{msg: 'Error message for {deceasedName}'}];
            language = 'en';
        });

        it('should replace {deceasedName} placeholder in error message with deceased name', () => {
            CoApplicantRelationshipToDeceased.generateFields(language, ctx, errors);
            expect(errors[0].msg).to.equal('Error message for John Doe');
        });

        it('should not modify error message if deceased name is not present in fields', () => {
            ctx.deceasedName = '';
            CoApplicantRelationshipToDeceased.generateFields(language, ctx, errors);
            expect(errors[0].msg).to.equal('Error message for ');
        });
    });
    describe('handlePost()', () => {
        let ctx;
        let errors;

        it('should update coApplicantRelationshipToDeceased and set isApplying to true for optionChild', (done) => {
            ctx = {
                list: [
                    {fullName: 'Applicant'},
                    {fullName: 'CoApplicant 1'},
                    {fullName: 'CoApplicant 2'}
                ],
                index: 1,
                coApplicantRelationshipToDeceased: 'optionChild'
            };
            errors = [];
            [ctx, errors] = CoApplicantRelationshipToDeceased.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                list: [{fullName: 'Applicant'},
                    {fullName: 'CoApplicant 1', coApplicantRelationshipToDeceased: 'optionChild', isApplying: true},
                    {fullName: 'CoApplicant 2'}],
                index: 1,
                coApplicantRelationshipToDeceased: 'optionChild'
            });
            done();
        });
        it('should update coApplicantRelationshipToDeceased and set isApplying to true for optionGrandchild', (done) => {
            ctx = {
                list: [
                    {fullName: 'Applicant'},
                    {fullName: 'CoApplicant 1'},
                    {fullName: 'CoApplicant 2'}
                ],
                index: 1,
                coApplicantRelationshipToDeceased: 'optionGrandchild'
            };
            errors = [];
            [ctx, errors] = CoApplicantRelationshipToDeceased.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                list: [{fullName: 'Applicant'}, {fullName: 'CoApplicant 1', coApplicantRelationshipToDeceased: 'optionGrandchild', isApplying: true},
                    {fullName: 'CoApplicant 2'}],
                index: 1,
                coApplicantRelationshipToDeceased: 'optionGrandchild'
            });
            done();
        });
        it('should update coApplicantRelationshipToDeceased and set isApplying to true for optionHalfBloodSibling', (done) => {
            ctx = {
                list: [{fullName: 'Applicant'}, {fullName: 'CoApplicant 1'}, {fullName: 'CoApplicant 2'}],
                index: 1,
                coApplicantRelationshipToDeceased: 'optionHalfBloodSibling'
            };
            errors = [];
            [ctx, errors] = CoApplicantRelationshipToDeceased.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                list: [{fullName: 'Applicant'},
                    {fullName: 'CoApplicant 1', coApplicantRelationshipToDeceased: 'optionHalfBloodSibling', isApplying: true},
                    {fullName: 'CoApplicant 2'}],
                index: 1,
                coApplicantRelationshipToDeceased: 'optionHalfBloodSibling'
            });
            done();
        });
        it('should not update isApplying or coApplicantRelationshipToDeceased for other values', (done) => {
            ctx = {
                list: [{fullName: 'Applicant'}, {fullName: 'CoApplicant 1'}, {fullName: 'CoApplicant 2'}
                ],
                index: 1,
                coApplicantRelationshipToDeceased: 'optionOther'
            };
            errors = [];
            [ctx, errors] = CoApplicantRelationshipToDeceased.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                list: [{fullName: 'Applicant'}, {fullName: 'CoApplicant 1'}, {fullName: 'CoApplicant 2'}],
                index: 1,
                coApplicantRelationshipToDeceased: 'optionOther'
            });
            done();
        });
    });
    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = CoApplicantRelationshipToDeceased.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'childOrSibling', value: true, choice: 'childOrSibling'},
                    {key: 'grandchildOrNieceNephew', value: true, choice: 'grandchildOrNieceNephew'},
                ]
            });
            done();
        });
    });

    describe('getContextData()', () => {
        it('sets the index to last index when all details of co-applicant are not entered and set child options only', (done) => {
            const req = {
                session: {
                    form: {
                        deceased: {
                            anyOtherChildren: 'optionYes', anyPredeceasedChildren: 'optionNo', firstName: 'John', lastName: 'Doe'
                        },
                        applicant: {
                            relationshipToDeceased: 'optionChild'
                        },
                        executors: {
                            list: [
                                {
                                    'firstName': 'Dave', 'lastName': 'Bassett', 'isApplying': true, 'isApplicant': true
                                }, {
                                    isApplying: true, coApplicantRelationshipToDeceased: 'optionChild', fullName: 'Ed Brown', childAdoptedIn: 'optionYes', childAdoptionInEnglandOrWales: 'optionYes',
                                }
                            ]
                        }
                    }
                }
            };
            const ctx = CoApplicantRelationshipToDeceased.getContextData(req);

            expect(ctx.index).to.equal(1);
            expect(ctx.childOnly).to.equal(true);
            expect(ctx.grandChildOnly).to.equal(false);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });

        it('sets the index to next index when all details of co-applicant are entered and set child and grandchild options', (done) => {
            const req = {
                session: {
                    form: {
                        deceased: {
                            anyOtherChildren: 'optionYes', anyPredeceasedChildren: 'optionYesSome', anySurvivingGrandchildren: 'optionYes', firstName: 'John', lastName: 'Doe'
                        },
                        applicant: {
                            relationshipToDeceased: 'optionChild'
                        },
                        executors: {
                            list: [
                                {
                                    'firstName': 'Dave', 'lastName': 'Bassett', 'isApplying': true, 'isApplicant': true
                                }, {
                                    isApplying: true, coApplicantRelationshipToDeceased: 'optionChild', fullName: 'Ed Brown', childAdoptedIn: 'optionYes', childAdoptionInEnglandOrWales: 'optionYes', email: 'abc@gmail.com', address: {addressLine1: 'Adam & Eve', addressLine2: '81 Petty France', formattedAddress: 'Adam & Eve 81 Petty France London SW1H 9EX', postTown: 'London', postCode: 'SW1H 9EX'}
                                }
                            ]
                        }
                    }
                }
            };
            const ctx = CoApplicantRelationshipToDeceased.getContextData(req);

            expect(ctx.index).to.equal(2);
            expect(ctx.childOnly).to.equal(true);
            expect(ctx.grandChildOnly).to.equal(true);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });

        it('sets the index to next index when all details of co-applicant are entered and set half-sibling and half-niece or Nephew options', (done) => {
            const req = {
                session: {
                    form: {
                        applicant: {
                            relationshipToDeceased: 'optionSibling', anyOtherHalfSiblings: 'optionYes', sameParents: 'optionOneParentsSame', anyPredeceasedHalfSiblings: 'optionYesSome', anySurvivingHalfNiecesAndHalfNephews: 'optionYes',
                        },
                        deceased: {
                            firstName: 'John', lastName: 'Doe'
                        },
                        executors: {
                            list: [
                                {
                                    'firstName': 'Dave', 'lastName': 'Bassett', 'isApplying': true, 'isApplicant': true
                                }, {
                                    isApplying: true, coApplicantRelationshipToDeceased: 'optionHalfBloodSibling', fullName: 'Ed Brown', childAdoptedIn: 'optionYes', childAdoptionInEnglandOrWales: 'optionYes', email: 'abc@gmail.com', address: {addressLine1: 'Adam & Eve', addressLine2: '81 Petty France', formattedAddress: 'Adam & Eve 81 Petty France London SW1H 9EX', postTown: 'London', postCode: 'SW1H 9EX'}
                                }
                            ]
                        }
                    }
                }
            };
            const ctx = CoApplicantRelationshipToDeceased.getContextData(req);

            expect(ctx.index).to.equal(2);
            expect(ctx.halfSiblingOnly).to.equal(true);
            expect(ctx.halfNieceOrNephewOnly).to.equal(true);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });

        it('recalculates index when there is a * url param and set grandchild options only', (done) => {
            const req = {
                session: {
                    form: {
                        deceased: {anyOtherChildren: 'optionYes', anyPredeceasedChildren: 'optionYesAll', anySurvivingGrandchildren: 'optionYes', firstName: 'John', lastName: 'Doe'
                        },
                        applicant: {relationshipToDeceased: 'optionGrandchild'},
                        executors: {
                            list: [
                                {fullName: 'Prince', isApplicant: true},
                            ]
                        }
                    },
                },
                params: ['*']
            };
            const ctx = CoApplicantRelationshipToDeceased.getContextData(req);

            expect(ctx.index).to.equal(1);
            expect(ctx.childOnly).to.equal(false);
            expect(ctx.grandChildOnly).to.equal(true);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });
});
