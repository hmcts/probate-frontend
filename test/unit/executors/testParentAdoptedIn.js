'use strict';

const journey = require('../../../app/journeys/intestacy');
const initSteps = require('../../../app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const ParentAdoptedIn = steps.ParentAdoptedIn;
const content = require('app/resources/en/translation/executors/parentadoptedin');
const stepUrl='/parent-adopted-in/1';
const optionYesUrl='/parent-adoption-place/1';
const optionNoUrl='/parent-adopted-out/1';

describe('ParentAdoptedIn', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ParentAdoptedIn.constructor.getUrl('1');
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

            ctx = ParentAdoptedIn.getContextData(req);
            expect(ctx.index).to.equal(req.params[0]);
            expect(ctx.deceasedName).to.equal('John Doe');
            expect(ctx.applicantName).to.equal('Main Applicant1');
            done();
        });
    });

    describe('nextStepUrl()', () => {

        it('should return the correct url when the co-applicant is adopted in', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                index: '1',
                applicantParentAdoptedIn: 'optionYes',
            };
            const nextStepUrl = ParentAdoptedIn.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal(optionYesUrl);
            done();
        });

        it('should return the correct url when the co-applicant is not adopted In', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                index: '1',
                applicantParentAdoptedIn: 'optionNo',
            };
            const nextStepUrl = ParentAdoptedIn.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal(optionNoUrl);
            done();
        });
    });

    describe('handlePost', () => {
        it('should childAdoptedIn = optionYes if coApplicantRelationshipToDeceased is Child', () => {
            const ctx = {
                index: '1',
                applicantParentAdoptedIn: 'optionYes',
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
            ParentAdoptedIn.handlePost(ctx, errors, formdata);
            expect(formdata.executors.list[1]).to.deep.equal({'childAdoptedIn': 'optionYes'});
        });
    });
    describe('ParentAdoptedIn generateFields()', () => {
        it('should return the correct content fields', (done) => {
            const ctx = {
                language: 'en',
                deceasedName: 'John Doe',
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
                }
            });
            done();
        });
    });
});
