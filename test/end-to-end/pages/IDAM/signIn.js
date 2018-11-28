'use strict';

//const testConfig = require('test/config.js');
//const useIdam = testConfig.TestUseIdam;
const useIdam = 'true';

module.exports = function () {
    if (useIdam === 'true') {
        const I = this;

        I.waitForElement('#content > div:nth-child(3) > div.column-half.col1 > form', 15);
        I.see('Sign in');

        I.fillField('username', process.env.testCitizenEmail);
        I.fillField('password', process.env.testCitizenPassword);

        I.click('Sign in');
    }
};
