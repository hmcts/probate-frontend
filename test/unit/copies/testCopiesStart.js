'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const copiesStart = steps.CopiesStart;

describe('CopiesStart', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = copiesStart.constructor.getUrl();
            expect(url).to.equal('/copies-start*');
            done();
        });
    });
});
