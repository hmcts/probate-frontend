'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');

describe('ExecutorsInvitesSent', () => {
    const ExecutorsInvitesSent = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]).ExecutorsInvitesSent;

    describe('getUrl', () => {
        it('returns correct url', () => {
            const url = ExecutorsInvitesSent.constructor.getUrl();
            expect(url).to.equal('/executors-invites-sent');
        });
    });

});
