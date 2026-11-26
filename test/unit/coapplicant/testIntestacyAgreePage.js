'use strict';

const initSteps = require('app/core/initSteps');
const {assert, expect} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const IntestacyCoApplicantAgreePage = steps.IntestacyCoApplicantAgreePage;

describe('Intestacy Coapplicant-Agree', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = IntestacyCoApplicantAgreePage.constructor.getUrl();
            expect(url).to.equal('/intestacy-co-applicant-agree-page');
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return the context with the deceased name', (done) => {
            const req = {
                session: {
                    form: {
                        applicant: {
                            firstName: 'John',
                            lastName: 'Doe'
                        }
                    }
                }
            };

            const ctx = IntestacyCoApplicantAgreePage.getContextData(req);
            expect(ctx.leadExecFullName).to.equal('John Doe');
            done();
        });
    });

    describe('action()', () => {
        it('test it cleans up context', () => {
            const ctx = {
                leadExecFullName: 'Executor Name'
            };
            const formdata = {};

            IntestacyCoApplicantAgreePage.action(ctx, formdata);
            assert.isUndefined(ctx.leadExecFullName);
        });
    });
});
