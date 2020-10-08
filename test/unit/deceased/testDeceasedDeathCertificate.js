'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const DeathCertificateInterim = steps.DeathCertificateInterim;

describe('DeathCertificateInterim', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeathCertificateInterim.constructor.getUrl();
            expect(url).to.equal('/certificate-interim');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct next step options', (done) => {
            const result = DeathCertificateInterim.nextStepOptions();
            expect(result).to.deep.equal({
                options: [{
                    key: 'deceasedDeathCertificate',
                    value: 'optionDeathCertificate',
                    choice: 'hasCertificate'
                }]
            });
            done();
        });
    });

});
