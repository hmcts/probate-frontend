'use strict';

const TestWrapper = require('test/util/TestWrapper');
const HmrcLetter = require('app/steps/ui/iht/hmrcletter');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('Tests for Probate Estate Valued', () => {
    let testWrapper;
    const expectedNextUrlForHmrcLetter = HmrcLetter.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('IhtEstateForm');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('IhtEstateForm', null, null, [], false, {type: caseTypes.INTESTACY});

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

        it(`test it redirects to next page: ${expectedNextUrlForHmrcLetter}`, (done) => {
            const data = {
                ihtFormEstateId: 'optionIHT207'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForHmrcLetter);
        });

    });
});
