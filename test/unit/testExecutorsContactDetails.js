'use strict';
const initSteps = require('app/core/initSteps');
const services = require('app/components/services');
const sinon = require('sinon');
const when = require('when');
const co = require('co');
const {expect} = require('chai');

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
                        mobile: '07567567567'
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

        it('test emailChanged flag is correctly set and contact details updated', (done) => {
            co(function* () {
                [ctx, errors] = yield contactDetails.handlePost(ctx, errors);
                expect(ctx).to.deep.equal({
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
                            email: 'newtestemail@gmail.com',
                            mobile: '07321321321',
                            emailChanged: true
                        },
                        {
                            fullName: 'Billy Jean',
                            isApplying: true,
                            email: 'testemail@gmail.com',
                            mobile: '07567567567'
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

        it('test emailChanged flag is correctly set and contact details updated and the updateContactDetails service is called', (done) => {
            updateContactDetailsStub.returns(when(Promise.resolve({response: 'Make it pass!'})));
            ctx.list[1].inviteId = 'dummy_inviteId';
            ctx.list[1].emailSent = true;
            ctx.mobile = '07888888888';
            ctx.email = 'cratchet@email.com';
            co(function* () {
                [ctx, errors] = yield contactDetails.handlePost(ctx, errors);
                expect(ctx).to.deep.equal({
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
                        mobile: '07567567567'
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
});
