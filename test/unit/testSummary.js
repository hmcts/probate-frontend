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
            $schema: 'http://json-schema.org/draft-07/schema',
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
                            'dod-formattedDate': '2 February 2022',
                            aliasFirstNameOnWill: 'firstNameOnWill',
                            aliasLastNameOnWill: 'lastNameOnWill'
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
                codicilPresent: false,
                deceasedAliasQuestion: 'Did Dee Ceased have assets in another name?',
                deceasedDobQuestion: 'What was Dee Ceased’s date of birth?',
                deceasedDodQuestion: 'What was the date that Dee Ceased died?',
                deceasedHadLateSpouseOrCivilPartnerQuestion: 'Did Dee Ceased have a husband, wife or civil partner who died before them?',
                deceasedAddressQuestion: 'What was Dee Ceased\'s permanent address at the time of their death?',
                diedEnglandOrWalesQuestion: 'Did Dee Ceased die in England or Wales?',
                deceasedNameAsOnWillQuestion: 'Is Dee Ceased exactly how the name is written on the will?',
                deceasedMarriedQuestion: 'Did Dee Ceased get married or form a civil partnership after the will was signed?',
                deceasedWrittenWishesQuestion: 'Did Dee Ceased leave any other written wishes?',
                ihtTotalNetValue: 300000,
                ihtUnusedAllowanceClaimedQuestion: 'Are you claiming the unused Inheritance Tax allowance of Dee Ceased’s husband, wife or civil partner?',
                exceptedEstateDodAfterThreshold: true,
                readyToDeclare: false,
                aliasNameOnWill: 'firstNameOnWill lastNameOnWill',
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
                            'dod-formattedDate': '2 February 2022',
                            aliasFirstNameOnWill: 'firstNameOnWill',
                            aliasLastNameOnWill: 'lastNameOnWill'
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
                deceasedAddressQuestion: 'What was Dee Ceased\'s permanent address at the time of their death?',
                diedEnglandOrWalesQuestion: 'Did Dee Ceased die in England or Wales?',
                deceasedAllChildrenOver18Question: 'Are all of Dee Ceased&rsquo;s children 18 or older?',
                deceasedAnyChildrenQuestion: 'Did Dee Ceased have any children?',
                deceasedAnyPredeceasedChildrenQuestion: 'Did any of these children die before Dee Ceased?',
                deceasedAnyOtherChildrenQuestion: 'Did Dee Ceased have any other children?',
                deceasedDivorceDate: 'Date of legal separation',
                deceasedDivorceDateKnownQuestion: 'Do you know the date the legal separation took place?',
                deceasedDivorcePlaceQuestion: 'Did the legal separation take place in England or Wales?',
                deceasedDobQuestion: 'What was Dee Ceased’s date of birth?',
                deceasedDodQuestion: 'What was the date that Dee Ceased died?',
                deceasedDivorcePlaceQuestion: 'Did the separation take place in England or Wales?',
                deceasedHadLateSpouseOrCivilPartnerQuestion: 'Did Dee Ceased have a husband, wife or civil partner who died before them?',
                deceasedMaritalStatusQuestion: 'What was Dee Ceased&rsquo;s marital status?',
                deceasedSpouseNotApplyingReasonQuestion: 'Why is Dee Ceased&rsquo;s husband, wife or civil partner not applying?',
                deceasedWrittenWishesQuestion: 'Did Dee Ceased leave any other written wishes?',
                ihtThreshold: 250000,
                ihtTotalNetValue: 550000,
                ihtTotalNetValueGreaterThanIhtThreshold: true,
                ihtUnusedAllowanceClaimedQuestion: 'Are you claiming the unused Inheritance Tax allowance of Dee Ceased’s husband, wife or civil partner?',
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

    describe('generateFields()', () => {
        it('it should set Google analytics enabled to true', (done) => {
            const ctx = {
                session: {
                    form: {},
                    journey: probateJourney
                },
                isGaEnabled: true
            };
            const summary = new Summary(steps, section, templatePath, i18next, schema);
            const fields = summary.generateFields('en', ctx, [], {});
            expect(fields.isGaEnabled.value).to.deep.equal('true');
            done();
        });
    });
});
