'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const DeceasedName = steps.DeceasedName;

describe('DeceasedName', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedName.constructor.getUrl();
            expect(url).to.equal('/deceased-name*');
            done();
        });
    });

    describe('action()', () => {
        it('test it cleans up context', () => {
            const ctx = {
                index: 3683
            };
            DeceasedName.action(ctx);
            assert.isUndefined(ctx.index);
        });
    });
});
