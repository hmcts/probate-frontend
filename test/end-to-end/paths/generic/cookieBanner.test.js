'use strict';

const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();
const language = 'en';

Feature('Cookie Banner');

Scenario('Check that the pages display a cookie banner and that we can switch off cookies', async ({I}) => {

    //Screeners & Pre-IDAM
    await I.clearCookie();
    await I.startApplication(language, true);
}).tag('@nightly')
    .retry(TestConfigurator.getRetryScenarios());
