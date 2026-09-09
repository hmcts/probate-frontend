'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const IntestacyCoApplicantDisagreePage = steps.IntestacyCoApplicantDisagreePage;

describe('Intestacy  Coapplicant-Disagree', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = IntestacyCoApplicantDisagreePage.constructor.getUrl();
            expect(url).to.equal('/intestacy-co-applicant-disagree-page');
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

            const ctx = IntestacyCoApplicantDisagreePage.getContextData(req);
            expect(ctx.leadExecFullName).to.equal('John Doe');
            done();
        });
    });
});
