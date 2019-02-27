'use strict';

const AddressStep = require('app/core/steps/AddressStep');
const {findIndex, get, startsWith} = require('lodash');
const ExecutorsWrapper = require('app/wrappers/Executors');
const path = '/executor-address/';

class ExecutorAddress extends AddressStep {

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
        if (req.session.addresses && req.session.addresses.executors && req.session.addresses.executors[ctx.index-1]) {
            ctx.addresses = req.session.addresses.executors[ctx.index-1];
        }
        ctx.otherExecName = ctx.list[ctx.index] && ctx.list[ctx.index].fullName;
        ctx.executorsWrapper = new ExecutorsWrapper(ctx);
        return ctx;
    }

    handleGet(ctx) {
        super.handleGet(ctx);
        if (ctx.list[ctx.index].address) {
            ctx.address = ctx.list[ctx.index].postcodeAddress || ctx.list[ctx.index].freeTextAddress;
            ctx.postcode = ctx.list[ctx.index].postcode;
            ctx.postcodeAddress = ctx.list[ctx.index].postcodeAddress;
            if (!ctx.list[ctx.index].postcodeAddress) {
                ctx.freeTextAddress = ctx.list[ctx.index].freeTextAddress;
            }
        }

        return [ctx, ctx.errors];
    }

    handlePost(ctx, errors) {
        ctx.list[ctx.index].address = ctx.postcodeAddress || ctx.freeTextAddress;
        ctx.list[ctx.index].postcode = ctx.postcode ? ctx.postcode.toUpperCase() : ctx.postcode;
        ctx.list[ctx.index].postcodeAddress = ctx.postcodeAddress;
        ctx.list[ctx.index].freeTextAddress = ctx.freeTextAddress;

        ctx.index = this.recalcIndex(ctx, ctx.index);
        if (ctx.index === -1) {
            ctx.allExecsApplying = ctx.executorsWrapper.areAllAliveExecutorsApplying();
        }
        if (ctx.addresses && !session.addresses.executors) {
            session.addresses.executors = [];
        }
        if (ctx.addresses) {
            session.addresses.executors.push(ctx.addresses);
        }
        return [ctx, errors];
    }

    recalcIndex(ctx, index) {
        return findIndex(ctx.list, o => o.isApplying === true && o.isDead !== true, index + 1);
    }

    nextStepUrl(req, ctx) {
        if (ctx.index === -1) {
            return this.next(req, ctx).constructor.getUrl();
        }
        return this.next(req, ctx).constructor.getUrl(ctx.index);

    }

    nextStepOptions(ctx) {
        ctx.continue = get(ctx, 'index', -1) !== -1;
        ctx.allExecsApplying = ctx.executorsWrapper.areAllAliveExecutorsApplying();

        return {
            options: [
                {key: 'continue', value: true, choice: 'continue'},
                {key: 'allExecsApplying', value: true, choice: 'allExecsApplying'}
            ],
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.otherExecName;
        delete ctx.address;
        delete ctx.postcodeAddress;
        delete ctx.freeTextAddress;
        delete ctx.postcode;
        delete ctx.allExecsApplying;
        delete ctx.continue;
        delete ctx.index;
        delete ctx.executorsWrapper;
        return [ctx, formdata];
    }

    isComplete(ctx) {
        return [
            ctx.executorsWrapper.executorsApplying(true).every(executor => executor.email && executor.mobile && executor.address),
            'inProgress'
        ];
    }
}

module.exports = ExecutorAddress;
