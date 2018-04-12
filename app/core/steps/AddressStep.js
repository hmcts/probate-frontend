const ValidationStep = require('app/core/steps/ValidationStep');

module.exports = class AddressStep extends ValidationStep {

    * handleGet(ctx, formdata) {
        if (ctx.errors) {
            const errors = ctx.errors;
            delete ctx.errors;
            delete formdata[this.section].errors;
            return [ctx, errors];
        }
        return [ctx];
    }

    * handlePost(ctx, errors) {
        ctx.address = ctx.postcodeAddress || ctx.freeTextAddress;
        ctx.postcode = ctx.postcode ? ctx.postcode.toUpperCase() : ctx.postcode;
        if (ctx.postcodeAddress) {
            ctx.addresses = [{formatted_address: ctx.postcodeAddress}];
        } else {
            delete ctx.addresses;
        }
        delete ctx.referrer;
        return [ctx, errors];
    }
};
