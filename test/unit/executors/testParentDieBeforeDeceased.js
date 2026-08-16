'use strict';

const initSteps = require('app/core/initSteps');
const journey = require('app/journeys/intestacy');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const ParentDieBefore = steps.ParentDieBefore;
const namePath = '/parent-die-before/';

describe('Co-applicant-parent-die-before', () => {
    describe('getUrl()', () => {
        it('returns the url with a * param when no index is given', (done) => {
            const url = ParentDieBefore.constructor.getUrl();

            expect(url).to.equal(namePath + '*');
            done();
        });

        it('returns the url with the index as a param when an index is given', (done) => {
            const param = 1;
            const url = ParentDieBefore.constructor.getUrl(param);

            expect(url).to.equal(namePath + param);
            done();
        });
    });

    describe('CoApplicantParentDieBefore handleGet', () => {
        let ctx;

        beforeEach(() => {
            ctx = {
                list: [
                    {fullName: 'Applicant'},
                    {fullName: 'CoApplicant 1', coApplicantRelationshipToDeceased: 'optionHalfBloodNieceOrNephew', halfNieceOrNephewParentDieBeforeDeceased: 'optionYes'},
                    {coApplicantRelationshipToDeceased: 'optionGrandchild', childDieBeforeDeceased: 'optionYes'},
                    {coApplicantRelationshipToDeceased: 'optionGrandchild'}
                ],
                index: 0
            };
        });

        it('should set parent die before field to current ctx from list', () => {
            ctx.index = 2;
            [ctx] = ParentDieBefore.handleGet(ctx);
            expect(ctx.applicantParentDieBeforeDeceased).to.equal('optionYes');
        });

        it('should set parent die before field to current ctx from list if applicant is Niece or Nephew', () => {
            ctx.index = 1;
            [ctx] = ParentDieBefore.handleGet(ctx);
            expect(ctx.applicantParentDieBeforeDeceased).to.equal('optionYes');
        });

        it('should not set parent die before field when childDieBeforeDeceased is not present', () => {
            ctx.index = 3;
            [ctx] = ParentDieBefore.handleGet(ctx);
            // eslint-disable-next-line no-undefined
            expect(ctx.applicantParentDieBeforeDeceased).to.equal(undefined);
        });
    });
    describe('CoApplicantParentDieBefore nextStepUrl', () => {
        let ctx;
        let req;
        beforeEach(() => {
            ctx = {
                fullName: '',
                index: 2,
                list: [
                    {firstName: 'John', lastName: 'Doe'},
                    {coApplicantRelationshipToDeceased: 'optionGrandchild', childDieBeforeDeceased: 'optionYes'},
                    {coApplicantRelationshipToDeceased: 'optionHalfBloodNieceOrNephew'},
                ]
            };
            req = {
                session: {
                    journey: journey
                }
            };
        });

        it('should return the stop page if the applicantParentDieBeforeDeceased is optionNo', () => {
            ctx.index = 2;
            ctx.applicantParentDieBeforeDeceased = 'optionNo';
            const url = ParentDieBefore.nextStepUrl(req, ctx);
            expect(url).to.equal('/stop-page/otherCoApplicantRelationship');
        });

        it('should return parent adopted in for whole-blood niece or nephew when parent died before the deceased', () => {
            ctx.caseType = 'intestacy';
            ctx.index = 2;
            ctx.list[2].coApplicantRelationshipToDeceased = 'optionWholeBloodNieceOrNephew';
            ctx.applicantParentDieBeforeDeceased = 'optionYes';
            const url = ParentDieBefore.nextStepUrl(req, ctx);
            expect(url).to.equal('/intestacy/parent-adopted-in/2');
        });

        it('should return parent adopted in for half-blood niece or nephew when parent died before the deceased', () => {
            ctx.caseType = 'intestacy';
            ctx.index = 2;
            ctx.list[2].coApplicantRelationshipToDeceased = 'optionHalfBloodNieceOrNephew';
            ctx.applicantParentDieBeforeDeceased = 'optionYes';
            const url = ParentDieBefore.nextStepUrl(req, ctx);
            expect(url).to.equal('/intestacy/parent-adopted-in/2');
        });

        it('should not route whole-blood niece or nephew from stale half-blood value when mapped value is missing', () => {
            ctx.caseType = 'intestacy';
            ctx.index = 2;
            ctx.list[2].coApplicantRelationshipToDeceased = 'optionWholeBloodNieceOrNephew';
            ctx.list[2].halfNieceOrNephewParentDieBeforeDeceased = 'optionYes';
            delete ctx.list[2].wholeNieceOrNephewParentDieBeforeDeceased;
            delete ctx.applicantParentDieBeforeDeceased;

            const url = ParentDieBefore.nextStepUrl(req, ctx);

            expect(url).to.equal('/intestacy/stop-page/otherCoApplicantRelationship');
        });
    });
    describe('CoApplicantParentDieBefore handlePost()', () => {
        let ctx;
        let errors;
        let formdata;
        const session = {};

        it('should set childDieBeforeDeceased field in the list if ctx has applicantParentDieBeforeDeceased', (done) => {
            ctx = {
                list: [
                    {firstName: 'John', lastName: 'Doe'},
                    {coApplicantRelationshipToDeceased: 'optionGrandchild'},
                ],
                index: 1,
                applicantParentDieBeforeDeceased: 'optionYes'
            };
            errors = [];
            [ctx, errors] = ParentDieBefore.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                list: [{firstName: 'John', lastName: 'Doe'},
                    {coApplicantRelationshipToDeceased: 'optionGrandchild', childDieBeforeDeceased: 'optionYes'}],
                index: 1,
                applicantParentDieBeforeDeceased: 'optionYes'
            });
            done();
        });

        it('should set halfNieceOrNephewParentDieBeforeDeceased field in the list if ctx has applicantParentDieBeforeDeceased', (done) => {
            ctx = {
                list: [
                    {firstName: 'John', lastName: 'Doe'},
                    {coApplicantRelationshipToDeceased: 'optionHalfBloodNieceOrNephew'},
                ],
                index: 1,
                applicantParentDieBeforeDeceased: 'optionYes'
            };
            errors = [];
            [ctx, errors] = ParentDieBefore.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                list: [{firstName: 'John', lastName: 'Doe'},
                    {coApplicantRelationshipToDeceased: 'optionHalfBloodNieceOrNephew', halfNieceOrNephewParentDieBeforeDeceased: 'optionYes'},],
                index: 1,
                applicantParentDieBeforeDeceased: 'optionYes'
            });
            done();
        });

        it('should set wholeNieceOrNephewParentDieBeforeDeceased field in the list if ctx has applicantParentDieBeforeDeceased', (done) => {
            ctx = {
                list: [
                    {firstName: 'John', lastName: 'Doe'},
                    {coApplicantRelationshipToDeceased: 'optionWholeBloodNieceOrNephew'},
                ],
                index: 1,
                applicantParentDieBeforeDeceased: 'optionYes'
            };
            errors = [];
            [ctx, errors] = ParentDieBefore.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                list: [{firstName: 'John', lastName: 'Doe'},
                    {coApplicantRelationshipToDeceased: 'optionWholeBloodNieceOrNephew', wholeNieceOrNephewParentDieBeforeDeceased: 'optionYes'},],
                index: 1,
                applicantParentDieBeforeDeceased: 'optionYes'
            });
            done();
        });

        it('should clear niece-nephew parent adoption answers when parent did not die before deceased', () => {
            ctx = {
                list: [
                    {firstName: 'John', lastName: 'Doe'},
                    {
                        coApplicantRelationshipToDeceased: 'optionWholeBloodNieceOrNephew',
                        wholeNieceOrNephewParentAdoptedIn: 'optionYes',
                        wholeNieceOrNephewParentAdoptionInEnglandOrWales: 'optionNo',
                        wholeNieceOrNephewParentAdoptedOut: 'optionYes'
                    },
                ],
                index: 1,
                applicantParentDieBeforeDeceased: 'optionNo'
            };
            errors = [];

            [ctx, errors] = ParentDieBefore.handlePost(ctx, errors, formdata, session);

            expect(ctx.list[1]).to.deep.equal({
                coApplicantRelationshipToDeceased: 'optionWholeBloodNieceOrNephew',
                wholeNieceOrNephewParentDieBeforeDeceased: 'optionNo'
            });
        });
    });

    describe('getContextData()', () => {
        it('sets the index when there is a numeric url param', (done) => {
            const req = {
                session: {
                    form: {
                        deceased: {
                            firstName: 'John',
                            lastName: 'Doe'
                        },
                        executors: {
                            list: [
                                {
                                    'firstName': 'Dave',
                                    'lastName': 'Bassett',
                                    'isApplying': true,
                                    'isApplicant': true
                                }
                            ]
                        }
                    }
                },
                params: [1]
            };
            const ctx = ParentDieBefore.getContextData(req);

            expect(ctx.index).to.equal(1);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });

        it('recalculates index when there is a * url param', (done) => {
            const req = {
                session: {
                    form: {
                        deceased: {
                            firstName: 'John',
                            lastName: 'Doe'
                        },
                        executors: {
                            list: [
                                {fullName: 'Prince', isApplying: true, isApplicant: false},
                                {fullName: 'Cher', isApplying: true}
                            ]
                        }
                    },
                },
                params: ['*']
            };
            const ctx = ParentDieBefore.getContextData(req);

            expect(ctx.index).to.equal(1);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('CoApplicantParentDieBefore isComplete()', () => {
        it('should only use whole-blood field for whole-blood niece or nephew', () => {
            const ctx = {
                index: 1,
                list: [
                    {firstName: 'John', lastName: 'Doe'},
                    {
                        coApplicantRelationshipToDeceased: 'optionWholeBloodNieceOrNephew',
                        halfNieceOrNephewParentDieBeforeDeceased: 'optionYes',
                        wholeNieceOrNephewParentDieBeforeDeceased: 'optionNo'
                    }
                ]
            };

            expect(ParentDieBefore.isComplete(ctx)).to.deep.equal([false, 'inProgress']);
        });

        it('should only use half-blood field for half-blood niece or nephew', () => {
            const ctx = {
                index: 1,
                list: [
                    {firstName: 'John', lastName: 'Doe'},
                    {
                        coApplicantRelationshipToDeceased: 'optionHalfBloodNieceOrNephew',
                        wholeNieceOrNephewParentDieBeforeDeceased: 'optionYes',
                        halfNieceOrNephewParentDieBeforeDeceased: 'optionNo'
                    }
                ]
            };

            expect(ParentDieBefore.isComplete(ctx)).to.deep.equal([false, 'inProgress']);
        });
    });
});
