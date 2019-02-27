'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const emailValidator = require('email-validator');
const validator = require('validator');
const FieldError = require('app/components/error');
const {findIndex, every, tail} = require('lodash');
const ExecutorsWrapper = require('app/wrappers/Executors');
const InviteData = require('app/services/InviteData');
const config = require('app/config');

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
        const executor = ctx.list[ctx.index];
        ctx.inviteId = executor.inviteId;
        ctx.otherExecName = executor.fullName;
        return ctx;
    }

    handleGet(ctx) {
        const executor = ctx.list[ctx.index];
        ctx.email = executor.email;
        ctx.mobile = executor.mobile;
        return [ctx];
    }

    * handlePost(ctx, errors) {
        const executorsWrapper = new ExecutorsWrapper(ctx);
        const executor = ctx.list[ctx.index];
        if (!emailValidator.validate(ctx.email)) {
            errors.push(FieldError('email', 'invalid', this.resourcePath, this.generateContent()));
        }

        if (!this.validatePhoneNumber(ctx.mobile)) {
            errors.push(FieldError('mobile', 'invalid', this.resourcePath, this.generateContent()));
        }

        if (ctx.email !== executor.email && executor.emailSent) {
            executor.emailChanged = true;
        }

        ctx.executorsToNotifyList = executorsWrapper.executorsToNotify();
        ctx.executorsEmailChanged = executorsWrapper.hasExecutorsEmailChanged();
        executor.email = ctx.email;
        executor.mobile = ctx.mobile;
        if (executor.emailSent) {
            const data = {
                email: executor.email,
                phoneNumber: executor.mobile
            };
            const inviteData = new InviteData(config.services.persistence.url, ctx.sessionID);
            yield inviteData.patch(ctx.inviteId, data)
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
