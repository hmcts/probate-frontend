'use strict';

const initSteps = require('app/core/initSteps');
const chai = require('chai');
const expect = chai.expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);

describe('CoApplicantDisagreePage.js', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const coApplicantDisagreePage = steps.CoApplicantDisagreePage;
            const url = coApplicantDisagreePage.constructor.getUrl();
            expect(url).to.equal('/co-applicant-disagree-page');
            done();
        });
    });

    describe('getContextData()', () => {
        it('should set the ctx correctly when Yes is given', (done) => {
            const req = {
                sessionId: 'A',
                session: {
                    form: {
                        applicant: {
                            firstName: 'Joe',
                            lastName: 'Bloggs'
                        }
                    }
                }
            };
            const coApplicantDisagreePage = steps.CoApplicantDisagreePage;
            const ctx = coApplicantDisagreePage.getContextData(req);
            expect(ctx.leadExecFullName).to.deep.equal('Joe Bloggs');
            done();
        });
    });
});
