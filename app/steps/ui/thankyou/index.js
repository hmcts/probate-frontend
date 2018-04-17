const Step = require('app/core/steps/Step');

module.exports = class ThankYou extends Step {

    static getUrl () {
        return '/thankyou';
    }

    * handleGet(ctx, formdata) {
        ctx.softStop = this.anySoftStops(formdata, ctx);
        return [ctx];
    }

};
