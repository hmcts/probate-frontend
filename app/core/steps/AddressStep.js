'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const services = require('app/components/services');

class AddressStep extends ValidationStep {

    getContextData(req){
        const ctx =super.getContextData(req);
        if (req.session.addresses) {
            ctx.addresses = req.session.addresses;
        }
        return ctx;

    }

    handleGet(ctx, formdata,) {
        if (ctx.errors) {
            const errors = ctx.errors;
            delete ctx.errors;
            if (formdata) {
                delete formdata[this.section].errors;
            }
            return [ctx, errors];
        }
        return [ctx];
    }

    handlePost(ctx, errors, formdata, session) {
        ctx.address = ctx.postcodeAddress || ctx.freeTextAddress;
        ctx.postcode = ctx.postcode ? ctx.postcode.toUpperCase() : ctx.postcode;
        session.addresses = ctx.addresses;
        if (! ctx.postcodeAddress){
            delete ctx.addresses;
        }
        delete ctx.referrer;
        return [ctx, errors];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.addresses;
        return [ctx, formdata];
    }
}

module.exports = AddressStep;
