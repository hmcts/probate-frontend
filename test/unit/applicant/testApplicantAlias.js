'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);

describe('ApplicantAlias', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const ApplicantAlias = steps.ApplicantAlias;
            const url = ApplicantAlias.constructor.getUrl();
            expect(url).to.equal('/applicant-alias*');
            done();
        });
    });
});
