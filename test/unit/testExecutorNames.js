'use strict';
const initSteps = require('app/core/initSteps');
const chai = require('chai');
const expect = chai.expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const ExecutorsNames = steps.ExecutorsNames;

describe('ExecutorsNames', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ExecutorsNames.constructor.getUrl();
            expect(url).to.equal('/executors-names');
            done();
        });
    });
});
