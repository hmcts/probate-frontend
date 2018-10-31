'use strict';

const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();
const testConfig = require('test/config.js');

Feature('Cookie Banner');

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
Scenario(TestConfigurator.idamInUseText('Check that the pages display a cookie banner with link'), (I) => {

    // IDAM
    I.startApply();
    I.authenticateWithIdamIfAvailable();

    // Click the cookie banner link that appears at the top (Electron browser starts afresh so we don't have to clear the cookie to make the banner show)
    I.click('Cookies');
    I.waitForText('How cookies are used in this service', 60);
    I.seeCurrentUrlEquals(testConfig.TestE2EFrontendUrl + testConfig.links.cookies);
});
