'use strict';

const TestWrapper = require('test/util/TestWrapper');
const Iht207Estate = require('app/steps/ui/iht/iht207estate');
const Iht421Estate = require('app/steps/ui/iht/iht421estate');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('Tests for IHT Estate Valued', () => {
    let testWrapper;
    const expectedNextUrlForIht207Estate = Iht207Estate.getUrl();
    const expectedNextUrlForIht421Estate = Iht421Estate.getUrl();

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

        it(`test it redirects to next page: ${expectedNextUrlForIht207Estate}`, (done) => {
            const data = {
                ihtFormEstateId: 'optionIHT207'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForIht207Estate);
        });

        it(`test it redirects to next page: ${expectedNextUrlForIht421Estate}`, (done) => {
            const data = {
                ihtFormEstateId: 'optionIHT400421'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForIht421Estate);
        });
    });
});
