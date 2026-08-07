'use strict';

const Step = require('app/core/steps/Step');

class StartApply extends Step {

    static getUrl() {
        return '/start-apply';
    }

    // eslint-disable-next-line no-unused-vars
    getUrlWithContext(ctx, unused) {
        return this.constructor.getUrl();
    }
}

module.exports = StartApply;
