'use strict';
const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');

describe('Update-Invite', () => {
    let ctx;
    const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
    const updateInvite = steps.ExecutorsUpdateInvite;

    describe('getUrl()', () => {
        it('test correct url is returned from getUrl function', () => {
            assert.equal(updateInvite.constructor.getUrl(), '/executors-update-invite*');
        });
    });

    describe('getContextData()', () => {
        it('test ctx variables are correctly assigned when there are more than one executor with new email', (done) => {
            const req = {
                session: {
                    form: {
                        executors: {
                            executorsNumber: 3,
                            invitesSent: 'true',
                            list: [
                                {fullName: 'john', isApplying: true, isApplicant: true},
                                {fullName: 'other applicant', isApplying: true, emailChanged: true},
                                {fullName: 'harvey', isApplying: true, emailChanged: true}
                            ]
                        }
                    }
                }
            };

            ctx = updateInvite.getContextData(req);
            expect(ctx.executorsEmailChangedList).to.deep.equal([
                {
                    emailChanged: true,
                    fullName: 'other applicant',
                    isApplying: true
                },
                {
                    emailChanged: true,
                    fullName: 'harvey',
                    isApplying: true
                }
            ]);
            expect(ctx.inviteSuffix).to.deep.equal('-multiple');
            done();
        });

        it('test ctx variables are correctly assigned when there is only one executor with new email', (done) => {
            const req = {
                session: {
                    form: {
                        executors: {
                            executorsNumber: 3,
                            invitesSent: 'true',
                            list: [
                                {fullName: 'john', isApplying: true, isApplicant: true},
                                {fullName: 'other applicant', isApplying: true, emailChanged: true},
                                {fullName: 'harvey', isApplying: true}
                            ]
                        }
                    }
                }
            };

            ctx = updateInvite.getContextData(req);
            expect(ctx.executorsEmailChangedList).to.deep.equal([
                {
                    emailChanged: true,
                    fullName: 'other applicant',
                    isApplying: true
                }
            ]);
            expect(ctx.inviteSuffix).to.deep.equal('');
            done();
        });
    });

    describe('action()', () => {
        it('test that context variables are removed and empty object returned', () => {
            let formdata = {};
            let ctx = {
                executorsEmailChanged: true,
                executorsEmailChangedList: true,
                inviteSuffix: '-multiple'
            };
            [ctx, formdata] = updateInvite.action(ctx, formdata);
            expect(ctx).to.deep.equal({});
        });

        it('test that context variables are removed and object contains only appropriate variables', () => {
            let formdata = {};
            let ctx = {
                executorsEmailChanged: true,
                executorsEmailChangedList: true,
                inviteSuffix: '-multiple',
                invitesSent: 'true'
            };
            [ctx, formdata] = updateInvite.action(ctx, formdata);
            expect(ctx).to.deep.equal({invitesSent: 'true'});
        });
    });
});
