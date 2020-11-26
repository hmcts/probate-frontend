'use strict';

const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();
const optionYes = '';

Feature('Survey');

// eslint-disable-next-line no-undef
Scenario(TestConfigurator.idamInUseText('Check survey link works'), async (I) => {

    // Eligibility Task (pre IdAM)
    await I.startApplication();
    await I.selectDeathCertificate(optionYes, true);
}).retry(TestConfigurator.getRetryScenarios());
