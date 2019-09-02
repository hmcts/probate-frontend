'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeceasedAlias = require('app/steps/ui/deceased/alias');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('value-assets-outside-england-wales', () => {
    let testWrapper;
    const expectedNextUrlForDeceasedAlias = DeceasedAlias.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ValueAssetsOutside');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('ValueAssetsOutside');

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done, [], {});
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required', []);
        });

        it(`test it redirects to next page: ${expectedNextUrlForDeceasedAlias}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        netValueAssetsOutsideField: '300000'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedAlias);
                });
        });
    });
});
