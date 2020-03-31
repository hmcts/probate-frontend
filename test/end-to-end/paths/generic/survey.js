'use strict';

const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();
const optionYes = '';

Feature('Survey');

// eslint-disable-next-line no-undef
Scenario(TestConfigurator.idamInUseText('Check survey link works'), (I) => {

    // Eligibility Task (pre IdAM)
    I.startApplication();

    I.selectDeathCertificate(optionYes);
}).retry(TestConfigurator.getRetryScenarios());
