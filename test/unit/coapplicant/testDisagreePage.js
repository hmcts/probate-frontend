'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const CoApplicantDisagreePage = steps.CoApplicantDisagreePage;

describe('Coapplicant-Disagree', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = CoApplicantDisagreePage.constructor.getUrl();
            expect(url).to.equal('/co-applicant-disagree-page*');
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

            const ctx = CoApplicantDisagreePage.getContextData(req);
            expect(ctx.leadExecFullName).to.equal('John Doe');
            done();
        });
    });
});
