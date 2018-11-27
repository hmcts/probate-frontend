'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const emailValidator = require('email-validator');
const validator = require('validator');
const FieldError = require('app/components/error');
const services = require('app/components/services');
const {findIndex, every, tail} = require('lodash');
const ExecutorsWrapper = require('app/wrappers/Executors');

class ExecutorContactDetails extends ValidationStep {

    static getUrl(index = '*') {
        return `/executor-contact-details/${index}`;
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        if (req.params && !isNaN(req.params[0])) {
            ctx.index = parseInt(req.params[0]);
        } else {
            ctx.index = this.recalcIndex(ctx, 0);
        }
        ctx.inviteId = ctx.list[ctx.index].inviteId;
        ctx.otherExecName = ctx.list[ctx.index].fullName;
        return ctx;
    }

    handleGet(ctx) {
        ctx.email = ctx.list[ctx.index].email;
        ctx.mobile = ctx.list[ctx.index].mobile;
        return [ctx];
    }

    * handlePost(ctx, errors) {
        const executorsWrapper = new ExecutorsWrapper(ctx);
        if (!emailValidator.validate(ctx.email)) {
            errors.push(FieldError('email', 'invalid', this.resourcePath, this.generateContent()));
        }

        if (!this.validatePhoneNumber(ctx.mobile)) {
            errors.push(FieldError('mobile', 'invalid', this.resourcePath, this.generateContent()));
        }

        if (ctx.email !== ctx.list[ctx.index].email && ctx.list[ctx.index].emailSent) {
            ctx.list[ctx.index].emailChanged = true;
        }

        ctx.executorsToNotifyList = executorsWrapper.executorsToNotify();
        ctx.executorsEmailChanged = executorsWrapper.hasExecutorsEmailChanged();
        ctx.list[ctx.index].email = ctx.email;
        ctx.list[ctx.index].mobile = ctx.mobile;
        if (ctx.list[ctx.index].emailSent) {
            const data = {};
            data.email = ctx.list[ctx.index].email;
            data.phoneNumber = ctx.list[ctx.index].mobile;
            yield services.updateContactDetails(ctx.inviteId, data)
                .then(result => {
                    if (result.name === 'Error') {
                        throw new ReferenceError('Error updating executor\'s contact details');
                    }
                });
        }
        return [ctx, errors];
    }

    validatePhoneNumber(num) {
        const ukPrefix = '44';

        if (num.startsWith('0') && !num.startsWith('00')) {
            if (validator.isInt(num)) {
                return true;
            }
        }

        if (num.startsWith(ukPrefix) || num.startsWith('7')) {
            if (validator.isInt(num)) {
                return true;
            }
        }

        if (num.startsWith('+')) {
            if (validator.isInt(num.slice(1, -1))) {
                return true;
            }
        }

        return false;
    }

    recalcIndex(ctx, index) {
        return findIndex(ctx.list, o => o.isApplying === true && o.isDead !== true, index + 1);
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl(ctx.index);
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.otherExecName;
        delete ctx.email;
        delete ctx.mobile;
        delete ctx.index;
        return [ctx, formdata];
    }

    isComplete(ctx) {
        return [every(tail(ctx.list).filter(exec => exec.isApplying === true), exec => exec.email && exec.mobile && exec.address), 'inProgress'];
    }
}

module.exports = ExecutorContactDetails;
