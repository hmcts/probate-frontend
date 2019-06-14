'use strict';

const taskListContent = require('app/resources/en/translation/tasklist');
const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();
const signOutPage = require('app/steps/ui/signout');
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

// eslint-disable-next-line no-undef
Scenario(TestConfigurator.idamInUseText('Save And Close Link Click Flow'), function (I) {

    // IDAM
    I.authenticateWithIdamIfAvailable(true);

    // Deceased Details
    I.selectATask(taskListContent.taskNotStarted);
    I.enterDeceasedName('Deceased First Name', 'Deceased Last Name');
    I.enterDeceasedDateOfBirth('01', '01', '1950', true);

    I.waitForText('sign back in', testConfig.TestWaitForTextToAppear);
    I.seeInCurrentUrl(signOutPage.getUrl());

}).retry(TestConfigurator.getRetryScenarios());
