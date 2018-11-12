'use strict';

const Step = require('app/core/steps/Step');

class ThankYou extends Step {

    static getUrl () {
        return '/thankyou';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        if (req.session.form.ccdCase && req.session.form.ccdCase.id) {
            ctx.ccdReferenceNumber = req.session.form.ccdCase.id;
        }
        return ctx;
    }
}

module.exports = ThankYou;
