'use strict';

module.exports = async function() {
    const I = this;

    await I.waitForText('Equality and diversity questions');
    await I.navByClick('#back-button');
};
