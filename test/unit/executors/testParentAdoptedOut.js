'use strict';

const journey = require('app/journeys/intestacy');
const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const ParentAdoptedOut = steps.ParentAdoptedOut;
const content = require('app/resources/en/translation/executors/adoptedout');
const stepUrl='/parent-adopted-out/1';
const optionNoUrl='/coapplicant-email/1';
const optionYesUrl='/stop-page/coApplicantParentAdoptedOutStop';

describe('ParentAdoptedOut', () => {
    describe('ParentAdoptedOut.getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ParentAdoptedOut.constructor.getUrl('1');
            expect(url).to.equal(stepUrl);
            done();
        });
    });

    describe('ParentAdoptedOut.getContextData()', () => {
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

            ctx = ParentAdoptedOut.getContextData(req);
            expect(ctx.index).to.equal(req.params[0]);
            expect(ctx.deceasedName).to.equal('John Doe');
            expect(ctx.applicantName).to.equal('Main Applicant1');
            done();
        });
    });

    describe('ParentAdoptedOut nextStepUrl()', () => {

        it('should return the correct url when the co-applicant parent is adopted out', (done) => {
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
                applicantParentAdoptedOut: 'optionYes',
            };
            const nextStepUrl = ParentAdoptedOut.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal(optionYesUrl);
            done();
        });

        it('should return the correct url when the co-applicant parent is not adopted out', (done) => {
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
                applicantParentAdoptedOut: 'optionNo',
            };
            const nextStepUrl = ParentAdoptedOut.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal(optionNoUrl);
            done();
        });
    });

    describe('ParentAdoptedOut.generateFields()', () => {
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

            const fields = ParentAdoptedOut.generateFields('en', ctx, errors);
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

    describe('ParentAdoptedOut handlePost', () => {
        it('should adoptedOut = optionNo if coApplicantRelationshipToDeceased is grandChild', () => {
            const ctx = {
                index: '1',
                applicantParentAdoptedOut: 'optionNo',
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
            ParentAdoptedOut.handlePost(ctx, errors, formdata);
            expect(formdata.executors.list[1]).to.deep.equal({'grandchildParentAdoptedOut': 'optionNo'});
        });
    });
});
