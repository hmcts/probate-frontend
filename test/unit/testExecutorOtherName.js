/* eslint max-lines: ["error", 500] */

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');

describe('ExecutorsWithOtherNames', () => {
    const steps = initSteps([__dirname + '/../../app/steps/action/', __dirname + '/../../app/steps/ui']);

    describe('pruneFormData', () => {

        it('test that currentNameReason is deleted when executor has no other name', () => {
            const ExecutorsWithOtherNames = steps.ExecutorsWithOtherNames;
            const data = {
                fullName: 'Ed Brown',
                hasOtherName: false,
                currentNameReason: 'Marriage',
                currentName: 'Prince',
            };
            ExecutorsWithOtherNames.pruneFormData(data);
            assert.isUndefined(data.currentNameReason);
            expect(data).to.deep.equal({
                fullName: 'Ed Brown',
                hasOtherName: false
            });
        });

        it('test that otherReason is deleted when executor hasOtherName is false', () => {
            const ExecutorsWithOtherNames = steps.ExecutorsWithOtherNames;
            const data = {
                fullName: 'Ed Brown',
                hasOtherName: false,
                currentNameReason: 'other',
                otherReason: 'Stage Name',
                currentName: 'Prince',
            };
            ExecutorsWithOtherNames.pruneFormData(data);
            assert.isUndefined(data.currentName);
            assert.isUndefined(data.otherReason);
            expect(data).to.deep.equal({
                fullName: 'Ed Brown',
                hasOtherName: false
            });
        });
    });

});
