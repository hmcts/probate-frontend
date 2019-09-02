'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ValueAssetsOutside = require('app/steps/ui/iht/valueassetsoutside');
const DeceasedAlias = require('app/steps/ui/deceased/alias');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');
const content = require('app/resources/en/translation/iht/assetsoutside');
const caseTypes = require('app/utils/CaseTypes');

describe('assets-outside-england-wales', () => {
    let testWrapper;
    const expectedNextUrlForValueAssetsOutside = ValueAssetsOutside.getUrl();
    const expectedNextUrlForDeceasedAlias = DeceasedAlias.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('AssetsOutside');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('AssetsOutside');

        it('test content loaded on the page', (done) => {
            const sessionData = {
                deceased: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {deceasedName: 'John Doe'};

                    testWrapper.testContent(done, [], contentData);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required', []);
        });

        it(`test it redirects to value of assets outside page: ${expectedNextUrlForValueAssetsOutside}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        assetsOutside: content.optionYes
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForValueAssetsOutside);
                });
        });

        it(`test it redirects to Deceased Alias page: ${expectedNextUrlForDeceasedAlias}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        assetsOutside: content.optionNo
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedAlias);
                });
        });
    });
});
