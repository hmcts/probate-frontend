'use strict';

const TestWrapper = require('test/util/TestWrapper');
const config = require('config');
const commonContent = require('app/resources/en/translation/common');

describe('contact-us', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('ContactUs');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test right content loaded on the page', (done) => {
            const contentData = {
                helpTitle: commonContent.helpTitle,
                helpHeading1: commonContent.helpHeading1,
                helpHeading2: commonContent.helpHeading2,
                helpHeading3: commonContent.helpHeading3,
                helpTelephoneOpeningHoursTitle: commonContent.helpTelephoneOpeningHoursTitle,
                helpTelephoneOpeningHours1: commonContent.helpTelephoneOpeningHours1,
                helpTelephoneOpeningHours2: commonContent.helpTelephoneOpeningHours2,
                helpLineNumber: commonContent.helpTelephoneNumber,
                helpLineHours: commonContent.helpTelephoneOpeningHours,
                callChargesLink: config.links.callCharges
            };

            testWrapper.testContent(done, contentData);
        });
    });
});
