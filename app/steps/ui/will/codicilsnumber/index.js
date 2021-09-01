'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class CodicilsNumber extends ValidationStep {

    static getUrl() {
        return '/codicils-number*';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.codicilsNumber = ctx.codicilsNumber ? parseInt(ctx.codicilsNumber) : ctx.codicilsNumber;
        return ctx;
    }

    handlePost(ctx, errors) {
        ctx.codicilsNumber = ctx.codicilsNumber || 0;
        return [ctx, errors];
    }

    isComplete(ctx) {
        return [ctx.codicilsNumber >= 0, 'inProgress'];
    }
}

module.exports = CodicilsNumber;
