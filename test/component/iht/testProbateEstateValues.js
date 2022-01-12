'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeceasedAlias = require('app/steps/ui/deceased/alias');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');
const config = require('config');

describe('Tests for Probate Estate Values ', () => {
    let testWrapper;
    const expectedNextUrlForDeceasedAlias = DeceasedAlias.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ProbateEstateValues');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe.only('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ProbateEstateValues', null, null, [], false, {type: caseTypes.INTESTACY});

        it('test content loaded on the page 207', (done) => {
            const contentToExclude = [
                'question421',
                'questionNoIHT',
                'hint421',
                'grossHint421',
                'grossHintNoIHT',
                'netHint421',
                'netHintNoIHT',
                'netValueSummary',
                'grossValueSummary'
            ];

            const sessionData = {
                type: caseTypes.GOP,
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
                iht: {
                    ihtFormEstateId: 'optionIHT207',
                    estateValueCompleted: 'optionYes'
                }

            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, {}, contentToExclude);
                });
        });

        it('test content loaded on the page 421', (done) => {
            const contentToExclude = [
                'question207',
                'questionNoIHT',
                'hint207',
                'grossHint207',
                'grossHintNoIHT',
                'netHint207',
                'netHintNoIHT',
                'netValueSummary',
                'grossValueSummary'
            ];

            const sessionData = {
                type: caseTypes.GOP,
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
                iht: {
                    ihtFormEstateId: 'optionIHT400421',
                    estateValueCompleted: 'optionYes'

                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, {}, contentToExclude);
                });
        });

        it('test content loaded on the page for no iht form completed', (done) => {
            const contentToExclude = [
                'question207',
                'question421',
                'hint207',
                'hint421',
                'grossHint207',
                'grossHint421',
                'netHint207',
                'netHint421',
                'netValueSummary',
                'grossValueSummary'
            ];

            const sessionData = {
                type: caseTypes.GOP,
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
            };

            const contentData = {
                ihtGifts: config.links.ihtGifts
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to next page: ${expectedNextUrlForDeceasedAlias}`, (done) => {
            const data = {
                grossValueField: '300000',
                netValueField: '260000'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedAlias);

        });
    });
});
