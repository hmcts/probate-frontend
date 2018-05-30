'use strict';

const Step = require('app/core/steps/Step');

class ThankYou extends Step {

    static getUrl () {
        return '/thankyou';
    }

    handleGet(ctx, formdata) {
        ctx.softStop = this.anySoftStops(formdata, ctx);
        return [ctx];
    }
}

module.exports = ThankYou;
