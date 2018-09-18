'use strict';

const AdditionalExecutorInvite = require('app/utils/AdditionalExecutorInvite');
const services = require('app/components/services');
const {assert, expect} = require('chai');
const sinon = require('sinon');

describe('AdditionalExecutorInvite.js', () => {
    describe('invite()', () => {
        let sendInviteStub;
        let session;
        let executorsToCheck;

        beforeEach(() => {
            sendInviteStub = sinon
                .stub(services, 'sendInvite')
                .returns(Promise.resolve('Success'));
            session = {
                form: {
                    deceased: {
                        firstName: 'Dee',
                        lastName: 'Ceased'
                    },
                    executors: {
                        executorsNumber: 4,
                        list: [{
                            firstName: 'Bob Richard',
                            lastName: 'Smith',
                            isApplying: true,
                            isApplicant: true,
                        }, {
                            fullName: 'executor_2_name',
                            isApplying: true,
                            emailSent: true,
                            email: 'haji58@hotmail.co.uk',
                            mobile: '07964523856',
                            address: 'exec_3_address\r\n',
                            freeTextAddress: 'exec_3_address\r\n',
                            inviteId: 'dummy_inviteId_1',
                        }, {
                            fullName: 'executor_3_name',
                            isApplying: true,
                            hasOtherName: true,
                            emailSent: false,
                            currentName: 'exec_3_new_name',
                            email: 'haji58@hotmail.co.uk',
                            mobile: '07963723856',
                            address: 'exec_3_address\r\n',
                            freeTextAddress: 'exec_3_address\r\n'
                        }],
                        otherExecutorsApplying: 'Yes',
                        invitesSent: 'true'
                    }
                }
            };
            executorsToCheck = JSON.parse(JSON.stringify(session));
            executorsToCheck.form.executors.list[1].emailSent = true;
            executorsToCheck.form.executors.list[2].emailSent = true;
        });

        afterEach(() => {
            sendInviteStub.restore();
        });

        describe('when there are executors to be notified', () => {
            it('should set emailSent flag to true when there is only one executor to be notified', (done) => {
                AdditionalExecutorInvite.invite(session).then(res => {
                    assert.isDefined(res.list[2].inviteId);
                    expect(res.list[2].emailSent).to.deep.equal(true);
                    done();
                })
                .catch(err => {
                    done(err);
                });
            });

            it('should set emailSent flag to true when there are two executors to be notified', (done) => {
                session.form.executors.list[1].emailSent = false;
                delete session.form.executors.list[1].inviteId;
                AdditionalExecutorInvite.invite(session).then(res => {
                    assert.isDefined(res.list[1].inviteId);
                    assert.isDefined(res.list[2].inviteId);
                    expect(res.list[1].emailSent).to.deep.equal(true);
                    expect(res.list[2].emailSent).to.deep.equal(true);
                    done();
                })
                .catch(err => {
                    done(err);
                });
            });
        });

        describe('when there are no emailChanged flags to remove', () => {
            it('should return the original executors data', (done) => {
                session.form.executors.list[2].emailSent = true;
                AdditionalExecutorInvite.invite(session).then(res => {
                    expect(res).to.deep.equal(executorsToCheck.form.executors);
                    done();
                })
                .catch(err => {
                    done(err);
                });
            });
        });
    });
});
