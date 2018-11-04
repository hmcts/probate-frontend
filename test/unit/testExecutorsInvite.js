'use strict';

const initSteps = require('app/core/initSteps');
const {assert, expect} = require('chai');

describe('Executors-Invite', () => {
    let ctx;
    const ExecsInvite = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]).ExecutorsInvite;

    describe('getUrl', () => {
        it('returns correct url', () => {
            const url = ExecsInvite.constructor.getUrl();
            expect(url).to.equal('/executors-invite');
        });
    });

    describe('getContextData', () => {
        const req = {
            session: {
                form: {
                    executors: {
                        executorsNumber: 0
                    }
                }
            }
        };

        it('test inviteSuffix is correct when the number of executors is 2', () => {
            req.session.form.executors.executorsNumber = 2;
            ctx = ExecsInvite.getContextData(req);
            assert.equal(ctx.inviteSuffix, '');
        });

        it('test inviteSuffix is correct when the number of executors exceeds 2', () => {
            req.session.form.executors.executorsNumber = 3;
            ctx = ExecsInvite.getContextData(req);
            assert.equal(ctx.inviteSuffix, '-multiple');
        });
    });

    describe('action', () => {

        it('test inviteSuffix is removed from the context', () => {
            ctx = {
                inviteSuffix: '-multiple'
            };
            ExecsInvite.action(ctx);
            assert.isUndefined(ctx.inviteSuffix);
        });

        it('removes inviteSuffix from ctx', () => {
            ctx = {
                inviteSuffix: '-multiple'
            };
            const [result] = ExecsInvite.action(ctx);
            expect(result).to.deep.equal({});
        });
    });

    describe('isComplete', () => {
        it('returns true based on invitesSent', () => {
            const ctx = {invitesSent: 'true'};
            const result = ExecsInvite.isComplete(ctx);
            expect(result).to.deep.equal(['true', 'inProgress']);
        });

        it('returns true based on invitesSent', () => {
            const ctx = {invitesSent: 'false'};
            const result = ExecsInvite.isComplete(ctx);
            expect(result).to.deep.equal(['false', 'inProgress']);
        });
    });
});
