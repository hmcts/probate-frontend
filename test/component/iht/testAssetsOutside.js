'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ValueAssetsOutside = require('app/steps/ui/iht/valueassetsoutside');
const DeceasedAlias = require('app/steps/ui/deceased/alias');
const testCommonContent = require('test/component/common/testCommonContent.js');
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
        testCommonContent.runTest('AssetsOutside', null, null, [], false, {type: caseTypes.INTESTACY});

        it('test content loaded on the page', (done) => {
            const sessionData = {
                type: caseTypes.INTESTACY,
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
                deceased: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {deceasedName: 'John Doe'};

                    testWrapper.testContent(done, contentData);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to value of assets outside page: /intestacy${expectedNextUrlForValueAssetsOutside}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        assetsOutside: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForValueAssetsOutside}`);
                });
        });

        it(`test it redirects to Deceased Alias page: /intestacy${expectedNextUrlForDeceasedAlias}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        assetsOutside: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForDeceasedAlias}`);
                });
        });
    });
});
