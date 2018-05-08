const ValidationStep = require('app/core/steps/ValidationStep');
const {startsWith} = require('lodash');

module.exports = class CollectionStep extends ValidationStep {

    nextStepUrl(ctx) {
        if (ctx.index === -1) {
            return this.next(ctx).constructor.getUrl();
        }
            return this.next(ctx).constructor.getUrl(ctx.index);

    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        if (req.params && !isNaN(req.params[0])) {
            ctx.index = parseInt(req.params[0]);
        } else if (startsWith(req.path, this.path)) {
            ctx.index = this.recalcIndex(ctx, 0);
        } else {
            delete ctx.index;
        }
        return ctx;
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.index;
        return [ctx, formdata];
    }

    recalcIndex() {
        throw new TypeError(`Step ${this.name} does not implement recalcIndex()`);
    }

};
