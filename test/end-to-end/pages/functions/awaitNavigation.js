'use strict';

module.exports = async function (callback) {
    const I = this;

    await Promise.all([
        I.waitForNavigation(), // The promise resolves after navigation has finished
        callback(), // Clicking the link will indirectly cause a navigation
    ]);
};
