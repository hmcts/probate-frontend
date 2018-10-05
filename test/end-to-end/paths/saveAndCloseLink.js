'use strict';

const taskListContent = require('app/resources/en/translation/tasklist');
const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();
const testConfig = require('test/config.js');

Feature('Save And Close Link Functionality');

// eslint complains that the Before/After are not used but they are by codeceptjs
// so we have to tell eslint to not validate these
// eslint-disable-next-line no-undef
Before(() => {
    TestConfigurator.getBefore();
});

// eslint-disable-next-line no-undef
After(() => {
    TestConfigurator.getAfter();
});

Scenario(TestConfigurator.idamInUseText('Save And Close Link Click Flow'), function* (I) {

    // Pre-IDAM
    I.startApplication();
    I.startApply();

    // IDAM
    I.authenticateWithIdamIfAvailable();

    // EligibilityTask
    I.selectATask(taskListContent.taskNotStarted);
    I.selectPersonWhoDiedLeftAWill();
    I.selectOriginalWill();
    I.click('Save and close');
    I.see('You’ve signed out');
    I.seeCurrentUrlEquals(testConfig.TestE2EFrontendUrl+'/sign-out');
    I.click('sign back in');
    I.seeInCurrentUrl(testConfig.TestIdamLoginUrl);

}).retry(TestConfigurator.getRetryScenarios());
