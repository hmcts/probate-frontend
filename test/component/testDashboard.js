'use strict';

const TestWrapper = require('test/util/TestWrapper');
const commonContent = require('app/resources/en/translation/common');
const config = require('config');
const orchestratorServiceUrl = config.services.orchestrator.url;
const nock = require('nock');
const applicationInProgressNock = () => {
    nock(orchestratorServiceUrl)
        .get('/forms/cases')
        .reply(200, {
            applications: [
                {
                    deceasedFullName: 'David Cameron',
                    dateCreated: '13 July 2016',
                    caseType: 'PA',
                    ccdCase: {
                        id: '1234567890123456',
                        state: 'Pending'
                    }
                }
            ]
        });
};
const applicationSubmittedNock = () => {
    nock(orchestratorServiceUrl)
        .get('/forms/cases')
        .reply(200, {
            applications: [
                {
                    deceasedFullName: 'David Cameron',
                    dateCreated: '13 July 2016',
                    caseType: 'PA',
                    ccdCase: {
                        id: '1234567890123456',
                        state: 'CaseCreated'
                    }
                }
            ]
        });
};
const applicationProgressedNock = () => {
    nock(orchestratorServiceUrl)
        .get('/forms/cases')
        .reply(200, {
            applications: [
                {
                    deceasedFullName: 'David Cameron',
                    dateCreated: '13 July 2016',
                    caseType: 'PA',
                    ccdCase: {
                        id: '1234567890123456',
                        state: 'CasePrinted'
                    }
                }
            ]
        });
};

describe('dashboard', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('Dashboard');
    });

    afterEach(async () => {
        nock.cleanAll();
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test help block content is loaded on page', (done) => {
            applicationInProgressNock();

            const playbackData = {
                helpTitle: commonContent.helpTitle,
                helpHeading1: commonContent.helpHeading1,
                helpHeading2: commonContent.helpHeading2,
                helpHeading3: commonContent.helpHeading3,
                helpTelephoneNumber: commonContent.helpTelephoneNumber,
                helpTelephoneOpeningHoursTitle: commonContent.helpTelephoneOpeningHoursTitle,
                helpTelephoneOpeningHours1: commonContent.helpTelephoneOpeningHours1,
                helpTelephoneOpeningHours2: commonContent.helpTelephoneOpeningHours2,
                helpTelephoneOpeningHours3: commonContent.helpTelephoneOpeningHours3,
                helpEmailLabel: commonContent.helpEmailLabel.replace(/{contactEmailAddress}/g, commonContent.helpEmail)
            };
            testWrapper.testDataPlayback(done, playbackData);
        });

        it('test content loaded on the page - application in progress', (done) => {
            applicationInProgressNock();
            testWrapper.testContentNotPresent(done, ['case-status submitted']);
        });

        it('test content loaded on the page - application submitted', (done) => {
            applicationSubmittedNock();
            testWrapper.testContentPresent(done, ['case-status submitted']);
        });

        it('test content loaded on the page - application progressed by caseworker', (done) => {
            applicationProgressedNock();
            testWrapper.testContentPresent(done, ['case-status submitted']);
        });
    });
});
