'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const UniqueProbateCode = steps.UniqueProbateCode;

describe('UniqueProbateCode', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = UniqueProbateCode.constructor.getUrl();
            expect(url).to.equal('/unique-probate-code');
            done();
        });
    });

});
