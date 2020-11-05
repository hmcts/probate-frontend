'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const ForeignDeathCertTranslation = steps.ForeignDeathCertTranslation;

describe('ForeignDeathCertTranslation', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ForeignDeathCertTranslation.constructor.getUrl();
            expect(url).to.equal('/foreign-death-cert-translation');
            done();
        });
    });
});
