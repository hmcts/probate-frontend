'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const DeceasedHadLateSpouseOrCivilPartner = steps.DeceasedHadLateSpouseOrCivilPartner;

describe('DeceasedHadLateSpouseOrCivilPartner', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedHadLateSpouseOrCivilPartner.constructor.getUrl();
            expect(url).to.equal('/deceased-late-spouse-civil-partner');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = DeceasedHadLateSpouseOrCivilPartner.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'deceasedHadLateSpouseOrCivilPartner', value: 'optionYes', choice: 'deceasedHadLateSpouseOrCivilPartner'},
                ]
            });
            done();
        });
    });

});
