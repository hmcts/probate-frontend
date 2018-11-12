'use strict';

const TestWrapper = require('test/util/TestWrapper');
const TaskList = require('app/steps/ui/tasklist/index');
const commonContent = require('app/resources/en/translation/common');

const nock = require('nock');
const config = require('app/config');
const featureToggleUrl = `${config.featureToggles.url}:${config.featureToggles.port}`;
const featureTogglePath = `${config.featureToggles.path}/${config.featureToggles.screening_questions}`;

describe('new-start-apply', () => {
    let testWrapper;
    const expectedNextUrlForTaskList = TaskList.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('NewStartApply');

        nock(featureToggleUrl)
            .get(featureTogglePath)
            .reply(200, 'true');
    });

    afterEach(() => {
        testWrapper.destroy();
        nock.cleanAll();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test right content loaded on the page', (done) => {
            const excludeKeys = [];

            testWrapper.testContent(done, excludeKeys);
        });

        it(`test it redirects to next page: ${expectedNextUrlForTaskList}`, (done) => {
            testWrapper.testRedirect(done, {}, expectedNextUrlForTaskList);
        });

        it('test save and close link is not displayed on the page', (done) => {
            const playbackData = {};
            playbackData.saveAndClose = commonContent.saveAndClose;

            testWrapper.testContentNotPresent(done, playbackData);
        });
    });
});
