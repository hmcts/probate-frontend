'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const Equality = steps.Equality;
const co = require('co');
const config = require('config');

describe('Equality', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = Equality.constructor.getUrl();
            expect(url).to.equal('/equality-and-diversity');
            done();
        });
    });

    describe('runnerOptions', () => {
        describe('token toggle enabled', () => {
            it('redirect if journey is intestacy and a none of the other conditions apply', (done) => {
                const ctx = {};
                const session = {
                    uuid: '6543210987654321',
                    form: {
                        applicantEmail: 'applicant@email.com',
                        ccdCase: {
                            id: 1234567890123456
                        },
                        equality: {
                            pcqId: '78e69022-2468-4370-a88e-bea2a80fa51f'
                        }
                    },
                    language: 'en',
                    featureToggles: {'ft_pcq_token': true}
                };
                const host = 'http://localhost:3000';

                co(function* () {
                    const options = yield Equality.runnerOptions(ctx, session, host);
                    const token = '83da26708b74d70ccf0439e8246e10f63f7c5eb9f200e0e7eea688175c14d1b7db4c20ca24f0e24f77' +
                        'ae964430793d780416ceddd75ff7415c0eb6267c5f7dd133882e57031852b20046d35354a7aaf6c2057ec36d53fd' +
                        'eded8286a1cfec0fd79694168adfd2bdc278f22a4416281d3116976fa8d5db83ee1d7ccdbe1774144f04c16ba24b' +
                        'ff21da23d56efbb065acba3f8186e9f91ab3db193f35aea36ff03a96ec3f3925faf1134f9402f7703e90303b3d8a' +
                        '52c9135ac23a20e15badbc4dd48fad798ada8d7ad588e28d727ed7868d0f3c8d1167d522';

                    expect(options).to.deep.equal({
                        redirect: true,
                        url: `${config.services.equalityAndDiversity.url}/service-endpoint?serviceId=PROBATE&actor=APPLICANT&pcqId=78e69022-2468-4370-a88e-bea2a80fa51f&ccdCaseId=1234567890123456&partyId=applicant@email.com&returnUrl=http://localhost:3000/task-list&language=en&token=${token}`
                    });
                    done();
                }).catch(err => {
                    done(err);
                });
            });
        });

        describe('token toggle disabled', () => {
            it('redirect if journey is intestacy and a none of the other conditions apply', (done) => {
                const ctx = {};
                const session = {
                    uuid: '6543210987654321',
                    form: {
                        applicantEmail: 'applicant@email.com',
                        ccdCase: {
                            id: 1234567890123456
                        },
                        equality: {
                            pcqId: '78e69022-2468-4370-a88e-bea2a80fa51f'
                        }
                    },
                    language: 'en'
                };
                const host = 'http://localhost:3000';

                co(function* () {
                    const options = yield Equality.runnerOptions(ctx, session, host);

                    expect(options).to.deep.equal({
                        redirect: true,
                        url: `${config.services.equalityAndDiversity.url}/service-endpoint?serviceId=PROBATE&actor=APPLICANT&pcqId=78e69022-2468-4370-a88e-bea2a80fa51f&ccdCaseId=1234567890123456&partyId=applicant@email.com&returnUrl=http://localhost:3000/task-list&language=en`
                    });
                    done();
                }).catch(err => {
                    done(err);
                });
            });
        });
    });

    describe('isComplete()', () => {
        it('should return the completion status correctly if question already asked', (done) => {
            const ctx = {};
            const formdata = {
                equality: {
                    pcqId: '78e69022-2468-4370-a88e-bea2a80fa51f'
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
