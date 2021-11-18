'use strict';

const TestWrapper = require('test/util/TestWrapper');
const IhtEstateValues = require('app/steps/ui/iht/ihtestatevalues');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('Tests for IHT Estate Valued', () => {
    let testWrapper;
    const expectedNextUrlForIhtEstateValues = IhtEstateValues.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('IhtEstateForm');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('IhtEstateValued', null, null, [], false, {type: caseTypes.INTESTACY});

        it('test content loaded on the page', (done) => {
            const sessionData = {
                type: caseTypes.GOP,
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to next page: ${expectedNextUrlForIhtEstateValues}`, (done) => {
            const data = {
                ihtFormEstateId: 'optionIHT207'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForIhtEstateValues);
        });

    });
});
