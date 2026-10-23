'use strict';

const journey = require('../../../app/journeys/intestacy');
const initSteps = require('../../../app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const CoApplicantAdoptedDeceasedIn = steps.CoApplicantAdoptedDeceasedIn;
const content = require('app/resources/en/translation/executors/coapplicantadopteddeceasedin');
const stepUrl='/coapplicant-adopted-deceased-in/1';
const optionYesUrl='/coapplicant-adoption-deceased-place/1';
const optionNoUrl='/coapplicant-adopted-deceased-out/1';

describe('CoApplicantAdoptedDeceasedIn', () => {
    describe('CoApplicantAdoptedDeceasedIn.getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = CoApplicantAdoptedDeceasedIn.constructor.getUrl('1');
            expect(url).to.equal(stepUrl);
            done();
        });
    });

    describe('CoApplicantAdoptedDeceasedIn.getContextData()', () => {
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

            ctx = CoApplicantAdoptedDeceasedIn.getContextData(req);
            expect(ctx.index).to.equal(req.params[0]);
            expect(ctx.deceasedName).to.equal('John Doe');
            expect(ctx.applicantName).to.equal('coApplicant1');
            done();
        });
        });
    });

describe('nextStepUrl()', () => {

    it('should return the correct url when the co-applicant is adopted deceased in', (done) => {
        const req = {
            session: {
                journey: journey
            }
        };
        const ctx = {
            index: '1',
            coApplicantRelationshipToDeceased: 'optionParent',
            coApplicantAdoptedDeceasedIn: 'optionYes',
        };
        const nextStepUrl = CoApplicantAdoptedDeceasedIn.nextStepUrl(req, ctx);
        expect(nextStepUrl).to.equal(optionYesUrl);
        done();
    });

    it('should return the correct url when the co-applicant is not adopted deceased in', (done) => {
        const req = {
            session: {
                journey: journey
            }
        };
        const ctx = {
            index: '1',
            coApplicantRelationshipToDeceased: 'optionParent',
            coApplicantAdoptedDeceasedIn: 'optionNo',
        };
        const nextStepUrl = CoApplicantAdoptedDeceasedIn.nextStepUrl(req, ctx);
        expect(nextStepUrl).to.equal(optionNoUrl);
        done();
    });
});

describe('generateFields()', () => {
    it('should return the correct content fields', (done) => {
        const ctx = {
            language: 'en',
            deceasedName: 'John Doe',
            applicantName: 'coApplicant1',
        };
        const errors = [
            {
                field: 'coApplicantAdoptedDeceasedIn',
                href: '#coApplicantAdoptedDeceasedIn',
                msg: content.errors.coApplicantAdoptedDeceasedIn.required
            }
        ];

        const fields = CoApplicantAdoptedDeceasedIn.generateFields('en', ctx, errors);
        expect(fields).to.deep.equal({
            language: {
                error: false,
                value: 'en'
            },
            coApplicantAdoptedDeceasedIn: {
                error: true,
                href: '#coApplicantAdoptedDeceasedIn',
                errorMessage: content.errors.coApplicantAdoptedDeceasedIn.required
            },
            deceasedName: {
                error: false,
                value: 'John Doe'
            },
            applicantName: {
                error: false,
                value: 'coApplicant1'
            }
        });
        done();
    });
});

