'use strict';

module.exports = async function(language ='en', answer = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    const mentalCapacityContent = require(`app/resources/${language}/translation/screeners/mentalcapacity`);
    const {decodeHTML} = require('test/end-to-end/helpers/GeneralHelpers');
    await I.checkInUrl('/mental-capacity');
    await I.waitForText(await decodeHTML(mentalCapacityContent.question));
    await I.see(await decodeHTML(mentalCapacityContent.hintText1));

    const locator = {css: `#mentalCapacity${answer}`};
    await I.waitForEnabled(locator);
    await I.click(locator);
    await I.navByClick(commonContent.continue, 'button.govuk-button');
};
