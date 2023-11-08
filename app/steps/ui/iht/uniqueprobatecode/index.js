'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class UniqueProbateCode extends ValidationStep {
    static getUrl() {
        return '/unique-probate-code';
    }
    handlePost(ctx, errors) {

        ctx.uniqueProbateCodeId = ctx.uniqueProbateCodeId.replace(/\s+/g, '');

        return [ctx, errors];

    }

    nextStepOptions(ctx) {
        return {
            uniqueProbateCodeId: ctx.uniqueProbateCodeId.replace(/\s+/g, '')
        };
    }

}

module.exports = UniqueProbateCode;
