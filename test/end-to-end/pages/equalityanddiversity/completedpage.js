'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = function() {
    const I = this;
    I.wait(3);
    I.navByClick(commonContent.saveAndContinue);
};
