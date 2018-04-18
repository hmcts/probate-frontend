const ValidationStep = require('app/core/steps/ValidationStep'),
    emailValidator = require('email-validator'),
    validator = require('validator'),
    FieldError = require('app/components/error'),
    services = require('app/components/services'),
    {findIndex, every, tail} = require('lodash');

module.exports = class ExecutorContactDetails extends ValidationStep {

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

    * handleGet(ctx) {
        ctx.email = ctx.list[ctx.index].email;
        ctx.mobile = ctx.list[ctx.index].mobile;
        return [ctx];
    }

    * handlePost(ctx, errors) {
        if (!emailValidator.validate(ctx.email)) {
            errors.push(FieldError('email', 'invalid', this.resourcePath, this.generateContent()));
        }

        if (!this.validatePhoneNumber(ctx.mobile)) {
            errors.push(FieldError('mobile', 'invalid', this.resourcePath, this.generateContent()));
        }

        ctx.list[ctx.index].email = ctx.email;
        ctx.list[ctx.index].mobile = ctx.mobile;
        if (ctx.list[ctx.index].emailSent) {
            const data = {};
            data.phoneNumber = ctx.list[ctx.index].mobile;
            yield services.updatePhoneNumber(ctx.inviteId, data)
                .then(result => {
                    if (result.name === 'Error') {
                        throw new ReferenceError('Error updating executor\'s phone number');
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

    nextStepUrl(ctx) {
        return this.next(ctx).constructor.getUrl(ctx.index);
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
};
