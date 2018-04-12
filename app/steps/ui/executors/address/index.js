const AddressStep = require('app/core/steps/AddressStep'),
    {findIndex, every, tail, get, startsWith} = require('lodash');

const path =  '/executor-address/';

module.exports = class ExecutorAddress extends AddressStep {

    static getUrl(index = '*') {
        return path + index;
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        if (req.params && !isNaN(req.params[0])) {
            ctx.index = parseInt(req.params[0]);
            req.session.indexPosition = ctx.index;
        } else if (req.params && req.params[0] === '*') {
            ctx.index = req.session.indexPosition;
        } else if (startsWith(req.path, path)) {
            ctx.index = this.recalcIndex(ctx, 0);
        }
        return ctx;
    }

    * handleGet(ctx) {
        super.handleGet(ctx);
        ctx.otherExecName = ctx.list[ctx.index].fullName;
        if (ctx.list[ctx.index].address) {
            ctx.address = ctx.list[ctx.index].postcodeAddress || ctx.list[ctx.index].freeTextAddress;
            ctx.postcode = ctx.list[ctx.index].postcode;
            if (ctx.list[ctx.index].postcodeAddress) {
                ctx.addresses = [{formatted_address: ctx.address}];
            } else {
                ctx.freeTextAddress = ctx.list[ctx.index].freeTextAddress;
            }
        }

        return [ctx, ctx.errors];
    }

    * handlePost(ctx, errors) {
        super.handlePost(ctx, errors);
        ctx.list[ctx.index].address = ctx.postcodeAddress || ctx.freeTextAddress;
        ctx.list[ctx.index].postcode = ctx.postcode ? ctx.postcode.toUpperCase() : ctx.postcode;
        ctx.list[ctx.index].postcodeAddress = ctx.postcodeAddress;
        ctx.list[ctx.index].freeTextAddress = ctx.freeTextAddress;

        ctx.index = this.recalcIndex(ctx, ctx.index);
        if (ctx.index === -1) {
            ctx.allExecsApplying = ctx.list.filter(o => o.isDead !== true).every(o => o.isApplying);
        }
        return [ctx, errors];
    }

    recalcIndex(ctx, index) {
        return findIndex(ctx.list, o => o.isApplying === true && o.isDead !== true, index + 1);
    }

    nextStepUrl(ctx) {
        if (ctx.index === -1) {
            return this.next(ctx).constructor.getUrl();
        }
            return this.next(ctx).constructor.getUrl(ctx.index);

    }

    nextStepOptions(ctx) {
        ctx.continue =  get(ctx, 'index', -1) !== -1;
        ctx.allExecsApplying = ctx.list.filter(o => o.isDead !== true).every(o => o.isApplying);
        const nextStepOptions = {
            options: [
                {key: 'continue', value: true, choice: 'continue'},
                {key: 'allExecsApplying', value: true, choice: 'allExecsApplying'}
            ],
        };
        return nextStepOptions;
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.otherExecName;
        delete ctx.address;
        delete ctx.postcodeAddress;
        delete ctx.freeTextAddress;
        delete ctx.postcode;
        delete ctx.addresses;
        delete ctx.freeTextAddress;
        delete ctx.allExecsApplying;
        delete ctx.continue;
        delete ctx.index;
        return [ctx, formdata]
    }

    isComplete(ctx) {
        return [every(tail(ctx.list).filter(exec => exec.isApplying === true), exec => exec.email && exec.mobile && exec.address), 'inProgress'];
    }
};