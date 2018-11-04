/* eslint-disable max-lines */
'use strict';

const initSteps = require('app/core/initSteps');
const services = require('app/components/services');
const sinon = require('sinon');
const when = require('when');
const co = require('co');
const {assert, expect} = require('chai');

describe('ExecutorContactDetails', function () {
    let ctx;
    let errors;
    let updateContactDetailsStub;
    const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
    const contactDetails = steps.ExecutorContactDetails;

    describe('getUrl', () => {
        it('returns correct url', () => {
            const url = contactDetails.constructor.getUrl();
            expect(url).to.include('/executor-contact-details');
        });

        it('appends * when no index is given', () => {
            const url = contactDetails.constructor.getUrl();
            expect(url).to.equal('/executor-contact-details/*');
        });

        it('appends index to url when given', () => {
            const url = contactDetails.constructor.getUrl(1);
            expect(url).to.equal('/executor-contact-details/1');
        });

    });

    describe('handleGet', () => {
        it('populates "ctx.email" and "ctx.mobile" from "ctx.list"', () => {
            const ctx = {
                index: 1,
                list: [
                    {email: 'email1', mobile: '1234567890'},
                    {email: 'email2', mobile: '0987654321'}]
            };

            const [result] = contactDetails.handleGet(ctx);
            expect(result.email).to.equal(ctx.list[ctx.index].email);
            expect(result.mobile).to.equal(ctx.list[ctx.index].mobile);
        });
    });

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

    describe('validatePhoneNumber', () => {

        describe('returns true when input', () => {
            it('starts with "0"', () => {
                const result = contactDetails.validatePhoneNumber('0123456789');
                assert(result, true);
            });

            it('starts with "+"', () => {
                const result = contactDetails.validatePhoneNumber('+0123456789');
                assert(result, true);
            });

            it('starts with "44"', () => {
                const result = contactDetails.validatePhoneNumber('44123456789');
                assert(result, true);
            });

            it('starts with "7"', () => {
                const result = contactDetails.validatePhoneNumber('7123456789');
                assert(result, true);
            });
        });

        describe('returns false when input', () => {

            it('does not start with 0,44,+ or 7', () => {
                const result = contactDetails.validatePhoneNumber('1234567890');
                expect(result).to.equal(false);
            });

            it('starts with a letter', () => {
                const result = contactDetails.validatePhoneNumber('z0123456789');
                expect(result).to.equal(false);
            });

            it('starts with "00"', () => {
                const result = contactDetails.validatePhoneNumber('00123456789');
                expect(result).to.equal(false);
            });

            it('is a string starting with "7"', () => {
                const result = contactDetails.validatePhoneNumber('7mobilephone');
                expect(result).to.equal(false);
            });

            it('is a string starting with "0"', () => {
                const result = contactDetails.validatePhoneNumber('0mobilephone');
                expect(result).to.equal(false);
            });

            it('is a string starting with "+"', () => {
                const result = contactDetails.validatePhoneNumber('+mobilephone');
                expect(result).to.equal(false);
            });
        });
    });

    describe('action', () => {
        it('removes otherExecName from ctx', () => {
            const ctx = {
                otherExecName: 'Cher'
            };
            const [result] = contactDetails.action(ctx);
            expect(result).to.deep.equal({});
            assert.isUndefined(ctx.otherExecName);
        });

        it('removes email from ctx', () => {
            const ctx = {
                email: 'cher@hotmail.com'
            };
            const [result] = contactDetails.action(ctx);
            expect(result).to.deep.equal({});
            assert.isUndefined(ctx.email);
        });

        it('removes mobile from ctx', () => {
            const ctx = {
                mobile: '1234567890'
            };
            const [result] = contactDetails.action(ctx);
            expect(result).to.deep.equal({});
            assert.isUndefined(ctx.mobile);
        });

        it('removes index from ctx', () => {
            const ctx = {
                index: 1
            };
            const [result] = contactDetails.action(ctx);
            expect(result).to.deep.equal({});
            assert.isUndefined(ctx.index);
        });
    });
});
