'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeathCertificate = require('app/steps/ui/deceased/deathcertificate/index');
const TaskList = require('app/steps/ui/tasklist/index');
const CodicilsNumber = require('app/steps/ui/will/codicilsnumber/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

const nock = require('nock');
const config = require('app/config');
const featureToggleUrl = `${config.featureToggles.url}:${config.featureToggles.port}`;
const featureTogglePath = `${config.featureToggles.path}/${config.featureToggles.screening_questions}`;

describe('will-codicils', () => {
    let testWrapper;
    const expectedNextUrlForTaskList = TaskList.getUrl();
    const expectedNextUrlForDeathCertificate = DeathCertificate.getUrl();
    const expectedNextUrlForCodicilsNumber = CodicilsNumber.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('WillCodicils');
    });

    afterEach(() => {
        testWrapper.destroy();
        nock.cleanAll();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('WillCodicils');

        it('test correct content loaded on the page', (done) => {
            const excludeKeys = [];

            testWrapper.testContent(done, excludeKeys);
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {};

            testWrapper.testErrors(done, data, 'required', []);
        });

        it(`test it redirects to death certificate page: ${expectedNextUrlForDeathCertificate}`, (done) => {
            nock(featureToggleUrl)
                .get(featureTogglePath)
                .reply(200, 'false');

            const data = {
                codicils: 'No'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForDeathCertificate);
        });

        it(`test it redirects to tasklist page: ${expectedNextUrlForTaskList}`, (done) => {
            nock(featureToggleUrl)
                .get(featureTogglePath)
                .reply(200, 'true');

            const data = {
                codicils: 'No'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForTaskList);
        });

        it(`test it redirects to codicils number page: ${expectedNextUrlForCodicilsNumber}`, (done) => {
            const data = {
                'codicils': 'Yes'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForCodicilsNumber);
        });
    });
});
