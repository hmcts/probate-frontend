'use strict';

const {expect} = require('chai');
const rewire = require('rewire');
const UpdateExecutorInvite = rewire('app/utils/UpdateExecutorInvite');

describe('UpdateExecutorInvite', () => {
    describe('update()', () => {
        let session;
        let executorsToCheck;

        beforeEach(() => {
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
                            emailChanged: true,
                            email: 'haji58@hotmail.co.uk',
                            mobile: '07964523856',
                            address: 'exec_3_address\r\n',
                            freeTextAddress: 'exec_3_address\r\n',
                            inviteId: 'dummy_inviteId_1',
                        }, {
                            fullName: 'executor_3_name',
                            isApplying: true,
                            hasOtherName: true,
                            emailChanged: true,
                            currentName: 'exec_3_new_name',
                            email: 'haji58@hotmail.co.uk',
                            mobile: '07963723856',
                            address: 'exec_3_address\r\n',
                            freeTextAddress: 'exec_3_address\r\n',
                            inviteId: 'dummy_inviteId_2',
                        }],
                        otherExecutorsApplying: 'Yes',
                        invitesSent: 'true'
                    }
                }
            };
            executorsToCheck = JSON.parse(JSON.stringify(session));
            delete executorsToCheck.form.executors.list[1].emailChanged;
            delete executorsToCheck.form.executors.list[2].emailChanged;
        });

        describe('when there are emailChanged flags to remove', () => {
            it('should delete emailChanged flag', (done) => {
                UpdateExecutorInvite.__set__('InviteLink', class {
                    post() {
                        return Promise.resolve('Success');
                    }
                });
                UpdateExecutorInvite.update(session)
                    .then(res => {
                        expect(res).to.deep.equal(executorsToCheck.form.executors);
                        done();
                    })
                    .catch(err => {
                        done(err);
                    });
            });
        });

        describe('when there are no emailChanged flags to remove', () => {
            it('should return the original executors data', (done) => {
                delete session.form.executors.list[1].emailChanged;
                delete session.form.executors.list[2].emailChanged;
                UpdateExecutorInvite.update(session)
                    .then(res => {
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
