'use strict';

const initSteps = require('app/core/initSteps');
const services = require('app/components/services');
const sinon = require('sinon');
const when = require('when');
const co = require('co');
const {expect} = require('chai');
const journey = require('app/journeys/probate');

describe('Contact-Details', function () {
    let ctx;
    let errors;
    let updateContactDetailsStub;
    const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
    const contactDetails = steps.ExecutorContactDetails;

    describe('handlePost()', () => {
        beforeEach(() => {
            updateContactDetailsStub = sinon.stub(services, 'updateContactDetails');
            ctx = {
                executorsNumber: 3,
                list: [
                    {
                        firstName: 'Lead',
                        lastName: 'Applicant',
                        isApplying: true,
                        isApplicant: true
                    },
                    {
                        fullName: 'Bob Cratchett',
                        isApplying: true,
                        email: 'testemail@outlook.com',
                        mobile: '07123123123'
                    },
                    {
                        fullName: 'Billy Jean',
                        isApplying: true,
                        email: 'testemail@gmail.com',
                        mobile: '07567567567',
                        emailSent: true
                    }
                ],
                invitesSent: 'true',
                otherExecutorsApplying: 'Yes',
                email: 'newtestemail@gmail.com',
                mobile: '07321321321',
                index: 1,
                otherExecName: 'Bob Cratchett',
                executorsEmailChanged: false
            };
            errors = {};
        });

        afterEach(() => {
            updateContactDetailsStub.restore();
        });

        it('test emailChanged flag is correctly set, executorToBeNotifiedList is correctly populated and contact details updated (single applicant)', (done) => {
            co(function* () {
                ctx.list[1].inviteId = 'dummy_inviteId';
                ctx.list[1].emailChanged = true;
                [ctx, errors] = yield contactDetails.handlePost(ctx, errors);
                expect(ctx).to.deep.equal({
                    executorsNumber: 3,
                    executorsToNotifyList: [
                        {
                            email: 'newtestemail@gmail.com',
                            fullName: 'Bob Cratchett',
                            inviteId: 'dummy_inviteId',
                            emailChanged: true,
                            isApplying: true,
                            mobile: '07321321321'
                        }
                    ],
                    list: [
                        {
                            firstName: 'Lead',
                            lastName: 'Applicant',
                            isApplying: true,
                            isApplicant: true
                        },
                        {
                            fullName: 'Bob Cratchett',
                            isApplying: true,
                            email: 'newtestemail@gmail.com',
                            mobile: '07321321321',
                            emailChanged: true,
                            inviteId: 'dummy_inviteId'
                        },
                        {
                            fullName: 'Billy Jean',
                            isApplying: true,
                            email: 'testemail@gmail.com',
                            mobile: '07567567567',
                            emailSent: true
                        }
                    ],
                    invitesSent: 'true',
                    otherExecutorsApplying: 'Yes',
                    email: 'newtestemail@gmail.com',
                    mobile: '07321321321',
                    index: 1,
                    otherExecName: 'Bob Cratchett',
                    executorsEmailChanged: true
                });
                done();
            })
                .catch((err) => {
                    done(err);
                });
        });

        it('test emailChanged flag is correctly set, executorToBeNotifiedList is populated and contact details updated', (done) => {
            ctx.list[1].emailSent = false;
            ctx.list[2].emailSent = true;
            ctx.list[2].inviteId = 'dummy_id';
            co(function* () {
                [ctx, errors] = yield contactDetails.handlePost(ctx, errors);
                expect(ctx).to.deep.equal({
                    executorsNumber: 3,
                    executorsToNotifyList: [
                        {
                            email: 'newtestemail@gmail.com',
                            emailSent: false,
                            fullName: 'Bob Cratchett',
                            isApplying: true,
                            mobile: '07321321321'
                        }
                    ],
                    list: [
                        {
                            firstName: 'Lead',
                            lastName: 'Applicant',
                            isApplying: true,
                            isApplicant: true
                        },
                        {
                            fullName: 'Bob Cratchett',
                            isApplying: true,
                            email: 'newtestemail@gmail.com',
                            mobile: '07321321321',
                            emailSent: false
                        },
                        {
                            fullName: 'Billy Jean',
                            isApplying: true,
                            email: 'testemail@gmail.com',
                            mobile: '07567567567',
                            emailSent: true,
                            inviteId: 'dummy_id'
                        }
                    ],
                    invitesSent: 'true',
                    otherExecutorsApplying: 'Yes',
                    email: 'newtestemail@gmail.com',
                    mobile: '07321321321',
                    index: 1,
                    otherExecName: 'Bob Cratchett',
                    executorsEmailChanged: false
                });
                done();
            })
                .catch((err) => {
                    done(err);
                });
        });

        it('test emailChanged flag is correctly set, executorToBeNotifiedList is empty, contact details updated and the updateContactDetails service is called', (done) => {
            updateContactDetailsStub.returns(when(Promise.resolve({response: 'Make it pass!'})));
            ctx.list[1].inviteId = 'dummy_inviteId';
            ctx.list[1].emailSent = true;
            ctx.mobile = '07888888888';
            ctx.email = 'cratchet@email.com';
            co(function* () {
                [ctx, errors] = yield contactDetails.handlePost(ctx, errors);
                expect(ctx).to.deep.equal({
                    executorsNumber: 3,
                    executorsToNotifyList: [],
                    list: [
                        {
                            firstName: 'Lead',
                            lastName: 'Applicant',
                            isApplying: true,
                            isApplicant: true
                        },
                        {
                            fullName: 'Bob Cratchett',
                            isApplying: true,
                            email: 'cratchet@email.com',
                            mobile: '07888888888',
                            emailChanged: true,
                            inviteId: 'dummy_inviteId',
                            emailSent: true
                        },
                        {
                            fullName: 'Billy Jean',
                            isApplying: true,
                            email: 'testemail@gmail.com',
                            mobile: '07567567567',
                            emailSent: true
                        }
                    ],
                    invitesSent: 'true',
                    otherExecutorsApplying: 'Yes',
                    email: 'cratchet@email.com',
                    mobile: '07888888888',
                    index: 1,
                    otherExecName: 'Bob Cratchett',
                    executorsEmailChanged: true
                });
                done();
            })
                .catch((err) => {
                    done(err);
                });
        });
    });

    describe('nextStepUrl()', () => {
        it('should return url for the next step', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                index: 1
            };
            const nextStepUrl = contactDetails.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/executor-address/1');
            done();
        });
    });
});
