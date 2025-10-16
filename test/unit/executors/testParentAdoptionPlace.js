'use strict';

const journey = require('app/journeys/intestacy');
const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const ParentAdoptionPlace = steps.ParentAdoptionPlace;
const stepUrl='/parent-adoption-place/1';
const optionYesUrl='/coapplicant-email/1';
const optionNoUrl='/stop-page/coApplicantAdoptionPlaceStop';

describe('ParentAdoptionPlace', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ParentAdoptionPlace.constructor.getUrl('1');
            expect(url).to.equal(stepUrl);
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

            ctx = ParentAdoptionPlace.getContextData(req);
            expect(ctx.index).to.equal(req.params[0]);
            expect(ctx.deceasedName).to.equal('John Doe');
            expect(ctx.applicantName).to.equal('Main Applicant1');
            done();
        });
    });

    describe('nextStepUrl()', () => {

        it('should return the correct url when the co-applicant child is AdoptionPlace', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                index: '1',
                list: [
                    {},
                    {coApplicantRelationshipToDeceased: 'optionChild'},
                    {coApplicantRelationshipToDeceased: 'optionGrandchild'}
                ],
                applicantParentAdoptionPlace: 'optionYes',
            };
            const nextStepUrl = ParentAdoptionPlace.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal(optionYesUrl);
            done();
        });

        it('should return the correct url when the co-applicant grandchild is AdoptionPlace', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                index: '2',
                list: [
                    {},
                    {coApplicantRelationshipToDeceased: 'optionChild'},
                    {coApplicantRelationshipToDeceased: 'optionGrandchild'}
                ],
                applicantParentAdoptionPlace: 'optionNo',
            };
            const nextStepUrl = ParentAdoptionPlace.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal(optionNoUrl);
            done();
        });

        it('should return the correct url when the co-applicant Grandchild is not AdoptionPlace', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                index: '2',
                list: [
                    {},
                    {coApplicantRelationshipToDeceased: 'optionChild'},
                    {coApplicantRelationshipToDeceased: 'optionGrandchild'}
                ],
                adoptionPlace: 'optionNo',
            };
            const nextStepUrl = ParentAdoptionPlace.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal(optionNoUrl);
            done();
        });
    });

    describe('ParentAdoptionPlace handlePost', () => {
        it('should childAdoptionInEnglandOrWales = optionYes if coApplicantRelationshipToDeceased is Child', () => {
            const ctx = {
                index: '1',
                applicantParentAdoptionPlace: 'optionYes',
                list: [
                    {},
                    {coApplicantRelationshipToDeceased: 'optionChild'},
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
            ParentAdoptionPlace.handlePost(ctx, errors, formdata);
            expect(formdata.executors.list[1]).to.deep.equal({'childAdoptionInEnglandOrWales': 'optionYes'});
        });
    });
});
