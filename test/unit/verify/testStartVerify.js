'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const StartVerify = steps.StartVerify;

describe('StartVerify', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = StartVerify.constructor.getUrl();
            expect(url).to.equal('/start-verify');
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
                        },
                        deceased: {
                            firstName: 'John',
                            lastName: 'Doe'
                        }
                    }
                }
            };

            const ctx = StartVerify.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            expect(ctx.applicantName).to.equal('John Doe');
            done();
        });
    });

});
