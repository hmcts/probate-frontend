'use strict';

const initSteps = require('app/core/initSteps');
const {assert, expect} = require('chai');
const journey = require('app/journeys/probate');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const ExecsInvite = steps.ExecutorsInvite;

describe('Executors-Invite', () => {
    let ctx;

    describe('getContextData()', () => {
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

    describe('nextStepUrl()', () => {
        it('should return url for the next step', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {};
            const nextStepUrl = ExecsInvite.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/executors-invites-sent');
            done();
        });
    });

    describe('action()', () => {
        it('test inviteSuffix is removed from the context', () => {
            ctx = {
                inviteSuffix: '-multiple'
            };
            ExecsInvite.action(ctx);
            assert.isUndefined(ctx.inviteSuffix);
        });
    });
});
