'use strict';

const initSteps = require('app/core/initSteps');
const chai = require('chai');
const expect = chai.expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);

describe('CopiesStart.js', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const copiesStart = steps.CopiesStart;
            const url = copiesStart.constructor.getUrl();
            expect(url).to.equal('/copies-start');
            done();
        });
    });
});
