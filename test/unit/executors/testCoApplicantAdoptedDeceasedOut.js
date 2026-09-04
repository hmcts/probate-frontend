'use strict';

const journey = require('../../../app/journeys/intestacy');
const initSteps = require('../../../app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const CoApplicantAdoptedDeceasedOut = steps.CoApplicantAdoptedDeceasedOut;
const content = require('app/resources/en/translation/executors/coapplicantadoptedDeceasedOut');
const stepUrl='/coapplicant-adopted-deceased-out/1';
const optionYesUrl='/stop-page/coApplicantAdoptedDeceasedOutStop';
const optionNoUrl='/coapplicant-email/1';

describe('CoApplicantAdoptedDeceasedOut', () => {
    describe('CoApplicantAdoptedDeceasedOut.getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = CoApplicantAdoptedDeceasedOut.constructor.getUrl('1');
            expect(url).to.equal(stepUrl);
            done();
        });
    });

    describe('CoApplicantAdoptedDeceasedOut.getContextData()', () => {
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

            ctx = CoApplicantAdoptedDeceasedOut.getContextData(req);
            expect(ctx.index).to.equal(req.params[0]);
            expect(ctx.deceasedName).to.equal('John Doe');
            expect(ctx.applicantName).to.equal('coApplicant1');
            done();
        });
        });
    });

describe('nextStepUrl()', () => {

    it('should return the correct url when the co-applicant is adopted deceased out', (done) => {
        const req = {
            session: {
                journey: journey
            }
        };
        const ctx = {
            index: '1',
            coApplicantRelationshipToDeceased: 'optionParent',
            coApplicantAdoptedDeceasedOut: 'optionYes',
        };
        const nextStepUrl = CoApplicantAdoptedDeceasedOut.nextStepUrl(req, ctx);
        expect(nextStepUrl).to.equal(optionYesUrl);
        done();
    });

    it('should return the correct url when the co-applicant is not adopted deceased out', (done) => {
        const req = {
            session: {
                journey: journey
            }
        };
        const ctx = {
            index: '1',
            coApplicantRelationshipToDeceased: 'optionParent',
            coApplicantAdoptedDeceasedOut: 'optionNo',
        };
        const nextStepUrl = CoApplicantAdoptedDeceasedOut.nextStepUrl(req, ctx);
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
                field: 'coApplicantAdoptedDeceasedOut',
                href: '#coApplicantAdoptedDeceasedOut',
                msg: content.errors.coApplicantAdoptedDeceasedOut.required
            }
        ];

        const fields = CoApplicantAdoptedDeceasedOut.generateFields('en', ctx, errors);
        expect(fields).to.deep.equal({
            language: {
                error: false,
                value: 'en'
            },
            coApplicantAdoptedDeceasedOut: {
                error: true,
                href: '#coApplicantAdoptedDeceasedOut',
                errorMessage: content.errors.coApplicantAdoptedDeceasedOut.required
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

