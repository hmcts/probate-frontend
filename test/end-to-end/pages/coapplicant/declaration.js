const pageUnderTest = require('app/steps/ui/coapplicant/declaration/index');


module.exports = function (agreeDisagree) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    if (agreeDisagree === 'Agree') {
        I.click('#agreement-optionYes');
    } else
    {
        I.click('#agreement-optionNo');
    }

    I.click('#acceptAndSend');

};
