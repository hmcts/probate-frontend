const scenario = 'Survey link redirects to the correct page';
const thankYouContent = require('app/resources/en/translation/thankyou.json');
const pageUnderTest = require('app/steps/ui/thankyou/index');
const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))(scenario);

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

Scenario(TestConfigurator.getScenarioName(), function* (I) {

    // IDAM
    I.authenticateWithIdamIfAvailable();

    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click(thankYouContent.survey);

    I.seeElement('#cmdGo');
});
