'use strict';

const TestWrapper = require('test/util/TestWrapper');
const NewMentalCapacity = require('app/steps/ui/executors/newmentalcapacity/index');
const StopPage = require('app/steps/ui/stoppage/index');
const commonContent = require('app/resources/en/translation/common');

const nock = require('nock');
const config = require('app/config');
const featureToggleUrl = `${config.featureToggles.url}:${config.featureToggles.port}`;
const featureTogglePath = `${config.featureToggles.path}/${config.featureToggles.screening_questions}`;

describe('new-applicant-executor', () => {
    let testWrapper;
    const expectedNextUrlForNewMentalCapacity = NewMentalCapacity.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('notExecutor');

    beforeEach(() => {
        testWrapper = new TestWrapper('NewApplicantExecutor');

        nock(featureToggleUrl)
            .get(featureTogglePath)
            .reply(200, 'true');
    });

    afterEach(() => {
        testWrapper.destroy();
        nock.cleanAll();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test help block content is loaded on page', (done) => {
            const playbackData = {};
            playbackData.helpTitle = commonContent.helpTitle;
            playbackData.helpText = commonContent.helpText;
            playbackData.contactTelLabel = commonContent.contactTelLabel.replace('{helpLineNumber}', config.helpline.number);
            playbackData.contactOpeningTimes = commonContent.contactOpeningTimes.replace('{openingTimes}', config.helpline.hours);
            playbackData.helpEmailLabel = commonContent.helpEmailLabel;
            playbackData.contactEmailAddress = commonContent.contactEmailAddress;

            testWrapper.testDataPlayback(done, playbackData);
        });

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done);
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {};

            testWrapper.testErrors(done, data, 'required');
        });

        it(`test it redirects to next page: ${expectedNextUrlForNewMentalCapacity}`, (done) => {
            const data = {
                executor: 'Yes'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForNewMentalCapacity);
        });

        it(`test it redirects to stop page: ${expectedNextUrlForStopPage}`, (done) => {
            const data = {
                executor: 'No'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
        });

        it('test save and close link is not displayed on the page', (done) => {
            const playbackData = {};
            playbackData.saveAndClose = commonContent.saveAndClose;

            testWrapper.testContentNotPresent(done, playbackData);
        });
    });
});
