'use strict';

const TestWrapper = require('test/util/TestWrapper');
const config = require('config');
const caseTypes = require('../../app/utils/CaseTypes');

describe('stop-page', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('StopPage');
    });

    afterEach(async () => {
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test right content loaded on the page - no death certificate', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('deathCertificate');
            const contentData = {stopReason: 'deathCertificate', deathReportedToCoroner: config.links.deathReportedToCoroner};
            const contentToExclude = ['defaultHeader', 'deathCertificateTranslationHeader', 'inheritanceHeader', 'eeEstateValuedHeader', 'notOriginalHeader', 'applyByPostHeader', 'postHeader', 'defaultReason', 'deathCertificateTranslation', 'notInEnglandOrWales', 'ihtNotCompleted', 'eeEstateNotValued', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'notOriginal', 'notExecutor', 'mentalCapacity', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18', 'relToDecMarriedOther', 'relToDecMarriedOtherHeader', 'relToDecUnmarriedOther', 'relToDecUnmarriedOtherHeader'];

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - death certificate not translated', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('deathCertificateTranslation');
            const contentData = {stopReason: 'deathCertificateTranslation', applicationFormPA19: config.links.applicationFormPA19};
            const contentToExclude = ['defaultHeader', 'deathCertificateHeader', 'inheritanceHeader', 'eeEstateValuedHeader', 'notOriginalHeader', 'applyByPostHeader', 'postHeader', 'defaultReason', 'deathCertificate', 'notInEnglandOrWales', 'ihtNotCompleted', 'eeEstateNotValued', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'notOriginal', 'notExecutor', 'mentalCapacity', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18', 'relToDecMarriedOther', 'relToDecMarriedOtherHeader', 'relToDecUnmarriedOther', 'relToDecUnmarriedOtherHeader'];

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - deceased not in england or wales', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('notInEnglandOrWales');
            const contentData = {stopReason: 'notInEnglandOrWales', applicationFormPA1P: config.links.applicationFormPA1P, applicationFormPA1A: config.links.applicationFormPA1A};
            const contentToExclude = ['defaultHeader', 'deathCertificateHeader', 'deathCertificateTranslationHeader', 'inheritanceHeader', 'eeEstateValuedHeader', 'postHeader', 'notOriginalHeader', 'defaultReason', 'deathCertificate', 'deathCertificateTranslation', 'ihtNotCompleted', 'eeEstateNotValued', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'notOriginal', 'notExecutor', 'mentalCapacity', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18', 'relToDecMarriedOther', 'relToDecMarriedOtherHeader', 'relToDecUnmarriedOther', 'relToDecUnmarriedOtherHeader'];
            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - iht not completed', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('ihtNotCompleted');
            const contentData = {stopReason: 'ihtNotCompleted', ihtNotCompleted: config.links.ihtNotCompleted};
            const contentToExclude = ['defaultHeader', 'deathCertificateHeader', 'deathCertificateTranslationHeader', 'eeEstateValuedHeader', 'notOriginalHeader', 'applyByPostHeader', 'postHeader', 'defaultReason', 'deathCertificate', 'deathCertificateTranslation', 'notInEnglandOrWales', 'eeEstateNotValued', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'notOriginal', 'notExecutor', 'mentalCapacity', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18', 'relToDecMarriedOther', 'relToDecMarriedOtherHeader', 'relToDecUnmarriedOther', 'relToDecUnmarriedOtherHeader'];

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - estate not valued', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('eeEstateNotValued');
            const contentData = {stopReason: 'eeEstateNotValued', ihtTaxChecker: config.links.ihtTaxChecker};
            const contentToExclude = ['defaultHeader', 'deathCertificateHeader', 'deathCertificateTranslationHeader', 'inheritanceHeader', 'notOriginalHeader', 'applyByPostHeader', 'postHeader', 'defaultReason', 'deathCertificate', 'deathCertificateTranslation', 'notInEnglandOrWales', 'ihtNotCompleted', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'notOriginal', 'notExecutor', 'mentalCapacity', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18', 'relToDecMarriedOther', 'relToDecMarriedOtherHeader', 'relToDecUnmarriedOther', 'relToDecUnmarriedOtherHeader'];

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - not died after october 2014', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('notDiedAfterOctober2014');
            const contentData = {stopReason: 'notDiedAfterOctober2014', applicationFormPA1A: config.links.applicationFormPA1A};
            const contentToExclude = ['defaultHeader', 'deathCertificateHeader', 'deathCertificateTranslationHeader', 'inheritanceHeader', 'eeEstateValuedHeader', 'notOriginalHeader', 'postHeader', 'defaultReason', 'deathCertificate', 'deathCertificateTranslation', 'notInEnglandOrWales', 'ihtNotCompleted', 'eeEstateNotValued', 'notRelated', 'otherApplicants', 'notOriginal', 'notExecutor', 'mentalCapacity', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18', 'relToDecMarriedOther', 'relToDecMarriedOtherHeader', 'relToDecUnmarriedOther', 'relToDecUnmarriedOtherHeader'];

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - not related', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('notRelated');
            const contentData = {stopReason: 'notRelated', whoInherits: config.links.whoInherits, applicationFormPA1A: config.links.applicationFormPA1A};
            const contentToExclude = ['defaultHeader', 'deathCertificateHeader', 'deathCertificateTranslationHeader', 'inheritanceHeader', 'eeEstateValuedHeader', 'notOriginalHeader', 'postHeader', 'defaultReason', 'deathCertificate', 'deathCertificateTranslation', 'notInEnglandOrWales', 'ihtNotCompleted', 'eeEstateNotValued', 'notDiedAfterOctober2014', 'otherApplicants', 'notOriginal', 'notExecutor', 'mentalCapacity', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18', 'relToDecMarriedOther', 'relToDecMarriedOtherHeader', 'relToDecUnmarriedOther', 'relToDecUnmarriedOtherHeader'];

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - not original', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('notOriginal');
            const contentData = {stopReason: 'notOriginal', solicitorsRegulationAuthority: config.links.solicitorsRegulationAuthority, findOriginalWill: config.links.findOriginalWill, applicationFormPA1P: config.links.applicationFormPA1P, applicationFormPA1A: config.links.applicationFormPA1A};
            const contentToExclude = ['defaultHeader', 'deathCertificateHeader', 'deathCertificateTranslationHeader', 'inheritanceHeader', 'eeEstateValuedHeader', 'applyByPostHeader', 'postHeader', 'defaultReason', 'deathCertificate', 'deathCertificateTranslation', 'notInEnglandOrWales', 'ihtNotCompleted', 'eeEstateNotValued', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'notExecutor', 'mentalCapacity', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18', 'relToDecMarriedOther', 'relToDecMarriedOtherHeader', 'relToDecUnmarriedOther', 'relToDecUnmarriedOtherHeader'];

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - not executor', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('notExecutor');
            const contentData = {stopReason: 'notExecutor', applicationFormPA1P: config.links.applicationFormPA1P};
            const contentToExclude = ['defaultHeader', 'deathCertificateHeader', 'deathCertificateTranslationHeader', 'inheritanceHeader', 'eeEstateValuedHeader', 'notOriginalHeader', 'postHeader', 'defaultReason', 'deathCertificate', 'deathCertificateTranslation', 'notInEnglandOrWales', 'ihtNotCompleted', 'eeEstateNotValued', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'notOriginal', 'mentalCapacity', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18', 'relToDecMarriedOther', 'relToDecMarriedOtherHeader', 'relToDecUnmarriedOther', 'relToDecUnmarriedOtherHeader'];

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - mental capacity', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('mentalCapacity');
            const contentData = {stopReason: 'mentalCapacity', applicationFormPA1P: config.links.applicationFormPA1P, applicationFormPA14: config.links.applicationFormPA14};
            const contentToExclude = ['defaultHeader', 'deathCertificateHeader', 'deathCertificateTranslationHeader', 'inheritanceHeader', 'eeEstateValuedHeader', 'notOriginalHeader', 'postHeader', 'defaultReason', 'deathCertificate', 'deathCertificateTranslation', 'notInEnglandOrWales', 'ihtNotCompleted', 'eeEstateNotValued', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'notOriginal', 'notExecutor', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18', 'relToDecMarriedOther', 'relToDecMarriedOtherHeader', 'relToDecUnmarriedOther', 'relToDecUnmarriedOtherHeader'];

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
            const contentToExclude = ['deathCertificateHeader', 'deathCertificateTranslationHeader', 'inheritanceHeader', 'eeEstateValuedHeader', 'notOriginalHeader', 'applyByPostHeader', 'defaultHeader', 'defaultReason', 'deathCertificate', 'deathCertificateTranslation', 'notInEnglandOrWales', 'ihtNotCompleted', 'eeEstateNotValued', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'notOriginal', 'notExecutor', 'mentalCapacity', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18', 'relToDecMarriedOther', 'relToDecMarriedOtherHeader', 'relToDecUnmarriedOther', 'relToDecUnmarriedOtherHeader'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {applicationFormPA1A: config.links.applicationFormPA1A, deceasedName: 'John Doe'};

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
            const contentToExclude = ['deathCertificateHeader', 'deathCertificateTranslationHeader', 'inheritanceHeader', 'eeEstateValuedHeader', 'notOriginalHeader', 'applyByPostHeader', 'defaultHeader', 'defaultReason', 'deathCertificate', 'deathCertificateTranslation', 'notInEnglandOrWales', 'ihtNotCompleted', 'eeEstateNotValued', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'notOriginal', 'notExecutor', 'mentalCapacity', 'divorcePlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18', 'relToDecMarriedOther', 'relToDecMarriedOtherHeader', 'relToDecUnmarriedOther', 'relToDecUnmarriedOtherHeader'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {applicationFormPA1A: config.links.applicationFormPA1A, deceasedName: 'John Doe'};

                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page - applicant is not spouse, civil partner or child of deceased', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('otherRelationship');
            const contentData = {applicationFormPA1A: config.links.applicationFormPA1A};
            const contentToExclude = ['deathCertificateHeader', 'deathCertificateTranslationHeader', 'inheritanceHeader', 'eeEstateValuedHeader', 'notOriginalHeader', 'applyByPostHeader', 'postHeader', 'defaultReason', 'deathCertificate', 'deathCertificateTranslation', 'notInEnglandOrWales', 'ihtNotCompleted', 'eeEstateNotValued', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'notOriginal', 'notExecutor', 'mentalCapacity', 'divorcePlace', 'separationPlace', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18', 'relToDecMarriedOther', 'relToDecMarriedOtherHeader', 'relToDecUnmarriedOther', 'relToDecUnmarriedOtherHeader'];

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - adoption not in england or wales', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('adoptionNotEnglandOrWales');
            const contentData = {applicationFormPA1A: config.links.applicationFormPA1A};
            const contentToExclude = ['deathCertificateHeader', 'deathCertificateTranslationHeader', 'inheritanceHeader', 'eeEstateValuedHeader', 'notOriginalHeader', 'applyByPostHeader', 'postHeader', 'defaultReason', 'deathCertificate', 'deathCertificateTranslation', 'notInEnglandOrWales', 'ihtNotCompleted', 'eeEstateNotValued', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'notOriginal', 'notExecutor', 'mentalCapacity', 'divorcePlace', 'separationPlace', 'otherRelationship', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18', 'relToDecMarriedOther', 'relToDecMarriedOtherHeader', 'relToDecUnmarriedOther', 'relToDecUnmarriedOtherHeader'];

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - spouse not applying reason', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('spouseNotApplying');
            const contentData = {applicationFormPA1A: config.links.applicationFormPA1A};
            const contentToExclude = ['deathCertificateHeader', 'deathCertificateTranslationHeader', 'inheritanceHeader', 'eeEstateValuedHeader', 'notOriginalHeader', 'applyByPostHeader', 'postHeader', 'defaultReason', 'deathCertificate', 'deathCertificateTranslation', 'notInEnglandOrWales', 'ihtNotCompleted', 'eeEstateNotValued', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'notOriginal', 'notExecutor', 'mentalCapacity', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'childrenUnder18', 'grandchildrenUnder18', 'relToDecMarriedOther', 'relToDecMarriedOtherHeader', 'relToDecUnmarriedOther', 'relToDecUnmarriedOtherHeader'];

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - did the deceased have any children under 18', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('childrenUnder18');
            const contentData = {applicationFormPA1A: config.links.applicationFormPA1A};
            const contentToExclude = ['deathCertificateHeader', 'deathCertificateTranslationHeader', 'inheritanceHeader', 'eeEstateValuedHeader', 'notOriginalHeader', 'applyByPostHeader', 'postHeader', 'defaultReason', 'deathCertificate', 'deathCertificateTranslation', 'notInEnglandOrWales', 'ihtNotCompleted', 'eeEstateNotValued', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'notOriginal', 'notExecutor', 'mentalCapacity', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'grandchildrenUnder18', 'relToDecMarriedOther', 'relToDecMarriedOtherHeader', 'relToDecUnmarriedOther', 'relToDecUnmarriedOtherHeader'];

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - did the deceased child of the deceased have any children under 18', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('grandchildrenUnder18');
            const contentData = {applicationFormPA1A: config.links.applicationFormPA1A};
            const contentToExclude = ['deathCertificateHeader', 'deathCertificateTranslationHeader', 'inheritanceHeader', 'eeEstateValuedHeader', 'notOriginalHeader', 'applyByPostHeader', 'postHeader', 'defaultReason', 'deathCertificate', 'deathCertificateTranslation', 'notInEnglandOrWales', 'ihtNotCompleted', 'eeEstateNotValued', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'notOriginal', 'notExecutor', 'mentalCapacity', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'relToDecMarriedOther', 'relToDecMarriedOtherHeader', 'relToDecUnmarriedOther', 'relToDecUnmarriedOtherHeader'];

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - relationship other, married', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('relToDecMarriedOther');
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
                deceasedName: 'John Doe',
            };
            const contentToExclude = ['defaultHeader', 'deathCertificateHeader', 'deathCertificateTranslationHeader', 'inheritanceHeader', 'eeEstateValuedHeader', 'notOriginalHeader', 'postHeader', 'applyByPostHeader', 'defaultReason', 'deathCertificate', 'deathCertificateTranslation', 'notInEnglandOrWales', 'ihtNotCompleted', 'eeEstateNotValued', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'notOriginal', 'notExecutor', 'mentalCapacity', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18', 'relToDecUnmarriedOther', 'relToDecUnmarriedOtherHeader'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page - relationship other, unmarried', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('relToDecUnmarriedOther');
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
            const contentToExclude = ['defaultHeader', 'deathCertificateHeader', 'deathCertificateTranslationHeader', 'inheritanceHeader', 'eeEstateValuedHeader', 'notOriginalHeader', 'applyByPostHeader', 'postHeader', 'defaultReason', 'deathCertificate', 'deathCertificateTranslation', 'notInEnglandOrWales', 'ihtNotCompleted', 'eeEstateNotValued', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'notOriginal', 'notExecutor', 'mentalCapacity', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18', 'relToDecMarriedOther', 'relToDecMarriedOtherHeader'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });
    });
});
