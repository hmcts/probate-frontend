const commonContent = require('app/resources/en/translation/common.json');
const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();
const testConfig = require('test/config.js');

Feature('Cookies');

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



Scenario(TestConfigurator.idamInUseText('Check that the pages display a cookie link'), (I) => {

    // IDAM
    I.authenticateWithIdamIfAvailable();


    I.startApplication();

    I.click(commonContent.cookies);
    I.waitForText('Services and information', 60);
    I.seeCurrentUrlEquals(testConfig.links.cookies);
});