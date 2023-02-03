'use strict';

module.exports = async function(executor = null) {
    const I = this;
    await I.checkInUrl('/executor-address', executor);
    await I.refreshPage();
    await I.enterAddress();
    await I.click({css: '#submitAddress'});
};
