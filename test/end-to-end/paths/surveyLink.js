'use strict';

const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();

Feature('Survey link');

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
xScenario(TestConfigurator.idamInUseText('Survey link redirects to the correct page'), function* (I) {

    //Screeners & Pre-IDAM
    I.startApplication();
    I.selectDeathCertificate('Yes');
    I.selectDeceasedDomicile('Yes');
    I.selectIhtCompleted('Yes');
    I.selectPersonWhoDiedLeftAWill('Yes');
    I.selectOriginalWill('Yes');
    I.selectApplicantIsExecutor('Yes');
    I.selectMentallyCapable('Yes');
    I.startApply();

    // IDAM
    I.authenticateWithIdamIfAvailable();
    I.click('.phase-banner-beta a');

    I.switchToNextTab(1);
    I.waitForVisible('#cmdGo');
});
