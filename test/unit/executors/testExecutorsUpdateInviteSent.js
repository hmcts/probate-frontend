'use strict';
const initSteps = require('app/core/initSteps');
const {assert} = require('chai');

describe('Update-Invite-Sent', () => {
    const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
    const updateInviteSent = steps.ExecutorsUpdateInviteSent;

    describe('getUrl()', () => {
        it('test correct url is returned from getUrl function', () => {
            assert.equal(updateInviteSent.constructor.getUrl(), '/executors-update-invite-sent*');
        });
    });
});
