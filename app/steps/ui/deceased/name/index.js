'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

module.exports = class DeceasedName extends ValidationStep {

    static getUrl() {
        return '/deceased-name';
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.index;
        return [ctx, formdata];
    }
};
