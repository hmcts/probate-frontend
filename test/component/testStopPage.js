'use strict';

const TestWrapper = require('test/util/TestWrapper');
const config = require('app/config');
const commonContent = require('app/resources/en/translation/common');

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
            const excludeKeys = ['notInEnglandOrWales', 'ihtNotCompleted', 'noWill', 'notOriginal', 'notExecutor', 'mentalCapacity', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18'];
            testWrapper.testContent(done, excludeKeys, {deathReportedToCoroner: config.links.deathReportedToCoroner});
        });

        it('test right content loaded on the page - deceased not in england or wales', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('notInEnglandOrWales');
            const excludeKeys = ['deathCertificate', 'ihtNotCompleted', 'noWill', 'notOriginal', 'notExecutor', 'mentalCapacity', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18'];
            testWrapper.testContent(done, excludeKeys, {applicationFormPA1P: config.links.applicationFormPA1P, applicationFormPA1A: config.links.applicationFormPA1A});
        });

        it('test right content loaded on the page - iht not completed', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('ihtNotCompleted');
            const excludeKeys = ['deathCertificate', 'notInEnglandOrWales', 'noWill', 'notOriginal', 'notExecutor', 'mentalCapacity', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18'];
            testWrapper.testContent(done, excludeKeys, {ihtNotCompleted: config.links.ihtNotCompleted});
        });

        it('test right content loaded on the page - no will', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('noWill');
            const excludeKeys = ['deathCertificate', 'notInEnglandOrWales', 'ihtNotCompleted', 'notOriginal', 'notExecutor', 'mentalCapacity', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18'];
            testWrapper.testContent(done, excludeKeys, {applicationFormPA1A: config.links.applicationFormPA1A, whoInherits: config.links.whoInherits});
        });

        it('test right content loaded on the page - not original', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('notOriginal');
            const excludeKeys = ['deathCertificate', 'notInEnglandOrWales', 'ihtNotCompleted', 'noWill', 'notExecutor', 'mentalCapacity', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18'];
            testWrapper.testContent(done, excludeKeys, {applicationFormPA1P: config.links.applicationFormPA1P, applicationFormPA1A: config.links.applicationFormPA1A});
        });

        it('test right content loaded on the page - not executor', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('notExecutor');
            const excludeKeys = ['deathCertificate', 'notInEnglandOrWales', 'ihtNotCompleted', 'noWill', 'notOriginal', 'mentalCapacity', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18'];
            testWrapper.testContent(done, excludeKeys, {applicationFormPA1P: config.links.applicationFormPA1P});
        });

        it('test right content loaded on the page - mental capacity', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('mentalCapacity');
            const excludeKeys = ['deathCertificate', 'notInEnglandOrWales', 'ihtNotCompleted', 'noWill', 'notOriginal', 'notExecutor', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18'];
            testWrapper.testContent(done, excludeKeys, {applicationFormPA1P: config.links.applicationFormPA1P, ifYoureAnExecutor: config.links.ifYoureAnExecutor});
        });

        it('test right content loaded on the page - not died after october 2014', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('notDiedAfterOctober2014');
            const excludeKeys = ['deathCertificate', 'notInEnglandOrWales', 'ihtNotCompleted', 'noWill', 'notOriginal', 'notExecutor', 'mentalCapacity', 'notRelated', 'otherApplicants', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18'];
            testWrapper.testContent(done, excludeKeys, {applicationFormPA1A: config.links.applicationFormPA1A});
        });

        it('test right content loaded on the page - not related', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('notRelated');
            const excludeKeys = ['deathCertificate', 'notInEnglandOrWales', 'ihtNotCompleted', 'noWill', 'notOriginal', 'notExecutor', 'mentalCapacity', 'notDiedAfterOctober2014', 'otherApplicants', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18'];
            testWrapper.testContent(done, excludeKeys, {applicationFormPA1A: config.links.applicationFormPA1A});
        });

        it('test right content loaded on the page - other applicants', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('otherApplicants');
            const excludeKeys = ['deathCertificate', 'notInEnglandOrWales', 'ihtNotCompleted', 'noWill', 'notOriginal', 'notExecutor', 'mentalCapacity', 'notDiedAfterOctober2014', 'notRelated', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18'];
            testWrapper.testContent(done, excludeKeys, {applicationFormPA1A: config.links.applicationFormPA1A});
        });

        it('test right content loaded on the page - divorce not in england or wales', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('divorcePlace');
            const excludeKeys = ['deathCertificate', 'notInEnglandOrWales', 'ihtNotCompleted', 'noWill', 'notOriginal', 'notExecutor', 'mentalCapacity', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18'];
            testWrapper.testContent(done, excludeKeys, {applicationFormPA1A: config.links.applicationFormPA1A});
        });

        it('test right content loaded on the page - separation not in england or wales', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('separationPlace');
            const excludeKeys = ['deathCertificate', 'notInEnglandOrWales', 'ihtNotCompleted', 'noWill', 'notOriginal', 'notExecutor', 'mentalCapacity', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'divorcePlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18'];
            testWrapper.testContent(done, excludeKeys, {applicationFormPA1A: config.links.applicationFormPA1A});
        });

        it('test right content loaded on the page - applicant is not spouse, civil partner or child of deceased', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('otherRelationship');
            const excludeKeys = ['deathCertificate', 'notInEnglandOrWales', 'ihtNotCompleted', 'noWill', 'notOriginal', 'notExecutor', 'mentalCapacity', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'divorcePlace', 'separationPlace', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18'];
            testWrapper.testContent(done, excludeKeys, {applicationFormPA1A: config.links.applicationFormPA1A});
        });

        it('test right content loaded on the page - adoption not in england or wales', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('adoptionNotEnglandOrWales');
            const excludeKeys = ['deathCertificate', 'notInEnglandOrWales', 'ihtNotCompleted', 'noWill', 'notOriginal', 'notExecutor', 'mentalCapacity', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'divorcePlace', 'separationPlace', 'otherRelationship', 'spouseNotApplying', 'childrenUnder18', 'grandchildrenUnder18'];
            testWrapper.testContent(done, excludeKeys, {applicationFormPA1A: config.links.applicationFormPA1A});
        });

        it('test right content loaded on the page - spouse not applying reason', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('spouseNotApplying');
            const excludeKeys = ['deathCertificate', 'notInEnglandOrWales', 'ihtNotCompleted', 'noWill', 'notOriginal', 'notExecutor', 'mentalCapacity', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'childrenUnder18', 'grandchildrenUnder18'];
            testWrapper.testContent(done, excludeKeys, {applicationFormPA1A: config.links.applicationFormPA1A});
        });

        it('test right content loaded on the page - did the deceased have any children under 18', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('childrenUnder18');
            const excludeKeys = ['deathCertificate', 'notInEnglandOrWales', 'ihtNotCompleted', 'noWill', 'notOriginal', 'notExecutor', 'mentalCapacity', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'grandchildrenUnder18'];
            testWrapper.testContent(done, excludeKeys, {applicationFormPA1A: config.links.applicationFormPA1A});
        });

        it('test right content loaded on the page - did the deceased child of the deceased have any children under 18', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('grandchildrenUnder18');
            const excludeKeys = ['deathCertificate', 'notInEnglandOrWales', 'ihtNotCompleted', 'noWill', 'notOriginal', 'notExecutor', 'mentalCapacity', 'notDiedAfterOctober2014', 'notRelated', 'otherApplicants', 'divorcePlace', 'separationPlace', 'otherRelationship', 'adoptionNotEnglandOrWales', 'spouseNotApplying', 'childrenUnder18'];
            testWrapper.testContent(done, excludeKeys, {applicationFormPA1A: config.links.applicationFormPA1A});
        });

        it('test "sign out" link is not displayed on the page on pages outside of IdAM', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('deathCertificate');
            const playbackData = {};
            playbackData.signOut = commonContent.signOut;
            testWrapper.testContentNotPresent(done, playbackData);
        });

        it('test "sign out" link is displayed on the page on pages inside IdAM', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('divorcePlace');
            const playbackData = {};
            playbackData.signOut = commonContent.signOut;
            testWrapper.testDataPlayback(done, playbackData);
        });
    });
});
