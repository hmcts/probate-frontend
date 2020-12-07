'use strict';

const content = require('app/resources/en/translation/executors/invite');

module.exports = async function() {
    const I = this;

    await I.checkPageUrl('app/steps/ui/executors/invite');
    await I.navByClick(content.sendInvites);
};
