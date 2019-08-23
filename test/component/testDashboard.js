'use strict';

const TestWrapper = require('test/util/TestWrapper');
const TaskList = require('app/steps/ui/tasklist');
const testCommonContent = require('test/component/common/testCommonContent.js');
const config = require('app/config');
const featureToggleUrl = config.featureToggles.url;
const multipleApplicationsFeatureTogglePath = `${config.featureToggles.path}/${config.featureToggles.multiple_applications}`;
const nock = require('nock');
const beforeEachNocks = (status = 'true') => {
    nock(featureToggleUrl)
        .get(multipleApplicationsFeatureTogglePath)
        .reply(200, status);
};
const afterEachNocks = () => {
    nock.cleanAll();
};

describe('death-certificate', () => {
    let testWrapper;
    const expectedNextUrlForTaskList = TaskList.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('Dashboard');
        beforeEachNocks();
    });

    afterEach(() => {
        testWrapper.destroy();
        afterEachNocks();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('Dashboard', beforeEachNocks, afterEachNocks);

        it('test content loaded on the page', (done) => {
            testWrapper.testDataPlayback(done);
        });

        it(`test it redirects to next page: ${expectedNextUrlForTaskList}`, (done) => {
            testWrapper.testRedirect(done, {}, expectedNextUrlForTaskList);
        });
    });
});
