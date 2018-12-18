'use strict';

const TestWrapper = require('test/util/TestWrapper');
const config = require('app/config');
const commonContent = require('app/resources/en/translation/common');
const nock = require('nock');
const featureToggleUrl = config.featureToggles.url;
const featureTogglePath = `${config.featureToggles.path}/${config.featureToggles.screening_questions}`;

describe('stop-page', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('StopPage');
    });

    afterEach(() => {
        testWrapper.destroy();
        nock.cleanAll();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test right content loaded on the page - no death certificate', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('deathCertificate');
            const excludeKeys = ['notInEnglandOrWales', 'ihtNotCompleted', 'noWill', 'notOriginal', 'notExecutor', 'mentalCapacity'];
            testWrapper.testContent(done, excludeKeys, {deathReportedToCoroner: config.links.deathReportedToCoroner});
        });

        it('test right content loaded on the page - deceased not in england or wales', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('notInEnglandOrWales');
            const excludeKeys = ['deathCertificate', 'ihtNotCompleted', 'noWill', 'notOriginal', 'notExecutor', 'mentalCapacity'];
            testWrapper.testContent(done, excludeKeys, {applicationFormPA1P: config.links.applicationFormPA1P, applicationFormPA1A: config.links.applicationFormPA1A});
        });

        it('test right content loaded on the page - iht not completed', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('ihtNotCompleted');
            const excludeKeys = ['deathCertificate', 'notInEnglandOrWales', 'noWill', 'notOriginal', 'notExecutor', 'mentalCapacity'];
            testWrapper.testContent(done, excludeKeys, {ihtNotCompleted: config.links.ihtNotCompleted});
        });

        it('test right content loaded on the page - no will', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('noWill');
            const excludeKeys = ['deathCertificate', 'notInEnglandOrWales', 'ihtNotCompleted', 'notOriginal', 'notExecutor', 'mentalCapacity'];
            testWrapper.testContent(done, excludeKeys, {applicationFormPA1A: config.links.applicationFormPA1A, whoInherits: config.links.whoInherits});
        });

        it('test right content loaded on the page - not original', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('notOriginal');
            const excludeKeys = ['deathCertificate', 'notInEnglandOrWales', 'ihtNotCompleted', 'noWill', 'notExecutor', 'mentalCapacity'];
            testWrapper.testContent(done, excludeKeys, {applicationFormPA1P: config.links.applicationFormPA1P, applicationFormPA1A: config.links.applicationFormPA1A});
        });

        it('test right content loaded on the page - not executor', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('notExecutor');
            const excludeKeys = ['deathCertificate', 'notInEnglandOrWales', 'ihtNotCompleted', 'noWill', 'notOriginal', 'mentalCapacity'];
            testWrapper.testContent(done, excludeKeys, {applicationFormPA1P: config.links.applicationFormPA1P});
        });

        it('test right content loaded on the page - mental capacity', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('mentalCapacity');
            const excludeKeys = ['deathCertificate', 'notInEnglandOrWales', 'ihtNotCompleted', 'noWill', 'notOriginal', 'notExecutor'];
            testWrapper.testContent(done, excludeKeys, {applicationFormPA1P: config.links.applicationFormPA1P, ifYoureAnExecutor: config.links.ifYoureAnExecutor});
        });

        it('test "sign out" link is not displayed on the page (feature toggle on)', (done) => {
            nock(featureToggleUrl)
                .get(featureTogglePath)
                .reply(200, 'true');

            const playbackData = {};
            playbackData.signOut = commonContent.signOut;

            testWrapper.testContentNotPresent(done, playbackData);
        });
    });
});
