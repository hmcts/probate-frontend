'use strict';

module.exports = async function() {
    const I = this;

    await I.checkPageUrl('app/steps/ui/coapplicant/agreepage');

    // if (elementId === 0) {
    //     I.see('When everyone');
    // } else {
    //     I.see('All executors applying');
    // }
};
