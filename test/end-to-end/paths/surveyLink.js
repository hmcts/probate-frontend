'use strict';

const pageUnderTest = require('app/steps/ui/starteligibility/index');
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

    // IDAM
    I.authenticateWithIdamIfAvailable();

    I.amOnPage(pageUnderTest.getUrl());
    I.click('feedback');
    I.seeElement('#cmdGo');

});
