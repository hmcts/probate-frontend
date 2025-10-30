'use strict';

const TestWrapper = require('test/util/TestWrapper');
const config = require('config');
const caseTypes = require('../../app/utils/CaseTypes');
const stopPageContent = require('../../app/resources/en/translation/stoppage');

describe('stop-page', () => {
    let testWrapper;

    const allContent = Object.keys(stopPageContent);

    beforeEach(() => {
        testWrapper = new TestWrapper('StopPage');
    });

    afterEach(async () => {
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test right content loaded on the page - no death certificate', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('deathCertificate');
            const contentData = {
                stopReason: 'deathCertificate',
                deathReportedToCoroner: config.links.deathReportedToCoroner
            };

            const contentToInclude = ['eligibilityTitle', 'title', 'deathCertificateHeader', 'deathCertificate'
            ];
            const contentToExclude = allContent.filter(k => !contentToInclude.includes(k));

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - death certificate not translated', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('deathCertificateTranslation');
            const contentData = {
                stopReason: 'deathCertificateTranslation',
                applicationFormPA19: config.links.applicationFormPA19
            };

            const contentToInclude = ['eligibilityTitle', 'title', 'deathCertificateTranslationHeader', 'deathCertificateTranslation',];
            const contentToExclude = allContent.filter(k => !contentToInclude.includes(k));

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - deceased not in england or wales', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('notInEnglandOrWales');
            const contentData = {
                stopReason: 'notInEnglandOrWales',
                applicationFormPA1P: config.links.applicationFormPA1P,
                applicationFormPA1A: config.links.applicationFormPA1A
            };

            const contentToInclude = ['eligibilityTitle', 'title', 'applyByPostHeader', 'notInEnglandOrWales',];
            const contentToExclude = allContent.filter(k => !contentToInclude.includes(k));

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - iht not completed', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('ihtNotCompleted');
            const contentData = {stopReason: 'ihtNotCompleted', ihtNotCompleted: config.links.ihtNotCompleted};
            const contentToInclude = ['eligibilityTitle', 'title', 'inheritanceHeader', 'ihtNotCompleted',];
            const contentToExclude = allContent.filter(k => !contentToInclude.includes(k));

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - estate not valued', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('eeEstateNotValued');
            const contentData = {stopReason: 'eeEstateNotValued', ihtTaxChecker: config.links.ihtTaxChecker};

            const contentToInclude = ['eligibilityTitle', 'title', 'eeEstateValuedHeader', 'eeEstateNotValued',];
            const contentToExclude = allContent.filter(k => !contentToInclude.includes(k));

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - not died after october 2014', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('notDiedAfterOctober2014');
            const contentData = {
                stopReason: 'notDiedAfterOctober2014',
                applicationFormPA1A: config.links.applicationFormPA1A
            };

            const contentToInclude = ['eligibilityTitle', 'title', 'applyByPostHeader', 'notDiedAfterOctober2014',];
            const contentToExclude = allContent.filter(k => !contentToInclude.includes(k));

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - not related', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('notRelated');
            const contentData = {
                stopReason: 'notRelated',
                whoInherits: config.links.whoInherits,
                applicationFormPA1A: config.links.applicationFormPA1A
            };

            const contentToInclude = ['eligibilityTitle', 'title', 'applyByPostHeader', 'notRelated',];
            const contentToExclude = allContent.filter(k => !contentToInclude.includes(k));

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - not original', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('notOriginal');
            const contentData = {
                stopReason: 'notOriginal',
                solicitorsRegulationAuthority: config.links.solicitorsRegulationAuthority,
                findOriginalWill: config.links.findOriginalWill,
                applicationFormPA1P: config.links.applicationFormPA1P,
                applicationFormPA1A: config.links.applicationFormPA1A
            };

            const contentToInclude = ['eligibilityTitle', 'title', 'notOriginalHeader', 'notOriginal',];
            const contentToExclude = allContent.filter(k => !contentToInclude.includes(k));

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - not executor', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('notExecutor');
            const contentData = {stopReason: 'notExecutor', applicationFormPA1P: config.links.applicationFormPA1P};

            const contentToInclude = ['eligibilityTitle', 'title', 'applyByPostHeader', 'notExecutor',];
            const contentToExclude = allContent.filter(k => !contentToInclude.includes(k));

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - mental capacity', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('mentalCapacity');
            const contentData = {
                stopReason: 'mentalCapacity',
                applicationFormPA1P: config.links.applicationFormPA1P,
                applicationFormPA14: config.links.applicationFormPA14
            };

            const contentToInclude = ['eligibilityTitle', 'title', 'applyByPostHeader', 'mentalCapacity',];
            const contentToExclude = allContent.filter(k => !contentToInclude.includes(k));

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - divorce not in england or wales', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('divorcePlace');
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

            const contentToInclude = ['eligibilityTitle', 'title', 'postHeader', 'divorcePlace',];
            const contentToExclude = allContent.filter(k => !contentToInclude.includes(k));

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        applicationFormPA1A: config.links.applicationFormPA1A,
                        deceasedName: 'John Doe'
                    };

                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page - separation not in england or wales', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('separationPlace');
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

            const contentToInclude = ['eligibilityTitle', 'title', 'postHeader', 'separationPlace',];
            const contentToExclude = allContent.filter(k => !contentToInclude.includes(k));

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        applicationFormPA1A: config.links.applicationFormPA1A,
                        deceasedName: 'John Doe'
                    };

                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page - applicant is not spouse, civil partner or child of deceased', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('otherRelationship');
            const contentData = {applicationFormPA1A: config.links.applicationFormPA1A};

            const contentToInclude = ['eligibilityTitle', 'title', 'defaultHeader', 'otherRelationship',];
            const contentToExclude = allContent.filter(k => !contentToInclude.includes(k));

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - adoption not in england or wales', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('adoptionNotEnglandOrWales');
            const contentData = {applicationFormPA1A: config.links.applicationFormPA1A};

            const contentToInclude = ['eligibilityTitle', 'title', 'cannotApplyByOnlineHeader', 'adoptionNotEnglandOrWales',];
            const contentToExclude = allContent.filter(k => !contentToInclude.includes(k));

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - spouse not applying reason', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('spouseNotApplying');
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

            const contentToInclude = ['eligibilityTitle', 'title', 'cannotApplyByOnlineHeader', 'spouseNotApplying',];
            const contentToExclude = allContent.filter(k => !contentToInclude.includes(k));

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        whoInherits: config.links.whoInherits,
                        applicationFormPA1A: config.links.applicationFormPA1A,
                        deceasedName: 'John Doe'
                    };

                    testWrapper.testContent(done, contentData, contentToExclude);
                });

            it('test right content loaded on the page - did the deceased have any children under 18', (done) => {
                testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('childrenUnder18');
                const contentData = {applicationFormPA1A: config.links.applicationFormPA1A};

                const contentToInclude = ['eligibilityTitle', 'title', 'cannotApplyByOnlineHeader', 'childrenUnder18',];
                const contentToExclude = allContent.filter(k => !contentToInclude.includes(k));

                testWrapper.testContent(done, contentData, contentToExclude);
            });

            it('test right content loaded on the page - did the deceased child of the deceased have any children under 18', (done) => {
                testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('grandchildrenUnder18');
                const contentData = {applicationFormPA1A: config.links.applicationFormPA1A};

                const contentToInclude = ['eligibilityTitle', 'title', 'cannotApplyByOnlineHeader', 'grandchildrenUnder18',
                ];
                const contentToExclude = allContent.filter(k => !contentToInclude.includes(k));

                testWrapper.testContent(done, contentData, contentToExclude);
            });

            it('test right content loaded on the page - relationship other, married', (done) => {
                testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('deceasedHadLegalPartnerAndRelationshipOther');
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
                const contentData = {applicationFormPA1A: config.links.applicationFormPA1A,
                    applicationFormPA12: config.links.applicationFormPA12,
                    applicationFormPA16: config.links.applicationFormPA16,
                    deceasedName: 'John Doe',
                };

                const contentToInclude = ['eligibilityTitle', 'title', 'deceasedHadLegalPartnerAndRelationshipOtherHeader', 'deceasedHadLegalPartnerAndRelationshipOther'];
                const contentToExclude = allContent.filter(k => !contentToInclude.includes(k));

                testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                        testWrapper.testContent(done, contentData, contentToExclude);
                    });
            });

            it('test right content loaded on the page - relationship other, unmarried', (done) => {
                testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('deceasedNoLegalPartnerAndRelationshipOther');
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
                const contentData = {
                    applicationFormPA1A: config.links.applicationFormPA1A,
                    applicationFormPA12: config.links.applicationFormPA12,
                    applicationFormPA16: config.links.applicationFormPA16,
                    whoInherits: config.links.whoInherits,
                    deceasedName: 'John Doe',
                };

                const contentToInclude = ['eligibilityTitle', 'title', 'deceasedNoLegalPartnerAndRelationshipOtherHeader', 'deceasedNoLegalPartnerAndRelationshipOther'
                ];
                const contentToExclude = allContent.filter(k => !contentToInclude.includes(k));

                testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                        testWrapper.testContent(done, contentData, contentToExclude);
                    });
            });
            it('test right content loaded on the page - child adopted out', (done) => {
                testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('adoptedOut');
                const contentData = {applicationFormPA1A: config.links.applicationFormPA1A};
                const contentToInclude = ['eligibilityTitle', 'title', 'cannotApplyByOnlineHeader', 'adoptedOut',
                ];
                const contentToExclude = allContent.filter(k => !contentToInclude.includes(k));

                testWrapper.testContent(done, contentData, contentToExclude);
            });
        });
    });
});
