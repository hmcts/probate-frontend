'use strict';

module.exports = async function() {
    const I = this;

    await I.checkPageUrl('app/steps/ui/coapplicant/startpage');
    await I.navByClick('.govuk-button');
};
