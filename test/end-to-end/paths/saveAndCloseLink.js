'use strict';

const taskListContent = require('app/resources/en/translation/tasklist');
const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();
const signOutPage = require('app/steps/ui/signout');

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

    //Screeners & Pre-IDAM
    I.startApplication();
    I.wait(10);
    I.selectDeathCertificate('Yes');
    I.wait(10);
    I.selectDeceasedDomicile('Yes');
    I.wait(10);
    I.selectIhtCompleted('Yes');
    I.wait(10);
    I.selectPersonWhoDiedLeftAWill('Yes');
    I.wait(10);
    I.selectOriginalWill('Yes');
    I.wait(10);
    I.selectApplicantIsExecutor('Yes');
    I.wait(10);
    I.selectMentallyCapable('Yes');
    I.wait(10);
    I.startApply();

    // IDAM
    I.authenticateWithIdamIfAvailable();

    // Deceased Details
    I.selectATask(taskListContent.taskNotStarted);
    I.enterDeceasedName('Deceased First Name', 'Deceased Last Name');
    I.enterDeceasedDateOfBirth('01', '01', '1950');
    I.enterDeceasedDateOfDeath('01', '01', '2017', true);
    I.seeCurrentUrlEquals(signOutPage.getUrl());
});
