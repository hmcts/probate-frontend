'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeceasedAlias = require('app/steps/ui/deceased/alias');
const AssetsOutside = require('app/steps/ui/iht/assetsoutside');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('iht-paper', () => {
    let testWrapper;
    const expectedNextUrlForDeceasedAlias = DeceasedAlias.getUrl();
    const expectedNextUrlForAssetsOutside = AssetsOutside.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('IhtPaper');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('IhtPaper');

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
            const errorsToTest = ['form'];

            testWrapper.testErrors(done, {}, 'required', errorsToTest);
        });

        it('test iht paper schema validation when form 205 is chosen', (done) => {
            const data = {
                form: 'optionIHT205'
            };
            const errorsToTest = ['grossValueFieldIHT205', 'netValueFieldIHT205'];

            testWrapper.testErrors(done, data, 'required', errorsToTest);
        });

        it('test iht paper schema validation when form 205 is chosen, and net value is greater than gross value', (done) => {
            const data = {
                form: 'optionIHT205',
                grossValueFieldIHT205: 999,
                netValueFieldIHT205: 1000
            };
            const errorsToTest = ['netValueFieldIHT205'];

            testWrapper.testErrors(done, data, 'netValueGreaterThanGross', errorsToTest);
        });

        it('test iht paper schema validation when form 207 is chosen', (done) => {
            const data = {
                form: 'optionIHT207'
            };
            const errorsToTest = ['grossValueFieldIHT207', 'netValueFieldIHT207'];

            testWrapper.testErrors(done, data, 'required', errorsToTest);
        });

        it('test iht paper schema validation when form 207 is chosen, and net value is greater than gross value', (done) => {
            const data = {
                form: 'optionIHT207',
                grossValueFieldIHT207: 999,
                netValueFieldIHT207: 1000
            };
            const errorsToTest = ['netValueFieldIHT207'];

            testWrapper.testErrors(done, data, 'netValueGreaterThanGross', errorsToTest);
        });

        it('test iht paper schema validation when form 400 is chosen', (done) => {
            const data = {
                form: 'optionIHT400421'
            };
            const errorsToTest = ['grossValueFieldIHT400421', 'netValueFieldIHT400421'];

            testWrapper.testErrors(done, data, 'required', errorsToTest);
        });

        it('test iht paper schema validation when form 400 is chosen, and net value is greater than gross value', (done) => {
            const data = {
                form: 'optionIHT400421',
                grossValueFieldIHT400421: 999,
                netValueFieldIHT400421: 1000
            };
            const errorsToTest = ['netValueFieldIHT400421'];

            testWrapper.testErrors(done, data, 'netValueGreaterThanGross', errorsToTest);
        });

        it(`test it redirects to Deceased Alias page: ${expectedNextUrlForDeceasedAlias}`, (done) => {
            const data = {
                form: 'optionIHT205',
                grossValueFieldIHT205: '100000',
                netValueFieldIHT205: '9999'
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
                        form: 'optionIHT205',
                        grossValueFieldIHT205: '300000',
                        netValueFieldIHT205: '260000'
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
                        form: 'optionIHT205',
                        grossValueFieldIHT205: '300000',
                        netValueFieldIHT205: '280000'
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
                        form: 'optionIHT205',
                        grossValueFieldIHT205: '300000',
                        netValueFieldIHT205: '240000'
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
                        form: 'optionIHT205',
                        grossValueFieldIHT205: '300000',
                        netValueFieldIHT205: '260000'
                    };
                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForAssetsOutside}`);
                });
        });
    });
});
