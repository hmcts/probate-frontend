'use strict';

const ValidationStep = require('app/core/steps/ValidationStep.cjs');

class DeceasedAliasNameOnWill extends ValidationStep {

    static getUrl() {
        return '/deceased-alias-name-on-will';
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        return [ctx, formdata];
    }
}

module.exports = DeceasedAliasNameOnWill;
