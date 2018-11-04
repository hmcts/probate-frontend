'use strict';
const initSteps = require('app/core/initSteps');
const {expect} = require('chai');

describe('ExecutorsChangeMade', function () {
    const ExecutorsChangeMade = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]).ExecutorsChangeMade;

    describe('getUrl', () => {
        it('returns correct url', () => {
            const url = ExecutorsChangeMade.constructor.getUrl();
            expect(url).to.equal('/executors-change-made');
        });
    });
});
