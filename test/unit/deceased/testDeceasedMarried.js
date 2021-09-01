'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const DeceasedMarried = steps.DeceasedMarried;

describe('DeceasedMarried', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedMarried.constructor.getUrl();
            expect(url).to.equal('/deceased-married*');
            done();
        });
    });
});
