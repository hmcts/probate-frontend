'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class IhtIdentifier extends ValidationStep {

    static getUrl() {
        return '/iht-identifier*';
    }

    validate(ctx, formdata, language) {
        this.parseIdentifier(ctx);
        return super.validate(ctx, formdata, language);
    }

    parseIdentifier(ctx) {
        if (ctx.identifier) {
            const identifier = ctx.identifier.replace(/-/g, '')
                .replace(/\s/g, '');
            ctx.identifier = identifier;
        }
    }
}

module.exports = IhtIdentifier;
