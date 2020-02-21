'use strict';

const TestWrapper = require('test/util/TestWrapper');
const commonContent = require('app/resources/en/translation/common');
const config = require('app/config');
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

    afterEach(() => {
        nock.cleanAll();
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test help block content is loaded on page', (done) => {
            applicationInProgressNock();

            const playbackData = {
                helpTitle: commonContent.helpTitle,
                helpHeadingTelephone: commonContent.helpHeadingTelephone,
                helpHeadingEmail: commonContent.helpHeadingEmail,
                helpHeadingWebchat: commonContent.helpHeadingWebchat,
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
