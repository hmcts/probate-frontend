'use strict';

const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();

Feature('Cookie Banner');

// eslint complains that the Before/After are not used but they are by codeceptjs
// so we have to tell eslint to not validate these
// eslint-disable-next-line no-undef
Before(async () => {
    await TestConfigurator.getBefore();
});

// eslint-disable-next-line no-undef
After(() => {
    TestConfigurator.getAfter();
});

// eslint-disable-next-line no-undef
Scenario(TestConfigurator.idamInUseText('Check that the pages display a cookie banner with link'), async (I) => {

    //Screeners & Pre-IDAM
    await I.clearCookie();
    await I.startApplication(true);
}).retry(TestConfigurator.getRetryScenarios());
