'use strict';

const ValidationStep = require('app/core/steps/ValidationStep.cjs');

class BilingualGOP extends ValidationStep {

    // the conversion used for the case data -> form value used in orchestrator
    // does not limit the values returned in the `language` section of the form
    // to non-null values as is seemingly common elsewhere.
    getContextData(req) {
        const ctx = super.getContextData(req);
        if (ctx.bilingual === null) {
            delete ctx.bilingual;
        }
        return ctx;
    }

    static getUrl() {
        return '/bilingual-gop';
    }
}

module.exports = BilingualGOP;
