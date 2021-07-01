'use strict';

module.exports = async function(language ='en', answer = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    const mentalCapacityContent = require(`app/resources/${language}/translation/screeners/mentalcapacity`);

    await I.checkInUrl('/mental-capacity');
    await I.waitForText(mentalCapacityContent.question);
    await I.waitForText(mentalCapacityContent.hintText1);

    const locator = {css: `#mentalCapacity${answer}`};
    await I.waitForEnabled(locator);
    await I.click(locator);
    await I.navByClick(commonContent.continue, 'button.govuk-button');
};
