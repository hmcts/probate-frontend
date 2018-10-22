const {expect} = require('chai');
const initSteps = require('app/core/initSteps');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);

describe('Documents unit tests', () => {

    describe('getUrl()', () => {
        it('should return correct url', (done) => {
            const documents = steps.Documents;
            const url = documents.constructor.getUrl();
            expect(url).to.equal('/documents');
            done();
        });
    });
});
