'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeceasedAlias = require('app/steps/ui/deceased/alias');
const AssetsOutside = require('app/steps/ui/iht/assetsoutside');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('iht-value', () => {
    let testWrapper;
    const expectedNextUrlForDeceasedAlias = DeceasedAlias.getUrl();
    const expectedNextUrlForAssetsOutside = AssetsOutside.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('IhtValue');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('IhtValue');

        it('test content loaded on the page', (done) => {
            const sessionData = {
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

        it('test iht value schema validation when net value is greater than gross value', (done) => {
            const data = {
                grossValueField: 12345,
                netValueField: 123456
            };
            const errorsToTest = ['netValueField'];

            testWrapper.testErrors(done, data, 'netValueGreaterThanGross', errorsToTest);
        });

        it(`test it redirects to Deceased Alias page: ${expectedNextUrlForDeceasedAlias}`, (done) => {
            const data = {
                grossValueField: '123456',
                netValueField: '12345'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedAlias);
        });

        it(`[INTESTACY] test it redirects to Deceased Alias page for DoD between 1 Oct 2014 and 5 Feb 2020: /intestacy${expectedNextUrlForDeceasedAlias}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    'dod-date': '2016-05-12'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        grossValueField: '300000',
                        netValueField: '260000'
                    };
                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForDeceasedAlias}`);
                });
        });

        it(`[INTESTACY] test it redirects to Deceased Alias page for DoD after 5 Feb 2020: /intestacy${expectedNextUrlForDeceasedAlias}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    'dod-date': '2020-03-12'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        grossValueField: '300000',
                        netValueField: '280000'
                    };
                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForDeceasedAlias}`);
                });
        });

        it(`[INTESTACY] test it redirects to Assets Outside UK page for DoD between 1 Oct 2014 and 5 Feb 2020: /intestacy${expectedNextUrlForAssetsOutside}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    'dod-date': '2016-05-12'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        grossValueField: '300000',
                        netValueField: '240000'
                    };
                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForAssetsOutside}`);
                });
        });

        it(`[INTESTACY] test it redirects to Assets Outside UK page for DoD after 5 Feb 2020: /intestacy${expectedNextUrlForAssetsOutside}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    'dod-date': '2020-03-12'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        grossValueField: '300000',
                        netValueField: '260000'
                    };
                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForAssetsOutside}`);
                });
        });
    });
});
