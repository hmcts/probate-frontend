'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const {findIndex} = require('lodash');
const FormatName = require('../../../../utils/FormatName');
const FieldError = require('../../../../components/error');
const pageUrl = '/executors-alias';

class ExecutorsAlias extends ValidationStep {
    static getUrl(index = '*') {
        return `${pageUrl}/${index}`;
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        if (req.params && !isNaN(req.params[0])) {
            ctx.index = parseInt(req.params[0]);
        } else {
            ctx.index = this.recalcIndex(ctx, 0);
            ctx.redirect = `${pageUrl}/${ctx.index}`;
        }
        const executor = ctx.list[ctx.index];
        ctx.otherExecName = executor.fullName;
        ctx.deceasedName = FormatName.format(req.session.form.deceased);
        return ctx;
    }

    recalcIndex(ctx, index) {
        return findIndex(ctx.list, o => o.isApplying === true && o.isDead !== true, index + 1);
    }
    pruneFormData(ctx) {
        if (ctx.list && ctx.alias === 'optionNo') {
            const list = ctx.list.map(executor => {
                if (executor.hasOtherName) {
                    executor.hasOtherName = false;
                    delete executor.currentName;
                    delete executor.currentNameReason;
                    delete executor.otherReason;
                }
                return executor;
            });
            return Object.assign(ctx, {list});
        }
        return ctx;
    }

    handlePost(ctx, errors) {
        for (let i = 1; i < ctx.executorsNumber; i++) {
            ctx.list[i].hasOtherName = ctx.list[i].isApplying && ctx.alias === 'optionYes';
            ctx = this.pruneFormData(ctx);
        }
        return [ctx, errors];
    }

    /*nextStepUrl(req, ctx) {
        if (ctx.index === -1) {
            return this.next(req, ctx).constructor.getUrl();
        }
        return this.next(req, ctx).constructor.getUrl(ctx.index);
    }*/
    nextStepUrl(req, ctx) {
        if (ctx.alias === 'optionNo') {
            const nextIndex = this.recalcIndex(ctx, ctx.index);
            if (nextIndex !== -1) {
                return ExecutorsAlias.getUrl(nextIndex);
            }
            return '/executor-contact-details/1';
        } else if (ctx.alias === 'optionYes') {
            return `/executor-id-name/${ctx.index}`;
        }
        return this.next(req, ctx).constructor.getUrl(ctx.index);
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'alias', value: 'optionYes', choice: 'withAlias'}
            ]
        };
    }

    validate(ctx, formdata, language) {
        const validationResult = super.validate(ctx, formdata, language);
        if (!validationResult[0]) {
            ctx.errors = this.createErrorMessages(validationResult[1], ctx, language);
        }
        return validationResult;
    }

    createErrorMessages(validationErrors, ctx, language) {
        const errorMessages = [];
        validationErrors.forEach((validationError) => {
            const executorName = ctx.list[ctx.index].fullName;
            const errorMessage = this.composeMessage(language, ctx, executorName);
            errorMessages.push(errorMessage);
            validationError.msg = errorMessage.msg;
            validationError.field = 'alias';
        });
        return errorMessages;
    }

    composeMessage(language, ctx, executorName) {
        const messageType = 'required';
        const errorMessage = FieldError('alias', messageType, this.resourcePath, this.generateContent({}, {}, language), language);
        errorMessage.msg = errorMessage.msg.replace('{executorName}', executorName);
        return errorMessage;
    }
}

module.exports = ExecutorsAlias;
