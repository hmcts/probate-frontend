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
            expect(url).to.equal('/equality-and-diversity*');
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
                    const token = '79d3c3968c1b94baa8753a66c72a3382aacb1152f20fac4ba2ad7c754adf464a538a77496a281db63b2ca' +
                        'aa49380fcb5f4210a0fc3933a0c4d5f2f790c026df47946c7b8640dc476f47a12822df5c38590dc16c9c9b4143ccca4' +
                        'a76f32aa1bb1bf49c2400409efbe23f35fac953b98842b8a678e00b3e72d59d814eac0b01f77696b4c702cfed0fefe5' +
                        'da93237fc115740bc51737225e8853e9d7dec21a0c35c0c4b33d64ff5ba81052fef8d3cc84be1cee28be7df21c4178e' +
                        'fce955017951d7110a08feb4a55390a3d6a7fa9105bfc5d4439cec166a9e53bb64cc0aa4c3a15f';

                    expect(options).to.deep.equal({
                        redirect: true,
                        url: `http://localhost:4000/service-endpoint?serviceId=PROBATE&actor=APPLICANT&pcqId=78e69022-2468-4370-a88e-bea2a80fa51f&ccdCaseId=1234567890123456&partyId=applicant@email.com&returnUrl=http://localhost:3000/task-list&language=en&token=${token}`
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
                        url: 'http://localhost:4000/service-endpoint?serviceId=PROBATE&actor=APPLICANT&pcqId=78e69022-2468-4370-a88e-bea2a80fa51f&ccdCaseId=1234567890123456&partyId=applicant@email.com&returnUrl=http://localhost:3000/task-list&language=en'
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
