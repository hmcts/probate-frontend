'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const WaitingForHmrc = steps.WaitingForHmrc;

describe('WaitingForHmrc', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = WaitingForHmrc.constructor.getUrl();
            expect(url).to.equal('/waiting-for-hmrc');
            done();
        });
    });

});
