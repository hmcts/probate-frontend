'use strict';

const initSteps = require('app/core/initSteps');
const {assert, expect} = require('chai');
const co = require('co');
const rewire = require('rewire');
const Summary = rewire('app/steps/ui/summary');
const probateJourney = require('app/journeys/probate');
const coreContextMockData = require('../data/core-context-mock-data.json');

describe('Summary', () => {
    const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
    let section;
    let templatePath;
    let i18next;
    let schema;

    beforeEach(() => {
        section = 'summary';
        templatePath = 'summary';
        i18next = {};
        schema = {
            $schema: 'http://json-schema.org/draft-04/schema#',
            properties: {}
        };
    });

    describe('handleGet()', () => {
        it('ctx.executorsWithOtherNames returns array of execs with other names', (done) => {
            const expectedResponse = ['Prince', 'Cher'];

            let ctx = {
                session: {
                    form: {},
                    journey: probateJourney
                }
            };
            const formdata = {executors: {list: [{fullName: 'Prince', hasOtherName: true}, {fullName: 'Cher', hasOtherName: true}]}};
            const summary = new Summary(steps, section, templatePath, i18next, schema);

            co(function* () {
                [ctx] = yield summary.handleGet(ctx, formdata);
                assert.deepEqual(ctx.executorsWithOtherNames, expectedResponse);
                done();
            });
        });

        it('executorsWithOtherNames returns empty when hasOtherName is false', (done) => {
            const expectedResponse = [];
            let ctx = {
                session: {
                    form: {},
                    journey: probateJourney
                }
            };
            const formdata = {executors: {list: [{fullName: 'Prince', hasOtherName: false}, {fullName: 'Cher', hasOtherName: false}]}};
            const summary = new Summary(steps, section, templatePath, i18next, schema);

            co(function* () {
                [ctx] = yield summary.handleGet(ctx, formdata);
                assert.deepEqual(ctx.executorsWithOtherNames, expectedResponse);
                done();
            });
        });

        it('executorsWithOtherNames returns empty when list is empty', (done) => {
            const expectedResponse = [];
            let ctx = {
                session: {
                    form: {},
                    journey: probateJourney
                }
            };
            const formdata = {executors: {list: []}};
            const summary = new Summary(steps, section, templatePath, i18next, schema);

            co(function* () {
                [ctx] = yield summary.handleGet(ctx, formdata);
                assert.deepEqual(ctx.executorsWithOtherNames, expectedResponse);
                done();
            });
        });
    });

    describe('getContextData()', () => {
        it('[PROBATE] return the correct properties in ctx', (done) => {
            const req = {
                sessionID: 'dummy_sessionId',
                session: {
                    language: 'en',
                    form: {
                        ccdCase: {
                            id: 1234567890123456,
                            state: 'Pending'
                        },
                        caseType: 'gop',
                        deceased: {
                            firstName: 'Dee',
                            lastName: 'Ceased',
                            'dod-date': '2022-02-02',
                            'dod-formattedDate': '2 February 2022'
                        },
                        iht: {
                            netValue: 300000
                        }
                    }
                },
                authToken: '1234'
            };
            const Summary = steps.Summary;
            const ctx = Summary.getContextData(req);
            expect(ctx).to.deep.equal({
                ...coreContextMockData,
                authToken: '1234',
                alreadyDeclared: false,
                deceasedAliasQuestion: 'Did Dee Ceased have assets in another name?',
                diedEnglandOrWalesQuestion: 'Did Dee Ceased die in England or Wales?',
                deceasedMarriedQuestion: 'Did Dee Ceased get married or enter into a civil partnership after the will was signed?',
                ihtTotalNetValue: 300000,
                exceptedEstateDodAfterThreshold: true,
                readyToDeclare: false,
                session: {
                    language: 'en',
                    form: {
                        ccdCase: {
                            id: 1234567890123456,
                            state: 'Pending'
                        },
                        caseType: 'gop',
                        deceased: {
                            firstName: 'Dee',
                            lastName: 'Ceased',
                            'dod-date': '2022-02-02',
                            'dod-formattedDate': '2 February 2022'
                        },
                        iht: {
                            netValue: 300000
                        },
                        summary: {
                            readyToDeclare: false
                        }
                    }
                },
                sessionID: 'dummy_sessionId',
                softStop: false
            });
            done();
        });

        it('[INTESTACY] return the correct properties in ctx', (done) => {
            const req = {
                sessionID: 'dummy_sessionId',
                session: {
                    language: 'en',
                    form: {
                        ccdCase: {
                            id: 1234567890123456,
                            state: 'Pending'
                        },
                        caseType: 'intestacy',
                        deceased: {
                            'firstName': 'Dee',
                            'lastName': 'Ceased',
                            'dod-date': '2015-02-02',
                            'dod-formattedDate': '2 February 2015'
                        },
                        iht: {
                            netValue: 300000,
                            netValueAssetsOutside: 250000,
                            assetsOutside: 'optionYes'
                        }
                    }
                },
                authToken: '12345'
            };
            const Summary = steps.Summary;
            const ctx = Summary.getContextData(req);
            expect(ctx).to.deep.equal({
                ...coreContextMockData,
                authToken: '12345',
                alreadyDeclared: false,
                deceasedAliasQuestion: 'Did Dee Ceased have assets in another name?',
                diedEnglandOrWalesQuestion: 'Did Dee Ceased die in England or Wales?',
                deceasedAllChildrenOver18Question: 'Are all of Dee Ceased&rsquo;s children over 18?',
                deceasedAnyChildrenQuestion: 'Did Dee Ceased have any children?',
                deceasedAnyDeceasedChildrenQuestion: 'Did any of Dee Ceased&rsquo;s children die before 2 February 2015?',
                deceasedAnyOtherChildrenQuestion: 'Did Dee Ceased have any other children?',
                deceasedDivorcePlaceQuestion: 'Did the separation take place in England or Wales?',
                deceasedMaritalStatusQuestion: 'What was Dee Ceased&rsquo;s marital status?',
                deceasedSpouseNotApplyingReasonQuestion: 'Why isn&rsquo;t Dee Ceased&rsquo;s spouse applying?',
                ihtThreshold: 250000,
                ihtTotalNetValue: 550000,
                ihtTotalNetValueGreaterThanIhtThreshold: true,
                caseType: 'intestacy',
                readyToDeclare: false,
                exceptedEstateDodAfterThreshold: false,
                session: {
                    language: 'en',
                    form: {
                        ccdCase: {
                            id: 1234567890123456,
                            state: 'Pending'
                        },
                        caseType: 'intestacy',
                        deceased: {
                            'dod-date': '2015-02-02',
                            'dod-formattedDate': '2 February 2015',
                            'firstName': 'Dee',
                            'lastName': 'Ceased'
                        },
                        iht: {
                            assetsOutside: 'optionYes',
                            netValue: 300000,
                            netValueAssetsOutside: 250000
                        },
                        summary: {
                            readyToDeclare: false
                        }
                    }
                },
                sessionID: 'dummy_sessionId',
                softStop: false
            });
            done();
        });

        it('ctx.uploadedDocuments returns an array of uploaded documents when there are uploaded documents', (done) => {
            const req = {
                session: {
                    form: {
                        documents: {
                            uploads: [{filename: 'screenshot1.png'}, {filename: 'screenshot2.png'}]
                        },
                        deceased: {
                        },
                        iht: {
                            estateNetQualifyingValue: {
                            }
                        }
                    }
                },
            };
            const Summary = steps.Summary;
            const ctx = Summary.getContextData(req);
            expect(ctx.uploadedDocuments).to.deep.equal(['screenshot1.png', 'screenshot2.png']);
            done();
        });

        it('ctx.uploadedDocuments returns an empty array of uploaded documents when there are no uploaded documents', (done) => {
            const req = {
                session: {
                    form: {
                        documents: {
                            uploads: []
                        },
                        deceased: {
                        },
                        iht: {
                            estateNetQualifyingValue: {
                            }
                        }
                    }
                },
            };
            const Summary = steps.Summary;
            const ctx = Summary.getContextData(req);
            expect(ctx.uploadedDocuments).to.deep.equal([]);
            done();
        });
    });
});
