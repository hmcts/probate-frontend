'use strict';
const ValidationStep = require('app/core/steps/ValidationStep');

module.exports = class CopiesUk extends ValidationStep {

    static getUrl() {
        return '/copies-uk';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.uk = ctx.uk ? parseInt(ctx.uk): ctx.uk;
        return ctx;
    }

    handlePost(ctx, errors) {
        ctx.uk = ctx.uk || 0;
        return [ctx, errors];
    }

    isComplete(ctx) {
        return [ctx.uk >= 0, 'inProgress'];
    }
};
