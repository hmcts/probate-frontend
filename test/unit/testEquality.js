'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const Equality = steps.Equality;
const co = require('co');

describe('Equality', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = Equality.constructor.getUrl();
            expect(url).to.equal('/equality-and-diversity');
            done();
        });
    });

    describe('runnerOptions', () => {
        it('redirect if journey is intestacy and a none of the other conditions apply', (done) => {
            const ctx = {};
            const session = {
                uuid: '6543210987654321',
                form: {
                    applicantEmail: 'applicant@email.com',
                    ccdCase: {
                        id: 1234567890123456
                    }
                },
                language: 'en'
            };
            const host = 'http://localhost:3000';

            co(function* () {
                const options = yield Equality.runnerOptions(ctx, session, host);

                expect(options).to.deep.equal({
                    redirect: true,
                    url: 'http://localhost:4000/service-endpoint?serviceId=PROBATE&actor=CITIZEN&pcqId=6543210987654321&ccdCaseId=1234567890123456&partyId=applicant@email.com&returnUrl=http://localhost:3000/task-list&language=en'
                });
                done();
            }).catch(err => {
                done(err);
            });
        });
    });

    describe('isComplete()', () => {
        it('should return the completion status correctly if question already asked', (done) => {
            const ctx = {};
            const formdata = {
                equality: {
                    equality: true
                }
            };
            const complete = Equality.isComplete(ctx, formdata);
            expect(complete).to.deep.equal([true, 'inProgress']);
            done();
        });

        it('should return the completion status correctly if question not asked but payment completed', (done) => {
            const ctx = {};
            const formdata = {
                payment: {
                    status: 'Success'
                }
            };
            const complete = Equality.isComplete(ctx, formdata);
            expect(complete).to.deep.equal([true, 'inProgress']);
            done();
        });
    });
});
