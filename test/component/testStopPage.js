const TestWrapper = require('test/util/TestWrapper');
const config = require('app/config');

describe('stop-page', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('StopPage');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test right content loaded on the page - no will', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('noWill');
            const excludeKeys = ['notOriginal', 'notExecutor', 'codicils', 'ihtNotCompleted', 'mentalCapacity', 'deathCertificate', 'progress'];
            testWrapper.testContent(done, excludeKeys, {applicationFormPA1A: config.links.applicationFormPA1A, guidance: config.links.guidance, registryInformation: config.links.registryInformation});
        });

        it('test right content loaded on the page - not original', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('notOriginal');
            const excludeKeys = ['noWill', 'codicils', 'notExecutor', 'ihtNotCompleted', 'mentalCapacity', 'deathCertificate', 'progress'];
            testWrapper.testContent(done, excludeKeys, {applicationFormPA1P: config.links.applicationFormPA1P, guidance: config.links.guidance, registryInformation: config.links.registryInformation});
        });

        it('test right content loaded on the page - codicils', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('codicils');
            const excludeKeys = ['noWill', 'notOriginal', 'notExecutor', 'ihtNotCompleted', 'mentalCapacity', 'deathCertificate', 'progress'];
            testWrapper.testContent(done, excludeKeys);
        });

        it('test right content loaded on the page - not executor', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('notExecutor');
            const excludeKeys = ['noWill', 'notOriginal', 'codicils', 'ihtNotCompleted', 'mentalCapacity', 'deathCertificate', 'progress'];
            testWrapper.testContent(done, excludeKeys, {applicationFormPA1P: config.links.applicationFormPA1P, guidance: config.links.guidance, registryInformation: config.links.registryInformation});
        });

        it('test right content loaded on the page - iht not completed', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('ihtNotCompleted');
            const excludeKeys = ['noWill', 'notOriginal', 'codicils', 'notExecutor', 'mentalCapacity', 'deathCertificate', 'progress'];
            testWrapper.testContent(done, excludeKeys, {ihtNotCompleted: config.links.ihtNotCompleted});
        });

        it('test right content loaded on the page - mental capacity', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('mentalCapacity');
            const excludeKeys = ['noWill', 'notOriginal', 'codicils', 'notExecutor', 'ihtNotCompleted', 'deathCertificate', 'progress'];
            testWrapper.testContent(done, excludeKeys, {applicationFormPA1P: config.links.applicationFormPA1P, guidance: config.links.guidance, registryInformation: config.links.registryInformation});
        });

        it('test right content loaded on the page - no death certificate', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl('deathCertificate');
            const excludeKeys = ['noWill', 'notOriginal', 'codicils', 'notExecutor', 'ihtNotCompleted', 'mentalCapacity', 'contactProbateOffice'];
            testWrapper.testContent(done, excludeKeys, {deathReportedToCoroner: config.links.deathReportedToCoroner});
        });
    });
});
