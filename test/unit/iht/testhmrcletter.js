'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const HmrcLetter = steps.HmrcLetter;

describe('HmrcLetter', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = HmrcLetter.constructor.getUrl();
            expect(url).to.equal('/hmrc-letter');
            done();
        });
    });

});
