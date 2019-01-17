'use strict';

module.exports = function (callback) {
    const I = this;
    callback();
    I.waitForNavigation();
};
