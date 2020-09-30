'use strict';

const TestWrapper = require('test/util/TestWrapper');
const config = require('config');

describe('stop-page', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('StopPage');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test right content loaded on the page - no death certificate', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('deathCertificate');
            const contentData = {deathReportedToCoroner: config.links.deathReportedToCoroner};
            const contentToExclude = ['notInEnglandOrWales', 'ihtNotCompleted', 'notOriginal', 'notExecutor', 'mentalCapacity', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18', 'deathCertificateTranslation', 'deathCertificateTranslationHeader'];

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - deceased not in england or wales', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('notInEnglandOrWales');
            const contentData = {applicationFormPA1P: config.links.applicationFormPA1P, applicationFormPA1A: config.links.applicationFormPA1A};
            const contentToExclude = ['deathCertificate', 'ihtNotCompleted', 'notOriginal', 'notExecutor', 'mentalCapacity', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18', 'deathCertificateTranslation', 'deathCertificateTranslationHeader'];

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - iht not completed', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('ihtNotCompleted');
            const contentData = {ihtNotCompleted: config.links.ihtNotCompleted};
            const contentToExclude = ['deathCertificate', 'notInEnglandOrWales', 'notOriginal', 'notExecutor', 'mentalCapacity', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18', 'deathCertificateTranslation', 'deathCertificateTranslationHeader'];

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - not original', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('notOriginal');
            const contentData = {applicationFormPA1P: config.links.applicationFormPA1P, applicationFormPA1A: config.links.applicationFormPA1A};
            const contentToExclude = ['deathCertificate', 'notInEnglandOrWales', 'ihtNotCompleted', 'notExecutor', 'mentalCapacity', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18', 'deathCertificateTranslation', 'deathCertificateTranslationHeader'];

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - not executor', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('notExecutor');
            const contentData = {applicationFormPA1P: config.links.applicationFormPA1P};
            const contentToExclude = ['deathCertificate', 'notInEnglandOrWales', 'ihtNotCompleted', 'notOriginal', 'mentalCapacity', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18', 'deathCertificateTranslation', 'deathCertificateTranslationHeader'];

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - mental capacity', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('mentalCapacity');
            const contentData = {applicationFormPA1P: config.links.applicationFormPA1P, ifYoureAnExecutor: config.links.ifYoureAnExecutor};
            const contentToExclude = ['deathCertificate', 'notInEnglandOrWales', 'ihtNotCompleted', 'notOriginal', 'notExecutor', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18', 'deathCertificateTranslation', 'deathCertificateTranslationHeader'];

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - not died after october 2014', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('notDiedAfterOctober2014');
            const contentData = {applicationFormPA1A: config.links.applicationFormPA1A};
            const contentToExclude = ['deathCertificate', 'notInEnglandOrWales', 'ihtNotCompleted', 'notOriginal', 'notExecutor', 'mentalCapacity', 'notRelated', 'otherApplicants', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18', 'deathCertificateTranslation', 'deathCertificateTranslationHeader'];

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - not related', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('notRelated');
            const contentData = {applicationFormPA1A: config.links.applicationFormPA1A};
            const contentToExclude = ['deathCertificate', 'notInEnglandOrWales', 'ihtNotCompleted', 'notOriginal', 'notExecutor', 'mentalCapacity', 'notDiedAfterOctober2014', 'otherApplicants', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18', 'deathCertificateTranslation', 'deathCertificateTranslationHeader'];

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - other applicants', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('otherApplicants');
            const contentData = {applicationFormPA1A: config.links.applicationFormPA1A};
            const contentToExclude = ['deathCertificate', 'notInEnglandOrWales', 'ihtNotCompleted', 'notOriginal', 'notExecutor', 'mentalCapacity', 'notDiedAfterOctober2014', 'notRelated', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18', 'deathCertificateTranslation', 'deathCertificateTranslationHeader'];

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - divorce not in england or wales', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('divorcePlace');
            const contentData = {applicationFormPA1A: config.links.applicationFormPA1A};
            const contentToExclude = ['deathCertificate', 'notInEnglandOrWales', 'ihtNotCompleted', 'notOriginal', 'notExecutor', 'mentalCapacity', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18', 'deathCertificateTranslation', 'deathCertificateTranslationHeader'];

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - separation not in england or wales', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('separationPlace');
            const contentData = {applicationFormPA1A: config.links.applicationFormPA1A};
            const contentToExclude = ['deathCertificate', 'notInEnglandOrWales', 'ihtNotCompleted', 'notOriginal', 'notExecutor', 'mentalCapacity', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'divorcePlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18', 'deathCertificateTranslation', 'deathCertificateTranslationHeader'];

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - applicant is not spouse, civil partner or child of deceased', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('otherRelationship');
            const contentData = {applicationFormPA1A: config.links.applicationFormPA1A};
            const contentToExclude = ['deathCertificate', 'notInEnglandOrWales', 'ihtNotCompleted', 'notOriginal', 'notExecutor', 'mentalCapacity', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'divorcePlace', 'separationPlace', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18', 'deathCertificateTranslation', 'deathCertificateTranslationHeader'];

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - adoption not in england or wales', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('adoptionNotEnglandOrWales');
            const contentData = {applicationFormPA1A: config.links.applicationFormPA1A};
            const contentToExclude = ['deathCertificate', 'notInEnglandOrWales', 'ihtNotCompleted', 'notOriginal', 'notExecutor', 'mentalCapacity', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'divorcePlace', 'separationPlace', 'otherRelationship', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18', 'deathCertificateTranslation', 'deathCertificateTranslationHeader'];

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - spouse not applying reason', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('spouseNotApplying');
            const contentData = {applicationFormPA1A: config.links.applicationFormPA1A};
            const contentToExclude = ['deathCertificate', 'notInEnglandOrWales', 'ihtNotCompleted', 'notOriginal', 'notExecutor', 'mentalCapacity', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'childrenUnder18', 'grandchildrenUnder18', 'deathCertificateTranslation', 'deathCertificateTranslationHeader'];

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - did the deceased have any children under 18', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('childrenUnder18');
            const contentData = {applicationFormPA1A: config.links.applicationFormPA1A};
            const contentToExclude = ['deathCertificate', 'notInEnglandOrWales', 'ihtNotCompleted', 'notOriginal', 'notExecutor', 'mentalCapacity', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'grandchildrenUnder18', 'deathCertificateTranslation', 'deathCertificateTranslationHeader'];

            testWrapper.testContent(done, contentData, contentToExclude);
        });

        it('test right content loaded on the page - did the deceased child of the deceased have any children under 18', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('grandchildrenUnder18');
            const contentData = {applicationFormPA1A: config.links.applicationFormPA1A};
            const contentToExclude = ['deathCertificate', 'notInEnglandOrWales', 'ihtNotCompleted', 'notOriginal', 'notExecutor', 'mentalCapacity', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'deathCertificateTranslation', 'deathCertificateTranslationHeader'];

            testWrapper.testContent(done, contentData, contentToExclude);
        });
    });
});
