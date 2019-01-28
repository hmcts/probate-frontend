'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const {startsWith, findIndex} = require('lodash');

class CollectionStep extends ValidationStep {

    nextStepUrl(req, ctx) {
        if (ctx.index === -1) {
            return this.next(req, ctx).constructor.getUrl();
        }
        return this.next(req, ctx).constructor.getUrl(ctx.index);
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

    recalcIndex(ctx, index) {
        return findIndex(ctx.list, o => o.isApplying === true, index + 1);
    }
}

module.exports = CollectionStep;
