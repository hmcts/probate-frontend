'use strict';

const initSteps = require('app/core/initSteps');
const chai = require('chai');
const expect = chai.expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);

describe('DocumentUpload.js', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const DocumentUpload = steps.DocumentUpload;
            const url = DocumentUpload.constructor.getUrl();
            expect(url).to.equal('/document-upload');
            done();
        });
    });
});
