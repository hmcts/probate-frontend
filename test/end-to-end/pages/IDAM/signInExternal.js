'use strict';

module.exports = function (email, password) {
    const I = this;
    I.see('Sign in');

    I.fillField('username', email);
    I.fillField('password', password);

    I.awaitNavigation(() => I.click('Sign in'));
};
