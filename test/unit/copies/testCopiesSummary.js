'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const CopiesSummary = steps.CopiesSummary;

describe('CopiesSummary', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = CopiesSummary.constructor.getUrl();
            expect(url).to.equal('/copies-summary*');
            done();
        });
    });
});
