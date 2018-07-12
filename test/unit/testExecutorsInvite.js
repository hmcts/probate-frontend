'use strict';

const initSteps = require('app/core/initSteps');
const assert = require('chai').assert;
const {isNil} = require('lodash');

describe('Executors-Invite', function () {
    let ctx;
    const ExecsInvite = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]).ExecutorsInvite;

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
            assert.isTrue(isNil(ctx.inviteSuffix));
        });
    });
});
