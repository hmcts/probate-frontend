'use strict';

const AddressStep = require('app/core/steps/AddressStep');

class ApplicantAddress extends AddressStep {

    static getUrl() {
        return '/applicant-address';
    }
    getContextData(req){
        const ctx =super.getContextData(req);
        if (req.session.addresses && req.session.addresses.applicant) {
            ctx.addresses = req.session.addresses.applicant;
        }
        return ctx;

    }

    handlePost(ctx, errors, formdata, session) {
        [ctx, errors] = super.handlePost(ctx, errors, formdata, session);
        if (ctx.addresses) {
            session.addresses.applicant = ctx.addresses;
        }
        return [ctx, errors];
    }
}

module.exports = ApplicantAddress;
