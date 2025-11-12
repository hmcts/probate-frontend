'use strict';

const journey = require('app/journeys/intestacy');
const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const CoApplicantAdoptedOut = steps.CoApplicantAdoptedOut;
const content = require('app/resources/en/translation/executors/adoptedout');
const stepUrl='/coapplicant-adopted-out/1';
const optionYesUrl='/stop-page/coApplicantAdoptedOutStop';
const optionNoChildUrl='/coapplicant-email/1';
const optionNoGrandChildUrl='/parent-adopted-in/2';

describe('CoApplicantAdoptedOut', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = CoApplicantAdoptedOut.constructor.getUrl('1');
            expect(url).to.equal(stepUrl);
            done();
        });
    });

    describe('CoApplicantAdoptedOut.getContextData()', () => {
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

            ctx = CoApplicantAdoptedOut.getContextData(req);
            expect(ctx.index).to.equal(req.params[0]);
            expect(ctx.deceasedName).to.equal('John Doe');
            expect(ctx.applicantName).to.equal('Main Applicant1');
            done();
        });
    });

    describe('CoApplicantAdoptedOut nextStepUrl()', () => {

        it('should return the correct url when the co-applicant is adopted out', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                index: '1',
                list: [
                    {coApplicantRelationshipToDeceased: 'optionChild'},
                    {coApplicantRelationshipToDeceased: 'optionGrandchild'}
                ],
                adoptedOut: 'optionYes',
            };
            const nextStepUrl = CoApplicantAdoptedOut.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal(optionYesUrl);
            done();
        });

        it('should return the correct url when the co-applicant Child is not adopted out', (done) => {
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
                adoptedOut: 'optionNo',
            };
            const nextStepUrl = CoApplicantAdoptedOut.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal(optionNoChildUrl);
            done();
        });

        it('should return the correct url when the co-applicant Grandchild is not adopted out', (done) => {
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
                adoptedOut: 'optionNo',
            };
            const nextStepUrl = CoApplicantAdoptedOut.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal(optionNoGrandChildUrl);
            done();
        });
    });

    describe('CoApplicantAdoptedOut generateFields()', () => {
        it('should return the correct content fields', (done) => {
            const ctx = {
                language: 'en',
                deceasedName: 'John Doe',
                applicantName: 'Main Applicant1'
            };
            const errors = [
                {
                    field: 'adoptedOut',
                    href: '#adoptedOut',
                    msg: content.errors.adoptedOut.required
                }
            ];

            const fields = CoApplicantAdoptedOut.generateFields('en', ctx, errors);
            expect(fields).to.deep.equal({
                language: {
                    error: false,
                    value: 'en'
                },
                adoptedOut: {
                    error: true,
                    href: '#adoptedOut',
                    errorMessage: content.errors.adoptedOut.required
                },
                deceasedName: {
                    error: false,
                    value: 'John Doe'
                },
                applicantName: {
                    error: false,
                    value: 'Main Applicant1'
                }
            });
            done();
        });
    });

    describe('CoApplicantAdoptedOut handlePost', () => {
        it('should adoptedOut = optionNo if coApplicantRelationshipToDeceased is Child', () => {
            const ctx = {
                index: '1',
                adoptedOut: 'optionNo',
                list: [
                    {},
                    {coApplicantRelationshipToDeceased: 'optionChild'},
                    {coApplicantRelationshipToDeceased: 'optionGrandchild'}
                ]
            };
            const errors = [];
            CoApplicantAdoptedOut.handlePost(ctx, errors);
            expect(ctx.list[1]).to.deep.equal({'childAdoptedOut': 'optionNo',
                coApplicantRelationshipToDeceased: 'optionChild'});
        });
        it('should adoptedOut = optionNo if coApplicantRelationshipToDeceased is grandchild', () => {
            const ctx = {
                index: '2',
                adoptedOut: 'optionNo',
                list: [
                    {},
                    {coApplicantRelationshipToDeceased: 'optionChild'},
                    {coApplicantRelationshipToDeceased: 'optionGrandchild'}
                ]
            };
            const errors = [];
            CoApplicantAdoptedOut.handlePost(ctx, errors);
            expect(ctx.list[2]).to.deep.equal({'grandchildAdoptedOut': 'optionNo',
                coApplicantRelationshipToDeceased: 'optionGrandchild'});
        });
    });
});
