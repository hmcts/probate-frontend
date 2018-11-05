'use strict';

const {expect} = require('chai');
const initSteps = require('app/core/initSteps');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const json = require('app/resources/en/translation/assets/overseas.json');

describe('AssetsOverseas unit tests', () => {

    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const assetsOverseas = steps.AssetsOverseas;
            const url = assetsOverseas.constructor.getUrl();
            expect(url).to.equal('/assets-overseas');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const assetsOverseas = steps.AssetsOverseas;
            const nextStepOptions = assetsOverseas.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'assetsoverseas',
                    value: json.optionYes,
                    choice: 'assetsoverseas'
                }]
            });
            done();
        });
    });
});
