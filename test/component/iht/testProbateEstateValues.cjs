'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeceasedAlias = require('app/steps/ui/deceased/alias');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');
const config = require('config');
const {expect} = require('chai');
const initSteps = require('../../../app/core/initSteps');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const ProbateEstateValues = steps.ProbateEstateValues;

describe('Tests for Probate Estate Values ', () => {
    let testWrapper;
    const expectedNextUrlForDeceasedAlias = DeceasedAlias.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ProbateEstateValues', {ft_excepted_estates: true});
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ProbateEstateValues', null, null, [], false, {type: caseTypes.INTESTACY});

        it('test content loaded on the page 207', (done) => {
            const contentToExclude = [
                'question421',
                'questionNoIHT',
                'question205',
                'question400',
                'hint205',
                'hint421',
                'hint400part1',
                'hint400part2',
                'hint205part1',
                'hint205part2',
                'hint421part1',
                'hint421part2',
                'hintNoIHTPart1',
                'hintNoIHTPart2',
                'hintNoIHTPart3',
                'grossHint205',
                'grossHint421',
                'grossHint400',
                'grossHintNoIHT',
                'netHint205',
                'netHint421',
                'netHint400',
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
                },
                deceased: {
                    'dod-date': '2022-12-31'
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
                'question205', 'question207', 'questionNoIHT', 'question400', 'hint205', 'hint207', 'hint400part1',
                'hint400part2', 'hint205part1', 'hint205part2', 'hintNoIHTPart1', 'hintNoIHTPart2', 'hintNoIHTPart3',
                'grossHint205', 'grossHint207', 'grossHint400', 'grossHintNoIHT', 'netHint205', 'netHint207',
                'netHint400', 'netHintNoIHT', 'netValueSummary', 'grossValueSummary'
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

                },
                deceased: {
                    'dod-date': '2022-12-31'
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
                'question205', 'question207', 'question421', 'question400', 'hint205', 'hint207', 'hint400part1',
                'hint400part2', 'hint205part1', 'hint205part2', 'hint421part1', 'hint421part2', 'hint421',
                'grossHint205', 'grossHint207', 'grossHint421', 'grossHint400', 'netHint205', 'netHint207',
                'netHint421', 'netHint400', 'netValueSummary', 'grossValueSummary'
            ];

            const sessionData = {
                type: caseTypes.GOP,
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
                iht: {
                    estateValueCompleted: 'optionNo'
                },
                deceased: {
                    'dod-date': '2022-12-31'
                }
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

        it('test content loaded on the page for iht400 form completed', (done) => {
            const contentToExclude = [
                'question205',
                'question207',
                'questionNoIHT',
                'question421',
                'hint205',
                'hint207',
                'hint421',
                'grossHint205',
                'grossHint207',
                'grossHint421',
                'grossHintNoIHT',
                'hint205part1',
                'hint205part2',
                'hint421part1',
                'hint421part2',
                'hintNoIHTPart1',
                'hintNoIHTPart2',
                'hintNoIHTPart3',
                'netHint205',
                'netHint207',
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
                    ihtFormEstateId: 'optionIHT400',
                    estateValueCompleted: 'optionYes'
                },
                deceased: {
                    'dod-date': '2020-12-31'
                }
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

    describe('getContextData()', () => {
        let ctx;
        let req;

        it('should return the context with the IHT threshold', (done) => {
            req = {
                session: {
                    form: {
                        deceased: {
                            'dod-date': '2016-10-12'
                        },
                        iht: {
                            netValueField: '260000'
                        }
                    },
                    featureToggles: {
                        ft_excepted_estates: true
                    },
                }
            };
            ctx = ProbateEstateValues.getContextData(req);
            expect(ctx.ihtThreshold).to.equal(250000);
            expect(ctx.lessThanOrEqualToIhtThreshold).to.equal(false);
            done();
        });
        it('should return false with the IHT threshold for died after 2020', (done) => {
            req = {
                session: {
                    form: {
                        deceased: {
                            'dod-date': '2021-01-01'
                        },
                        iht: {
                            netValueField: '123'
                        }
                    },
                    featureToggles: {
                        ft_excepted_estates: true
                    }
                }
            };
            ctx = ProbateEstateValues.getContextData(req);
            expect(ctx.ihtThreshold).to.equal(270000);
            expect(ctx.lessThanOrEqualToIhtThreshold).to.equal(true);
            done();
        });
        it('should return true for DOD after 2022', (done) => {
            req = {
                session: {
                    form: {
                        deceased: {
                            'dod-date': '2023-10-12'
                        },
                        iht: {
                            netValueField: '123'
                        }
                    },
                    featureToggles: {
                        ft_excepted_estates: true
                    }
                }
            };
            ctx = ProbateEstateValues.getContextData(req);
            expect(ctx.lessThanOrEqualToIhtThreshold).to.equal(true);
            done();
        });
    });
    describe('nextStepOptions()', () => {
        it('should return the correct next step options', (done) => {
            const ctx = {
                netValue: 200000
            };
            const result = ProbateEstateValues.nextStepOptions(ctx);
            expect(result).to.deep.equal({
                options: [{
                    key: 'lessThanOrEqualToIhtThreshold',
                    value: true,
                    choice: 'lessThanOrEqualToIhtThreshold'
                }]
            });
            done();
        });
    });
});
