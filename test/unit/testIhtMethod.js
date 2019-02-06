'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const content = require('app/resources/en/translation/iht/method');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const IhtMethod = steps.IhtMethod;

describe('IhtMethod', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = IhtMethod.constructor.getUrl();
            expect(url).to.equal('/iht-method');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct next step options', (done) => {
            const result = IhtMethod.nextStepOptions();
            expect(result).to.deep.equal({
                options: [{
                    key: 'method',
                    value: content.onlineOption,
                    choice: 'online'
                }]
            });
            done();
        });
    });
});
