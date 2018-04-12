const Step = require('app/core/steps/Step');

module.exports = class StopPage extends Step {

    static getUrl(reason = '*') {
        return `/stop-page/${reason}`;
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.stopReason = req.params[0];
        return ctx;
    }

    * handleGet(ctx, formdata) {
        [ctx] = yield super.handleGet(ctx, formdata);
        return [ctx, {}];
    }

};
