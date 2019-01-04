'use strict';

const {expect} = require('chai');
const rewire = require('rewire');
const RemoveInvitedExecutor = rewire('app/utils/RemoveInvitedExecutor');

describe('RemoveInvitedExecutor', () => {
    describe('remove()', () => {
        let revertInviteData;
        let req;

        beforeEach(() => {
            revertInviteData = RemoveInvitedExecutor.__set__('InviteData', class {
                delete() {
                    return Promise.resolve('');
                }
            });

            req = {
                session: {
                    form: {
                        executors: {
                            executorsNumber: 4,
                            list: [{
                                firstName: 'Bob Richard',
                                lastName: 'Smith',
                                isApplying: true,
                                isApplicant: true,
                            }, {
                                fullName: 'executor_2_name',
                                isDead: true,
                                diedBefore: 'Yes',
                                notApplyingReason: 'This executor died (before the person who has died)',
                                notApplyingKey: 'optionDiedBefore',
                                isApplying: false,
                                hasOtherName: false,
                                inviteId: 'dummy_inviteId_1',
                                emailSent: true
                            }, {
                                fullName: 'executor_3_name',
                                isApplying: true,
                                hasOtherName: true,
                                currentName: 'exec_3_new_name',
                                email: 'haji58@hotmail.co.uk',
                                mobile: '07963723856',
                                address: 'exec_3_address\r\n',
                                freeTextAddress: 'exec_3_address\r\n',
                                inviteId: 'dummy_inviteId_2',
                                emailSent: true
                            }, {
                                fullName: 'executor_4_name',
                                isDead: false,
                                isApplying: false,
                                hasOtherName: false,
                                notApplyingReason: 'This executor doesn&rsquo;t want to apply now, and gives up the right to do so in the future (this is also known as renunciation, and the executor will need to fill in a form)',
                                notApplyingKey: 'optionRenunciated',
                                inviteId: 'dummy_inviteId_3',
                                emailSent: true
                            }],
                            allalive: 'No',
                            otherExecutorsApplying: 'Yes',
                            alias: 'Yes',
                            invitesSent: 'true',
                            executorsRemoved: [{
                                fullName: 'executor_2_name',
                                isDead: true,
                                diedBefore: 'Yes',
                                notApplyingReason: 'This executor died (before the person who has died)',
                                notApplyingKey: 'optionDiedBefore',
                                isApplying: false,
                                hasOtherName: false,
                                inviteId: 'dummy_inviteId_1',
                                emailSent: true
                            }, {
                                fullName: 'executor_4_name',
                                isDead: false,
                                isApplying: false,
                                hasOtherName: false,
                                notApplyingReason: 'This executor doesn&rsquo;t want to apply now, and gives up the right to do so in the future (this is also known as renunciation, and the executor will need to fill in a form)',
                                notApplyingKey: 'optionRenunciated',
                                inviteId: 'dummy_inviteId_3',
                                emailSent: true
                            }]
                        },
                        journeyType: 'probate'
                    }
                }
            };
        });

        afterEach(() => {
            revertInviteData();
        });

        describe('when there are executors to remove', () => {
            it('should delete executorsRemoved list as well as emailSent and inviteId for the non-applying executors', (done) => {
                RemoveInvitedExecutor.remove(req)
                    .then(res => {
                        expect(res).to.deep.equal({
                            alias: 'Yes',
                            allalive: 'No',
                            executorsNumber: 4,
                            invitesSent: 'true',
                            list: [
                                {
                                    firstName: 'Bob Richard',
                                    isApplicant: true,
                                    isApplying: true,
                                    lastName: 'Smith'
                                },
                                {
                                    diedBefore: 'Yes',
                                    fullName: 'executor_2_name',
                                    hasOtherName: false,
                                    isApplying: false,
                                    isDead: true,
                                    notApplyingKey: 'optionDiedBefore',
                                    notApplyingReason: 'This executor died (before the person who has died)'
                                },
                                {
                                    address: 'exec_3_address\r\n',
                                    currentName: 'exec_3_new_name',
                                    email: 'haji58@hotmail.co.uk',
                                    emailSent: true,
                                    freeTextAddress: 'exec_3_address\r\n',
                                    fullName: 'executor_3_name',
                                    hasOtherName: true,
                                    inviteId: 'dummy_inviteId_2',
                                    isApplying: true,
                                    mobile: '07963723856'
                                },
                                {
                                    fullName: 'executor_4_name',
                                    hasOtherName: false,
                                    isApplying: false,
                                    isDead: false,
                                    notApplyingKey: 'optionRenunciated',
                                    notApplyingReason: 'This executor doesn&rsquo;t want to apply now, and gives up the right to do so in the future (this is also known as renunciation, and the executor will need to fill in a form)'
                                }
                            ],
                            otherExecutorsApplying: 'Yes'
                        });
                        done();
                    })
                    .catch(err => {
                        done(err);
                    });
            });
        });

        describe('when there are no executors to remove', () => {
            it('should return the original executors data', (done) => {
                delete req.session.form.executors.list[1].inviteId;
                delete req.session.form.executors.list[3].inviteId;
                delete req.session.form.executors.executorsRemoved;
                RemoveInvitedExecutor.remove(req)
                    .then(res => {
                        expect(res).to.deep.equal(req.session.form.executors);
                        done();
                    })
                    .catch(err => {
                        done(err);
                    });
            });
        });
    });
});
