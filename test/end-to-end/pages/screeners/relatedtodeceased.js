'use strict';

const {decodeHTML} = require('../../helpers/GeneralHelpers');

module.exports = async function(language ='en', answer = null) {
    const I = this;
    const relatedToDeceasedContent = require(`app/resources/${language}/translation/screeners/relatedtodeceased`);
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/related-to-deceased');
    await I.waitForText(await decodeHTML(relatedToDeceasedContent.question));
    await I.see(await decodeHTML(relatedToDeceasedContent.optionPartner));
    await I.see(await decodeHTML(relatedToDeceasedContent.hintTextPartner));
    await I.see(await decodeHTML(relatedToDeceasedContent.optionChild));
    await I.see(await decodeHTML(relatedToDeceasedContent.hintTextChild));
    await I.see(await decodeHTML(relatedToDeceasedContent.optionGrandchild));
    await I.see(await decodeHTML(relatedToDeceasedContent.hintTextGrandchild));
    await I.see(await decodeHTML(relatedToDeceasedContent.optionParent));
    await I.see(await decodeHTML(relatedToDeceasedContent.hintTextParent));
    await I.see(await decodeHTML(relatedToDeceasedContent.optionSibling));
    await I.see(await decodeHTML(relatedToDeceasedContent.hintTextSibling));
    await I.see(await decodeHTML(relatedToDeceasedContent.or));
    await I.see(await decodeHTML(relatedToDeceasedContent.optionNone));
    const locator = {css: `#related${answer}`};
    await I.waitForEnabled(locator);
    await I.click(locator);

    await I.navByClick(commonContent.continue, 'button.govuk-button');
};
