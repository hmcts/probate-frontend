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
                    {fullName: 'CoApplicant 1', coApplicantRelationshipToDeceased: 'optionGrandchild'},
                    {coApplicantRelationshipToDeceased: 'optionGrandchild', childDieBeforeDeceased: 'optionYes'},
                ],
                index: 0
            };
        });

        it('should set parent die before field to current ctx from list', () => {
            ctx.index = 2;
            [ctx] = ParentDieBefore.handleGet(ctx);
            expect(ctx.applicantParentDieBeforeDeceased).to.equal('optionYes');
        });

        it('should not set parent die before field when childDieBeforeDeceased is not present', () => {
            ctx.index = 1;
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
                index: 0,
                list: [
                    {firstName: 'John', lastName: 'Doe'},
                    {coApplicantRelationshipToDeceased: 'optionGrandchild', childDieBeforeDeceased: 'optionYes'},
                    {coApplicantRelationshipToDeceased: 'optionGrandchild'},
                ]
            };
            req = {
                session: {
                    journey: journey
                }
            };
        });

        it('should return the co applicant adopted in page if the applicantParentDieBeforeDeceased is optionYes', () => {
            ctx.index = 1;
            ctx.applicantParentDieBeforeDeceased = 'optionYes';
            const url = ParentDieBefore.nextStepUrl(req, ctx);
            expect(url).to.equal('/coapplicant-name/1');
        });

        it('should return the stop page if the applicantParentDieBeforeDeceased is optionNo', () => {
            ctx.index = 1;
            const url = ParentDieBefore.nextStepUrl(req, ctx);
            expect(url).to.equal('/stop-page/otherCoApplicantRelationship');
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
                    {coApplicantRelationshipToDeceased: 'optionGrandchild'},
                ],
                index: 1,
                applicantParentDieBeforeDeceased: 'optionYes'
            };
            errors = [];
            [ctx, errors] = ParentDieBefore.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                list: [{firstName: 'John', lastName: 'Doe'},
                    {coApplicantRelationshipToDeceased: 'optionGrandchild', childDieBeforeDeceased: 'optionYes'},
                    {coApplicantRelationshipToDeceased: 'optionGrandchild'},],
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
