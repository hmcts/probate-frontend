'use strict';

const journey = require('app/journeys/intestacy');
const initSteps = require('app/core/initSteps');
const content = require('../../../app/resources/en/translation/applicant/deceasedadoptedout.json');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const DeceasedAdoptedOut = steps.DeceasedAdoptedOut;

describe('DeceasedAdoptedOut', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedAdoptedOut.constructor.getUrl();
            expect(url).to.equal('/parent-adopted-deceased-out');
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
                        }
                    }
                }
            };

            ctx = DeceasedAdoptedOut.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('nextStepUrl()', () => {

        it('should return the correct url when the deceased is not adopted out', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                deceasedMaritalStatus: 'optionNotMarried',
                relationshipToDeceased: 'optionParent',
                deceasedAdoptedOut: 'optionNo',
            };
            const nextStepUrl = DeceasedAdoptedOut.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/any-other-parent-alive');
            done();
        });

        it('should return the correct url when the deceased is adopted out', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                deceasedMaritalStatus: 'optionNotMarried',
                relationshipToDeceased: 'optionParent',
                deceasedAdoptedOut: 'optionYes',
            };
            const nextStepUrl = DeceasedAdoptedOut.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/deceasedAdoptedOut');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = DeceasedAdoptedOut.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'parentApplyingAndDeceasedNotAdoptedOut', value: true, choice: 'parentApplyingAndDeceasedNotAdoptedOut'},
                    {key: 'siblingApplyingAndDeceasedNotAdoptedOut', value: true, choice: 'siblingApplyingAndDeceasedNotAdoptedOut'}
                ]
            });
            done();
        });
    });
    describe('handlePost()', () => {
        let ctx;
        let errors;
        let formdata;
        const session = {};
        it('should return the error when deceasedAdoptedOut is missing and relationship is parent', (done) => {
            ctx = {
                relationshipToDeceased: 'optionParent',
                isSaveAndClose: 'false',
                deceasedName: 'John Doe'
            };
            errors = [];
            [ctx, errors] = DeceasedAdoptedOut.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'deceasedAdoptedOut',
                    href: '#deceasedAdoptedOut',
                    msg: content.errors.deceasedAdoptedOut.requiredParent.replace('{deceasedName}', 'John Doe')
                }
            ]);
            done();
        });
        it('should return the error when deceasedAdoptedOut is missing and relationship is Sibling', (done) => {
            ctx = {
                relationshipToDeceased: 'optionSibling',
                isSaveAndClose: 'false',
                deceasedName: 'John Doe'
            };
            errors = [];
            [ctx, errors] = DeceasedAdoptedOut.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'deceasedAdoptedOut',
                    href: '#deceasedAdoptedOut',
                    msg: content.errors.deceasedAdoptedOut.requiredSibling.replace('{deceasedName}', 'John Doe')
                }
            ]);
            done();
        });
    });
});
