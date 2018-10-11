'use strict';
const initSteps = require('app/core/initSteps');
const chai = require('chai');
const expect = chai.expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);

describe('Documents', () => {
    const Documents = steps.Documents;

    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = Documents.constructor.getUrl();
            expect(url).to.equal('/documents');
            done();
        });
    });
});
