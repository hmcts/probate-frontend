'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const DeceasedDomicile = steps.DeceasedDomicile;

describe('DeceasedDomicile', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedDomicile.constructor.getUrl();
            expect(url).to.equal('/deceased-domicile');
            done();
        });
    });

    describe('isComplete()', () => {
        it('test it returns the correct values with the feature toggle off', () => {
            const ctx = {};
            const formdata = {};
            const featureToggles = {
                screening_questions: false
            };

            const result = DeceasedDomicile.isComplete(ctx, formdata, featureToggles);
            expect(result).to.deep.equal([false, 'inProgress']);
        });

        it('test it returns the correct values with the feature toggle on', () => {
            const ctx = {};
            const formdata = {};
            const featureToggles = {
                screening_questions: true
            };

            const result = DeceasedDomicile.isComplete(ctx, formdata, featureToggles);
            expect(result).to.deep.equal([true, 'inProgress']);
        });
    });
});
