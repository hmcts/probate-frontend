'use strict';

const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();
const language = 'en';

Feature('Survey');

Scenario('Check survey link works', async ({I}) => {

    // Eligibility Task (pre IdAM)
    await I.startApplication(language);
    await I.selectDeathCertificate(language, true);

}).tag('@e2enightly')
    .retry(TestConfigurator.getRetryScenarios());
