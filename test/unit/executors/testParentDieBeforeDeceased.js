'use strict';

const initSteps = require('app/core/initSteps');
const journey = require('app/journeys/intestacy');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const ParentDieBefore = steps.ParentDieBefore;
const ParentAdoptedIn = steps.CoApplicantParentAdoptedIn;
const ParentAdoptionPlace = steps.CoApplicantParentAdoptionPlace;
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

        [
            {
                label: 'whole-blood niece or nephew',
                relationship: 'optionWholeBloodNieceOrNephew',
                parentDieField: 'wholeNieceOrNephewParentDieBeforeDeceased',
                parentAdoptedInField: 'wholeNieceOrNephewParentAdoptedIn',
                parentAdoptionPlaceField: 'wholeNieceOrNephewParentAdoptionInEnglandOrWales'
            },
            {
                label: 'half-blood niece or nephew',
                relationship: 'optionHalfBloodNieceOrNephew',
                parentDieField: 'halfNieceOrNephewParentDieBeforeDeceased',
                parentAdoptedInField: 'halfNieceOrNephewParentAdoptedIn',
                parentAdoptionPlaceField: 'halfNieceOrNephewParentAdoptionInEnglandOrWales'
            }
        ].forEach(({label, relationship, parentDieField, parentAdoptedInField, parentAdoptionPlaceField}) => {
            it(`routes eligible ${label} journey to co-applicant-name and disqualifying answer to stop page`, () => {
                const req = {
                    session: {
                        journey: journey
                    }
                };
                const formdata = {
                    executors: {
                        list: [
                            {firstName: 'John', lastName: 'Doe', isApplicant: true, isApplying: true},
                            {fullName: 'Case CoApplicant', coApplicantRelationshipToDeceased: relationship, isApplying: true}
                        ]
                    }
                };

                let ctx = {
                    caseType: 'intestacy',
                    index: 1,
                    list: formdata.executors.list,
                    applicantParentDieBeforeDeceased: 'optionYes'
                };

                [ctx] = ParentDieBefore.handlePost(ctx, [], formdata, {});
                expect(ctx.list[1][parentDieField]).to.equal('optionYes');
                expect(ParentDieBefore.nextStepUrl(req, ctx)).to.equal('/intestacy/parent-adopted-in/1');

                ctx.applicantParentAdoptedIn = 'optionYes';
                [ctx] = ParentAdoptedIn.handlePost(ctx, [], formdata);
                expect(ctx.list[1][parentAdoptedInField]).to.equal('optionYes');
                expect(ParentAdoptedIn.nextStepUrl(req, ctx)).to.equal('/intestacy/parent-adoption-place/1');

                ctx.applicantParentAdoptionPlace = 'optionYes';
                [ctx] = ParentAdoptionPlace.handlePost(ctx, [], formdata);
                expect(ctx.list[1][parentAdoptionPlaceField]).to.equal('optionYes');
                expect(ParentAdoptionPlace.nextStepUrl(req, ctx)).to.equal('/intestacy/coapplicant-name/1');

                ctx.applicantParentDieBeforeDeceased = 'optionNo';
                [ctx] = ParentDieBefore.handlePost(ctx, [], formdata, {});
                expect(ctx.list[1][parentDieField]).to.equal('optionNo');
                expect(ParentDieBefore.nextStepUrl(req, ctx)).to.equal('/intestacy/stop-page/otherCoApplicantRelationship');
            });
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

        it('should set halfBloodSiblingDiedBeforeDeceased field in the list if ctx has applicantParentDieBeforeDeceased', (done) => {
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

        it('should set wholeBloodSiblingDiedBeforeDeceased field in the list if ctx has applicantParentDieBeforeDeceased', (done) => {
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
});
