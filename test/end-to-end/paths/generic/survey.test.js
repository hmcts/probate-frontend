'use strict';

const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();
const optionYes = '';

const language = 'en';

Feature('Survey');

Scenario('Check survey link works', async ({I}) => {

    // Eligibility Task (pre IdAM)
    await I.startApplication(language);
    await I.selectDeathCertificate(language, optionYes, true);

}).tag('@e2e')
    .retry(TestConfigurator.getRetryScenarios());
