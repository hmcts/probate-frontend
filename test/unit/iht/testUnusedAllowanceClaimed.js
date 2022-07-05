'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const IhtUnusedAllowanceClaimed = steps.IhtUnusedAllowanceClaimed;

describe('IhtUnusedAllowanceClaimed', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = IhtUnusedAllowanceClaimed.constructor.getUrl();
            expect(url).to.equal('/unused-allowance-claimed');
            done();
        });
    });
});
