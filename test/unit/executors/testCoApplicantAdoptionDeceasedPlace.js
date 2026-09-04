'use strict';

const journey = require('../../../app/journeys/intestacy');
const initSteps = require('../../../app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const CoApplicantAdoptionDeceasedPlace = steps.CoApplicantAdoptionDeceasedPlace;
const content = require('app/resources/en/translation/executors/CoApplicantAdoptionDeceasedPlace');
const stepUrl='/coapplicant-adoption-deceased-place/1';
const optionYesUrl='/coapplicant-email/1';
const optionNoUrl='/stop-page/coApplicantAdoptionDeceasedPlaceStop';

describe('CoApplicantAdoptionDeceasedPlace', () => {
    describe('CoApplicantAdoptionDeceasedPlace.getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = CoApplicantAdoptionDeceasedPlace.constructor.getUrl('1');
            expect(url).to.equal(stepUrl);
            done();
        });
    });

    describe('CoApplicantAdoptionDeceasedPlace.getContextData()', () => {
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
                                {fullName: 'coApplicant1'}
                            ]
                        },
                    }
                },
                params: [0]
            };

            ctx = CoApplicantAdoptionDeceasedPlace.getContextData(req);
            expect(ctx.index).to.equal(req.params[0]);
            expect(ctx.deceasedName).to.equal('John Doe');
            expect(ctx.applicantName).to.equal('coApplicant1');
            done();
        });
        });

    describe('CoApplicantAdoptionDeceasedPlace.nextStepUrl()', () => {

        it('should return the correct url when the co-applicant adoption place is in', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                index: '1',
                list: [
                    {},
                    {
                        coApplicantRelationshipToDeceased: 'optionParent',
                        coApplicantAdoptionDeceasedInEnglandOrWales: 'optionYes',
                    },
                ],

            };
            const nextStepUrl = CoApplicantAdoptionDeceasedPlace.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal(optionYesUrl);
            done();
        });

        it('should return the correct url when the co-applicant adoption place is not in', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                index: '1',
                list: [
                    {},
                    {
                        coApplicantRelationshipToDeceased: 'optionParent',
                        coApplicantAdoptionDeceasedInEnglandOrWales: 'optionNo',
                    },
                ],

            };
            const nextStepUrl = CoApplicantAdoptionDeceasedPlace.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal(optionNoUrl);
            done();
        });

    });
});
