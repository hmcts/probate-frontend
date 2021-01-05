'use strict';

const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();

Feature('Cookie Banner');

Scenario('Check that the pages display a cookie banner with link', async (I) => {

    //Screeners & Pre-IDAM
    await I.clearCookie();
    await I.startApplication(true);
}).retry(TestConfigurator.getRetryScenarios());
