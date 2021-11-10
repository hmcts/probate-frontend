'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const Iht207Estate = steps.Iht207Estate;

describe('Iht207Estate', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = Iht207Estate.constructor.getUrl();
            expect(url).to.equal('/iht-207');
            done();
        });
    });
});
