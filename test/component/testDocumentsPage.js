// eslint-disable-line max-lines

'use strict';

const TestWrapper = require('test/util/TestWrapper');
const config = require('config');
const caseTypes = require('app/utils/CaseTypes');
const ThankYou = require('app/steps/ui/thankyou');
const testCommonContent = require('test/component/common/testCommonContent.js');

describe('documents', () => {
    let testWrapper;
    const expectedNextUrlForThankYouPage = ThankYou.getUrl();
    let sessionData;
    let contentData;

    beforeEach(() => {
        sessionData = {
            caseType: caseTypes.GOP,
            ccdCase: {
                state: 'CasePrinted',
                id: 1234123512361237
            },
            declaration: {
                declarationCheckbox: 'true'
            },
            payment: {
                total: 0
            },
        };
        contentData = {
            ccdReferenceNumber: '1234-1235-1236-1237',
        };
        testWrapper = new TestWrapper('Documents');

    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('Documents', null, null, [], false, {
            ccdCase: {state: 'CasePrinted'},
            declaration: {declarationCheckbox: 'true'},
            payment: {total: 0},
            caseType: caseTypes.GOP
        });

        describe('Probate Journey', () => {
            it('test correct content loaded on the page no foreign death cert, single executor', (done) => {
                testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                        const contentToExclude = [
                            'intestacyHeader',
                            'documentsParagraph5',
                            'checklist-item1-application-coversheet',
                            'checklist-item2-no-codicils',
                            'checklist-item2-codicils',
                            'checklist-item3-codicils-written-wishes',
                            'checklist-item4-interim-death-cert',
                            'checklist-item4-foreign-death-cert',
                            'checklist-item4-foreign-death-cert-translation',
                            'checklist-item5-foreign-death-cert-PA19',
                            'checklist-item6-spouse-renouncing',
                            'checklist-item7-iht205',
                            'checklist-item8-renunciated',
                            'checklist-item9-deed-poll',
                            'checklist-item10-iht207',
                            'checklist-item11-spouse-giving-up-admin-rights-PA16',
                            'no-docs-required'
                        ];

                        testWrapper.testContent(done, contentData, contentToExclude);
                    });
            });

            it('test correct content loaded on the page codicils, no foreign death cert, single executor', (done) => {
                sessionData.will = {
                    codicils: 'optionYes',
                    codicilsNumber: '1'
                };
                testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                        const contentToExclude = [
                            'intestacyHeader',
                            'documentsParagraph5',
                            'checklist-item2-no-codicils',
                            'checklist-item3-codicils-written-wishes',
                            'checklist-item4-interim-death-cert',
                            'checklist-item4-foreign-death-cert',
                            'checklist-item4-foreign-death-cert-translation',
                            'checklist-item5-foreign-death-cert-PA19',
                            'checklist-item6-spouse-renouncing',
                            'checklist-item7-iht205',
                            'checklist-item8-renunciated',
                            'checklist-item9-deed-poll',
                            'checklist-item10-iht207',
                            'checklist-item11-spouse-giving-up-admin-rights-PA16',
                            'no-docs-required'
                        ];

                        testWrapper.testContent(done, contentData, contentToExclude);
                    });
            });

            it('test correct content loaded on the page no foreign death cert, multiple executors', (done) => {
                sessionData.executors = {
                    list: [
                        {isApplying: true, isApplicant: true},
                        {isApplying: true}
                    ]
                };

                testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                        const contentToExclude = [
                            'intestacyHeader',
                            'documentsParagraph5',
                            'checklist-item2-codicils',
                            'checklist-item3-codicils-written-wishes',
                            'checklist-item4-interim-death-cert',
                            'checklist-item4-foreign-death-cert',
                            'checklist-item4-foreign-death-cert-translation',
                            'checklist-item5-foreign-death-cert-PA19',
                            'checklist-item6-spouse-renouncing',
                            'checklist-item7-iht205',
                            'checklist-item8-renunciated',
                            'checklist-item9-deed-poll',
                            'checklist-item10-iht207',
                            'checklist-item11-spouse-giving-up-admin-rights-PA16',
                            'no-docs-required'
                        ];

                        testWrapper.testContent(done, contentData, contentToExclude);
                    });
            });

            it('test correct content loaded on the page no foreign death cert, multiple executors, with optionRenunciated', (done) => {
                sessionData.executors = {
                    executorsNumber: 2,
                    list: [
                        {isApplying: true, isApplicant: true},
                        {notApplyingKey: 'optionRenunciated'}
                    ]
                };

                testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                        const contentToExclude = [
                            'intestacyHeader',
                            'documentsParagraph5',
                            'checklist-item2-codicils',
                            'checklist-item3-codicils-written-wishes',
                            'checklist-item4-interim-death-cert',
                            'checklist-item4-foreign-death-cert',
                            'checklist-item4-foreign-death-cert-translation',
                            'checklist-item5-foreign-death-cert-PA19',
                            'checklist-item6-spouse-renouncing',
                            'checklist-item7-iht205',
                            'checklist-item9-deed-poll',
                            'checklist-item10-iht207',
                            'checklist-item11-spouse-giving-up-admin-rights-PA16',
                            'no-docs-required'
                        ];
                        contentData.renunciationFormLink = config.links.renunciationForm;

                        testWrapper.testContent(done, contentData, contentToExclude);
                    });
            });

            it('test correct content loaded on the page no foreign death cert, single executor, no alias, specified registry address', (done) => {
                sessionData.registry = {
                    address: '1 Red Street\nLondon\nO1 1OL'
                };

                testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                        const contentToExclude = [
                            'intestacyHeader',
                            'documentsParagraph5',
                            'checklist-item2-codicils',
                            'checklist-item3-codicils-written-wishes',
                            'checklist-item4-interim-death-cert',
                            'checklist-item4-foreign-death-cert',
                            'checklist-item4-foreign-death-cert-translation',
                            'checklist-item5-foreign-death-cert-PA19',
                            'checklist-item6-spouse-renouncing',
                            'checklist-item7-iht205',
                            'checklist-item8-renunciated',
                            'checklist-item9-deed-poll',
                            'checklist-item10-iht207',
                            'address',
                            'checklist-item11-spouse-giving-up-admin-rights-PA16',
                            'no-docs-required'
                        ];

                        testWrapper.testContent(done, contentData, contentToExclude);
                    });
            });

            it('test correct content loaded on the page no foreign death cert, single executor, no alias, online IHT', (done) => {
                sessionData.iht = {
                    method: 'optionOnline'
                };

                testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                        const contentToExclude = [
                            'intestacyHeader',
                            'documentsParagraph5',
                            'checklist-item2-codicils',
                            'checklist-item3-codicils-written-wishes',
                            'checklist-item4-interim-death-cert',
                            'checklist-item4-foreign-death-cert',
                            'checklist-item4-foreign-death-cert-translation',
                            'checklist-item5-foreign-death-cert-PA19',
                            'checklist-item6-spouse-renouncing',
                            'checklist-item7-iht205',
                            'checklist-item8-renunciated',
                            'checklist-item9-deed-poll',
                            'checklist-item10-iht207',
                            'checklist-item11-spouse-giving-up-admin-rights-PA16',
                            'no-docs-required'
                        ];

                        testWrapper.testContent(done, contentData, contentToExclude);
                    });
            });

            it('test correct content loaded on the page no foreign death cert, single executor, no alias, paper IHT, 207 or 400', (done) => {
                sessionData.iht = {
                    method: 'optionPaper',
                    form: 'optionIHT207'
                };

                testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                        const contentToExclude = [
                            'intestacyHeader',
                            'documentsParagraph5',
                            'checklist-item2-codicils',
                            'checklist-item3-codicils-written-wishes',
                            'checklist-item4-interim-death-cert',
                            'checklist-item4-foreign-death-cert',
                            'checklist-item4-foreign-death-cert-translation',
                            'checklist-item5-foreign-death-cert-PA19',
                            'checklist-item6-spouse-renouncing',
                            'checklist-item7-iht205',
                            'checklist-item8-renunciated',
                            'checklist-item9-deed-poll',
                            'checklist-item11-spouse-giving-up-admin-rights-PA16',
                            'no-docs-required'
                        ];

                        testWrapper.testContent(done, contentData, contentToExclude);
                    });
            });

            it('test correct content loaded on the page no foreign death cert, single executor, no alias, excepted estate, iht form 207', (done) => {
                sessionData.iht = {
                    ihtFormEstateId: 'optionIHT207'
                };

                testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                        const contentToExclude = [
                            'intestacyHeader',
                            'documentsParagraph5',
                            'checklist-item2-codicils',
                            'checklist-item3-codicils-written-wishes',
                            'checklist-item4-interim-death-cert',
                            'checklist-item4-foreign-death-cert',
                            'checklist-item4-foreign-death-cert-translation',
                            'checklist-item5-foreign-death-cert-PA19',
                            'checklist-item6-spouse-renouncing',
                            'checklist-item7-iht205',
                            'checklist-item8-renunciated',
                            'checklist-item9-deed-poll',
                            'checklist-item11-spouse-giving-up-admin-rights-PA16',
                            'no-docs-required'
                        ];

                        testWrapper.testContent(done, contentData, contentToExclude);
                    });
            });

            it('test correct content loaded on the page no foreign death cert, single executor, no alias, excepted estate, iht form 400 421', (done) => {
                sessionData.iht = {
                    ihtFormEstateId: 'optionIHT400421'
                };

                testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                        const contentToExclude = [
                            'intestacyHeader',
                            'documentsParagraph5',
                            'checklist-item2-codicils',
                            'checklist-item3-codicils-written-wishes',
                            'checklist-item4-interim-death-cert',
                            'checklist-item4-foreign-death-cert',
                            'checklist-item4-foreign-death-cert-translation',
                            'checklist-item5-foreign-death-cert-PA19',
                            'checklist-item6-spouse-renouncing',
                            'checklist-item7-iht205',
                            'checklist-item8-renunciated',
                            'checklist-item9-deed-poll',
                            'checklist-item10-iht207',
                            'checklist-item11-spouse-giving-up-admin-rights-PA16',
                            'no-docs-required'
                        ];

                        testWrapper.testContent(done, contentData, contentToExclude);
                    });
            });

            it('test correct content loaded on the page, no codicils, single executor, no alias, paper IHT, 205', (done) => {
                sessionData.iht = {
                    method: 'optionPaper',
                    form: 'optionIHT205'
                };

                testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                        const contentToExclude = [
                            'intestacyHeader',
                            'documentsParagraph5',
                            'checklist-item2-codicils',
                            'checklist-item3-codicils-written-wishes',
                            'checklist-item4-interim-death-cert',
                            'checklist-item4-foreign-death-cert',
                            'checklist-item4-foreign-death-cert-translation',
                            'checklist-item5-foreign-death-cert-PA19',
                            'checklist-item6-spouse-renouncing',
                            'checklist-item8-renunciated',
                            'checklist-item9-deed-poll',
                            'checklist-item10-iht207',
                            'checklist-item11-spouse-giving-up-admin-rights-PA16',
                            'no-docs-required'
                        ];

                        testWrapper.testContent(done, contentData, contentToExclude);
                    });
            });

            it('test correct content loaded on the page, one executor name changed by deed poll', (done) => {
                sessionData.executors = {
                    list: [
                        {
                            firstName: 'james',
                            lastName: 'miller',
                            isApplying: true,
                            isApplicant: true,
                            alias: 'jimbo fisher',
                            aliasReason: 'optionMarriage'
                        },
                        {
                            fullName: 'ed brown',
                            isApplying: true,
                            currentName: 'eddie jones',
                            currentNameReason: 'optionDeedPoll'
                        },
                        {
                            fullName: 'bob brown',
                            isApplying: true,
                            currentName: 'bobbie houston',
                            currentNameReason: 'optionDivorce'
                        }
                    ]
                };

                testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                        const contentToExclude = [
                            'intestacyHeader',
                            'documentsParagraph5',
                            'checklist-item2-codicils',
                            'checklist-item3-codicils-written-wishes',
                            'checklist-item4-interim-death-cert',
                            'checklist-item4-foreign-death-cert',
                            'checklist-item4-foreign-death-cert-translation',
                            'checklist-item5-foreign-death-cert-PA19',
                            'checklist-item6-spouse-renouncing',
                            'checklist-item7-iht205',
                            'checklist-item8-renunciated',
                            'checklist-item10-iht207',
                            'checklist-item11-spouse-giving-up-admin-rights-PA16',
                            'no-docs-required'
                        ];
                        contentData.executorCurrentName = 'eddie jones';

                        testWrapper.testContent(done, contentData, contentToExclude);
                    });
            });

            it('test correct content loaded on the page, multiple executor name changed by deed poll', (done) => {
                sessionData.executors = {
                    list: [
                        {
                            firstName: 'james',
                            lastName: 'miller',
                            isApplying: true,
                            isApplicant: true,
                            alias: 'jimbo fisher',
                            aliasReason: 'optionDeedPoll'
                        },
                        {
                            fullName: 'ed brown',
                            isApplying: true,
                            currentName: 'eddie jones',
                            currentNameReason: 'optionDeedPoll'
                        },
                        {
                            fullName: 'bob brown',
                            isApplying: true,
                            currentName: 'bobbie houston',
                            currentNameReason: 'optionOther',
                            otherReason: 'Did not like my name'
                        }
                    ]
                };

                testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                        const contentToExclude = [
                            'intestacyHeader',
                            'documentsParagraph5',
                            'checklist-item2-codicils',
                            'checklist-item3-codicils-written-wishes',
                            'checklist-item4-interim-death-cert',
                            'checklist-item4-foreign-death-cert',
                            'checklist-item4-foreign-death-cert-translation',
                            'checklist-item5-foreign-death-cert-PA19',
                            'checklist-item6-spouse-renouncing',
                            'checklist-item7-iht205',
                            'checklist-item8-renunciated',
                            'checklist-item10-iht207',
                            'checklist-item11-spouse-giving-up-admin-rights-PA16',
                            'no-docs-required'
                        ];
                        contentData.executorCurrentName = [
                            'jimbo fisher',
                            'eddie jones'
                        ];

                        testWrapper.testContent(done, contentData, contentToExclude);
                    });
            });

            it('test correct content loaded on the page no foreign death cert, interim death cert, single executor', (done) => {
                sessionData.deceased = {
                    diedEngOrWales: 'optionYes',
                    deathCertificate: 'optionInterimCertificate'
                };

                testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                        const contentToExclude = [
                            'intestacyHeader',
                            'documentsParagraph5',
                            'checklist-item2-codicils',
                            'checklist-item3-codicils-written-wishes',
                            'checklist-item4-foreign-death-cert',
                            'checklist-item4-foreign-death-cert-translation',
                            'checklist-item5-foreign-death-cert-PA19',
                            'checklist-item6-spouse-renouncing',
                            'checklist-item7-iht205',
                            'checklist-item8-renunciated',
                            'checklist-item9-deed-poll',
                            'checklist-item10-iht207',
                            'checklist-item11-spouse-giving-up-admin-rights-PA16',
                            'no-docs-required'
                        ];

                        testWrapper.testContent(done, contentData, contentToExclude);
                    });
            });

            it('test correct content loaded on the page english foreign death cert, single executor', (done) => {
                sessionData.deceased = {
                    diedEngOrWales: 'optionNo'
                };

                testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                        const contentToExclude = [
                            'intestacyHeader',
                            'documentsParagraph5',
                            'checklist-item2-codicils',
                            'checklist-item3-codicils-written-wishes',
                            'checklist-item4-interim-death-cert',
                            'checklist-item4-foreign-death-cert-translation',
                            'checklist-item5-foreign-death-cert-PA19',
                            'checklist-item6-spouse-renouncing',
                            'checklist-item7-iht205',
                            'checklist-item8-renunciated',
                            'checklist-item9-deed-poll',
                            'checklist-item10-iht207',
                            'checklist-item11-spouse-giving-up-admin-rights-PA16',
                            'no-docs-required'
                        ];

                        testWrapper.testContent(done, contentData, contentToExclude);
                    });
            });

            it('test correct content loaded on the page foreign death cert with separate translation, single executor', (done) => {
                sessionData.deceased = {
                    diedEngOrWales: 'optionNo',
                    foreignDeathCertTranslation: 'optionNo'
                };

                contentData.applicationFormPA19 = config.links.applicationFormPA19;

                testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                        const contentToExclude = [
                            'intestacyHeader',
                            'documentsParagraph5',
                            'checklist-item2-codicils',
                            'checklist-item3-codicils-written-wishes',
                            'checklist-item4-interim-death-cert',
                            'checklist-item6-spouse-renouncing',
                            'checklist-item7-iht205',
                            'checklist-item8-renunciated',
                            'checklist-item9-deed-poll',
                            'checklist-item10-iht207',
                            'checklist-item11-spouse-giving-up-admin-rights-PA16',
                            'no-docs-required'
                        ];

                        testWrapper.testContent(done, contentData, contentToExclude);
                    });
            });

            it('test correct content loaded on the page foreign death cert with no separate translation, single executor', (done) => {
                sessionData.deceased = {
                    diedEngOrWales: 'optionNo',
                    foreignDeathCertTranslation: 'optionYes'
                };

                testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                        const contentToExclude = [
                            'intestacyHeader',
                            'documentsParagraph5',
                            'checklist-item2-codicils',
                            'checklist-item3-codicils-written-wishes',
                            'checklist-item4-interim-death-cert',
                            'checklist-item4-interim-death-cert',
                            'checklist-item4-foreign-death-cert-translation',
                            'checklist-item5-foreign-death-cert-PA19',
                            'checklist-item6-spouse-renouncing',
                            'checklist-item7-iht205',
                            'checklist-item8-renunciated',
                            'checklist-item9-deed-poll',
                            'checklist-item10-iht207',
                            'checklist-item11-spouse-giving-up-admin-rights-PA16',
                            'no-docs-required'
                        ];

                        testWrapper.testContent(done, contentData, contentToExclude);
                    });
            });
        });

        describe('Intestacy Journey', () => {
            it('test correct content loaded on the page with spouse renouncing', (done) => {
                sessionData.deceased = {
                    maritalStatus: 'optionMarried'
                };
                sessionData.applicant = {
                    relationshipToDeceased: 'optionChild'
                };
                sessionData.caseType = caseTypes.INTESTACY;

                contentData.renunciationFormLink = config.links.renunciationForm;

                testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                        const contentToExclude = [
                            'header',
                            'HelpHeading',
                            'helpfulParagraph',
                            'documentsParagraph4',
                            'checklist-item2-codicils',
                            'checklist-item2-no-codicils',
                            'checklist-item3-codicils-written-wishes',
                            'checklist-item4-interim-death-cert',
                            'checklist-item4-foreign-death-cert',
                            'checklist-item4-foreign-death-cert-translation',
                            'checklist-item5-foreign-death-cert-PA19',
                            'checklist-item7-iht205',
                            'checklist-item8-renunciated',
                            'checklist-item9-deed-poll',
                            'checklist-item10-iht207',
                            'checklist-item11-spouse-giving-up-admin-rights-PA16',
                            'no-docs-required'
                        ];

                        testWrapper.testContent(done, contentData, contentToExclude);
                    });
            });

            it('test correct content loaded on the page with iht 205', (done) => {
                sessionData.deceased = {
                    maritalStatus: 'optionDivorced'
                };
                sessionData.applicant = {
                    relationshipToDeceased: 'optionChild'
                };
                sessionData.iht = {
                    method: 'optionPaper',
                    form: 'optionIHT205'
                };
                sessionData.caseType = caseTypes.INTESTACY;

                contentData.renunciationFormLink = config.links.renunciationForm;

                testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                        const contentToExclude = [
                            'header',
                            'HelpHeading',
                            'helpfulParagraph',
                            'documentsParagraph4',
                            'checklist-item2-codicils',
                            'checklist-item2-no-codicils',
                            'checklist-item3-codicils-written-wishes',
                            'checklist-item4-interim-death-cert',
                            'checklist-item4-foreign-death-cert',
                            'checklist-item4-foreign-death-cert-translation',
                            'checklist-item5-foreign-death-cert-PA19',
                            'checklist-item6-spouse-renouncing',
                            'checklist-item8-renunciated',
                            'checklist-item9-deed-poll',
                            'checklist-item10-iht207',
                            'checklist-item11-spouse-giving-up-admin-rights-PA16',
                            'no-docs-required'
                        ];

                        testWrapper.testContent(done, contentData, contentToExclude);
                    });
            });

            it('test correct content loaded on the page with no foreign death cert, interim death cert', (done) => {
                sessionData.deceased = {
                    maritalStatus: 'optionDivorced',
                    diedEngOrWales: 'optionYes',
                    deathCertificate: 'optionInterimCertificate'
                };

                sessionData.applicant = {
                    relationshipToDeceased: 'optionChild'
                };
                sessionData.caseType = caseTypes.INTESTACY;

                contentData.renunciationFormLink = config.links.renunciationForm;

                testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                        const contentToExclude = [
                            'header',
                            'HelpHeading',
                            'helpfulParagraph',
                            'documentsParagraph4',
                            'checklist-item2-codicils',
                            'checklist-item2-no-codicils',
                            'checklist-item3-codicils-written-wishes',
                            'checklist-item4-foreign-death-cert',
                            'checklist-item4-foreign-death-cert-translation',
                            'checklist-item5-foreign-death-cert-PA19',
                            'checklist-item6-spouse-renouncing',
                            'checklist-item7-iht205',
                            'checklist-item8-renunciated',
                            'checklist-item9-deed-poll',
                            'checklist-item10-iht207',
                            'checklist-item11-spouse-giving-up-admin-rights-PA16',
                            'no-docs-required'
                        ];

                        testWrapper.testContent(done, contentData, contentToExclude);
                    });
            });

            it('test correct content loaded on the page with english foreign death cert', (done) => {
                sessionData.deceased = {
                    maritalStatus: 'optionDivorced',
                    diedEngOrWales: 'optionNo',
                };

                sessionData.applicant = {
                    relationshipToDeceased: 'optionChild'
                };
                sessionData.caseType = caseTypes.INTESTACY;

                contentData.renunciationFormLink = config.links.renunciationForm;

                testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                        const contentToExclude = [
                            'header',
                            'HelpHeading',
                            'helpfulParagraph',
                            'documentsParagraph4',
                            'checklist-item2-codicils',
                            'checklist-item2-no-codicils',
                            'checklist-item3-codicils-written-wishes',
                            'checklist-item4-interim-death-cert',
                            'checklist-item4-foreign-death-cert-translation',
                            'checklist-item5-foreign-death-cert-PA19',
                            'checklist-item6-spouse-renouncing',
                            'checklist-item7-iht205',
                            'checklist-item8-renunciated',
                            'checklist-item9-deed-poll',
                            'checklist-item10-iht207',
                            'checklist-item11-spouse-giving-up-admin-rights-PA16',
                            'no-docs-required'
                        ];

                        testWrapper.testContent(done, contentData, contentToExclude);
                    });
            });

            it('test correct content loaded on the page with foreign death cert with separate translation', (done) => {
                sessionData.deceased = {
                    maritalStatus: 'optionDivorced',
                    diedEngOrWales: 'optionNo',
                    foreignDeathCertTranslation: 'optionNo'
                };

                sessionData.applicant = {
                    relationshipToDeceased: 'optionChild'
                };
                sessionData.caseType = caseTypes.INTESTACY;

                contentData.renunciationFormLink = config.links.renunciationForm;
                contentData.applicationFormPA19 = config.links.applicationFormPA19;

                testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                        const contentToExclude = [
                            'header',
                            'HelpHeading',
                            'helpfulParagraph',
                            'documentsParagraph4',
                            'checklist-item2-codicils',
                            'checklist-item2-no-codicils',
                            'checklist-item3-codicils-written-wishes',
                            'checklist-item4-interim-death-cert',
                            'checklist-item6-spouse-renouncing',
                            'checklist-item7-iht205',
                            'checklist-item8-renunciated',
                            'checklist-item9-deed-poll',
                            'checklist-item10-iht207',
                            'checklist-item11-spouse-giving-up-admin-rights-PA16',
                            'no-docs-required'
                        ];

                        testWrapper.testContent(done, contentData, contentToExclude);
                    });
            });

            it('test correct content loaded on the page with foreign death cert without separate translation', (done) => {
                sessionData.deceased = {
                    maritalStatus: 'optionDivorced',
                    diedEngOrWales: 'optionNo',
                    foreignDeathCertTranslation: 'optionYes'
                };

                sessionData.applicant = {
                    relationshipToDeceased: 'optionChild'
                };
                sessionData.caseType = caseTypes.INTESTACY;

                contentData.renunciationFormLink = config.links.renunciationForm;

                testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                        const contentToExclude = [
                            'header',
                            'HelpHeading',
                            'helpfulParagraph',
                            'documentsParagraph4',
                            'checklist-item2-codicils',
                            'checklist-item2-no-codicils',
                            'checklist-item3-codicils-written-wishes',
                            'checklist-item4-interim-death-cert',
                            'checklist-item4-foreign-death-cert-translation',
                            'checklist-item5-foreign-death-cert-PA19',
                            'checklist-item6-spouse-renouncing',
                            'checklist-item7-iht205',
                            'checklist-item8-renunciated',
                            'checklist-item9-deed-poll',
                            'checklist-item10-iht207',
                            'checklist-item11-spouse-giving-up-admin-rights-PA16',
                            'no-docs-required'
                        ];

                        testWrapper.testContent(done, contentData, contentToExclude);
                    });
            });

            it('test correct content loaded on the page when spouse is giving up admin rights and applicant is child', (done) => {
                sessionData.deceased = {
                    maritalStatus: 'optionMarried',
                    anyOtherChildren: 'optionNo'
                };
                sessionData.applicant = {
                    relationshipToDeceased: 'optionAdoptedChild',
                    spouseNotApplyingReason: 'optionRenouncing'
                };
                sessionData.caseType = caseTypes.INTESTACY;

                contentData.spouseGivingUpAdminRightsPA16Link = config.links.spouseGivingUpAdminRightsPA16Link;

                testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                        const contentToExclude = [
                            'header',
                            'HelpHeading',
                            'helpfulParagraph',
                            'documentsParagraph4',
                            'checklist-item2-codicils',
                            'checklist-item2-no-codicils',
                            'checklist-item3-codicils-written-wishes',
                            'checklist-item4-interim-death-cert',
                            'checklist-item4-foreign-death-cert',
                            'checklist-item4-foreign-death-cert-translation',
                            'checklist-item5-foreign-death-cert-PA19',
                            'checklist-item6-spouse-renouncing',
                            'checklist-item7-iht205',
                            'checklist-item8-renunciated',
                            'checklist-item9-deed-poll',
                            'checklist-item10-iht207',
                            'no-docs-required'
                        ];

                        testWrapper.testContent(done, contentData, contentToExclude);
                    });
            });

            it(`test redirects to ${expectedNextUrlForThankYouPage} if intestacy case with no documents required`, (done) => {
                sessionData.deceased = {
                    maritalStatus: 'optionDivorced'
                };
                sessionData.applicant = {
                    relationshipToDeceased: 'optionChild'
                };
                sessionData.caseType = caseTypes.INTESTACY;

                testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                        testWrapper.testContentPresent(done, [expectedNextUrlForThankYouPage]);
                    });
            });
        });

        describe('Common', () => {
            it(`test it redirects to next page: ${expectedNextUrlForThankYouPage}`, (done) => {
                contentData.sentDocuments = true;

                testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                        testWrapper.testRedirect(done, contentData, expectedNextUrlForThankYouPage);
                    });
            });
        });
    });
});
