'use strict';

const TestWrapper = require('test/util/TestWrapper');
const config = require('config');
const commonContent = require('app/resources/en/translation/common');

describe('accessibility', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('Accessibility');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test right content loaded on the page', (done) => {
            const contentData = {
                myAbilityLink: config.links.myAbilityLink,
                applyForProbateFrontpage: config.links.applyForProbateFrontpage,
                helpLineNumber: commonContent.helpTelephoneNumber,
                helpLineHours: commonContent.helpTelephoneOpeningHours,
                equalityAdvisorLink: config.links.equalityAdvisorLink,
                wcag21Link: config.links.wcag21Link,
                paymentsAccessibilityStatement: config.links.paymentsAccessibilityStatement,
                applicationFormPA15: config.links.applicationFormPA15,
                deathReportedToCoroner: config.links.deathReportedToCoroner,
                probateStartApplyLink: config.links.probateStartApplyLink,
                caveatsStartApplyLink: config.links.caveatsStartApplyLink,
            };

            testWrapper.testContent(done, contentData);
        });
    });
});
