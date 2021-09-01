'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const ApplicantPhone = steps.ApplicantPhone;

describe('ApplicantPhone', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ApplicantPhone.constructor.getUrl();
            expect(url).to.equal('/applicant-phone*');
            done();
        });
    });
});
