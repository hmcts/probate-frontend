'use strict';

const AddressStep = require('app/core/steps/AddressStep');
const {findIndex, get, startsWith} = require('lodash');
const ExecutorsWrapper = require('app/wrappers/Executors');
const pageUrl = '/executor-address';

class ExecutorAddress extends AddressStep {

    static getUrl(index = '*') {
        return `${pageUrl}${index}`;
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        if (req.params && !isNaN(req.params[0])) {
            ctx.index = parseInt(req.params[0]);
            req.session.indexPosition = ctx.index;
        } else if (req.params && req.params[0] === '*') {
            ctx.index = req.session.indexPosition;
            ctx.redirect = `${pageUrl}/${ctx.index}`;
        } else if (startsWith(req.path, pageUrl)) {
            ctx.index = this.recalcIndex(ctx, 0);
            ctx.redirect = `${pageUrl}/${ctx.index}`;
        }
        ctx.otherExecName = ctx.list[ctx.index] && ctx.list[ctx.index].fullName;
        ctx.executorsWrapper = new ExecutorsWrapper(ctx);

        return ctx;
    }

    handleGet(ctx) {
        let errors;
        [ctx, errors] = super.handleGet(ctx);

        if (errors.length > 0) {
            return [ctx, errors];
        }
        if (ctx.list[ctx.index].address) {
            ctx.address = ctx.list[ctx.index].address;
            ctx.addressLine1 = get(ctx.address, 'addressLine1', '');
            ctx.addressLine2 = get(ctx.address, 'addressLine2', '');
            ctx.addressLine3 = get(ctx.address, 'addressLine3', '');
            ctx.postTown = get(ctx.address, 'postTown', '');
            ctx.county = get(ctx.address, 'county', '');
            ctx.newPostCode = get(ctx.address, 'postCode', '');
            ctx.country = get(ctx.address, 'country', 'United Kingdom');
        }
        if (ctx.list[ctx.index].postcode && !ctx.postcode) {
            ctx.postcode = ctx.list[ctx.index].postcode;
        }
        if (ctx.list[ctx.index].addresses && !ctx.addresses) {
            ctx.addresses = ctx.list[ctx.index].addresses;
        }

        return [ctx, errors];
    }

    handlePost(ctx, errors, formdata, session) {
        super.handlePost(ctx, errors, formdata, session);
        ctx.list[ctx.index].address = ctx.address;
        ctx.list[ctx.index].postcode = ctx.postcode;
        ctx.list[ctx.index].addresses = ctx.addresses;

        ctx.index = this.recalcIndex(ctx, ctx.index);
        if (ctx.index === -1) {
            ctx.allExecsApplying = ctx.executorsWrapper.areAllAliveExecutorsApplying();
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
        delete ctx.postcode;
        delete ctx.allExecsApplying;
        delete ctx.continue;
        delete ctx.index;
        delete ctx.executorsWrapper;
        delete ctx.addressFound;
        delete ctx.address;
        delete ctx.addresses;
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
