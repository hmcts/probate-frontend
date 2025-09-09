'use strict';

const TestWrapper = require('test/util/TestWrapper');
const commonContent = require('app/resources/en/translation/common');
const contentMaritalStatus = require('app/resources/en/translation/deceased/maritalstatus');
const caseTypes = require('app/utils/CaseTypes');

describe('separation-place', () => {
    let testWrapper;
    const sessionData = {
        type: caseTypes.INTESTACY,
        ccdCase: {
            state: 'Pending',
            id: 1234567890123456
        },
        caseType: caseTypes.INTESTACY,
        deceased: {
            maritalStatus: 'optionSeparated'
        }
    };

    beforeEach(() => {
        testWrapper = new TestWrapper('SeparationPlace');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test help block content is loaded on page', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const playbackData = {
                        helpTitle: commonContent.helpTitle,
                        helpHeading1: commonContent.helpHeading1,
                        helpHeading2: commonContent.helpHeading2,
                        helpHeading3: commonContent.helpHeading3,
                        helpTelephoneNumber: commonContent.helpTelephoneNumber,
                        helpTelephoneOpeningHoursTitle: commonContent.helpTelephoneOpeningHoursTitle,
                        helpTelephoneOpeningHours1: commonContent.helpTelephoneOpeningHours1,
                        helpTelephoneOpeningHours2: commonContent.helpTelephoneOpeningHours2,
                        helpEmailLabel: commonContent.helpEmailLabel.replace(/{contactEmailAddress}/g, commonContent.helpEmail)
                    };

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

        it('test content loaded on the page', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {legalProcess: contentMaritalStatus.separation};

                    testWrapper.testContent(done, contentData);
                });
        });
    });
});
