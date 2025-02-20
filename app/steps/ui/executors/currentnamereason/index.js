'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const {findIndex, get, startsWith} = require('lodash');
const ExecutorsWrapper = require('app/wrappers/Executors');
const AliasData = require('app/utils/AliasData.js');
const FieldError = require('../../../../components/error');
const WillWrapper = require('../../../../wrappers/Will');

const path = '/executor-name-reason/';

class ExecutorCurrentNameReason extends ValidationStep {

    static getUrl(index = '*') {
        return path + index;
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        this.setCodicilFlagInCtx(ctx, req.session.form);
        if (req.params && !isNaN(req.params[0])) {
            ctx.index = parseInt(req.params[0]);
            req.session.indexPosition = ctx.index;
        } else if (req.params && req.params[0] === '*') {
            ctx.index = req.session.indexPosition ||
                findIndex(ctx.list, o => o.hasOtherName && !o.currentNameReason, 1);
        } else if (startsWith(req.path, path)) {
            ctx.index = this.recalcIndex(ctx, 0);
        }
        if (ctx.list?.[ctx.index]) {
            ctx.otherExecName = ctx.list[ctx.index].currentName;
        }
        return ctx;
    }

    pruneFormData(ctx) {
        if (ctx.list && ctx.alias === 'optionNo') {
            const list = ctx.list.map(executor => {
                if (executor.hasOtherName) {
                    executor.hasOtherName = false;
                    delete executor.currentNameReason;
                }
                return executor;
            });
            return Object.assign(ctx, {list});
        }
        return ctx;
    }

    handleGet(ctx) {
        if (ctx.list?.[ctx.index]) {
            ctx.currentNameReason = ctx.list[ctx.index].currentNameReason;
            ctx.otherReason = ctx.list[ctx.index].otherReason;
        }
        ctx = this.pruneFormData(ctx);
        return [ctx];
    }

    handlePost(ctx, errors, formdata) {
        if ((get(formdata, 'declaration.declarationCheckbox', false)).toString() === 'true' &&
            formdata.executors.list[ctx.index].currentNameReason !== ctx.currentNameReason
        ) {
            ctx.currentNameReasonUpdated = true;
        }

        if (ctx.otherReason) {
            ctx.list[ctx.index].otherReason = ctx.otherReason;
        }
        ctx.list[ctx.index].currentNameReason = ctx.currentNameReason;

        if (ctx.currentNameReason !== 'optionOther') {
            delete ctx.list[ctx.index].otherReason;
        }

        ctx.index = this.recalcIndex(ctx, ctx.index);
        return [ctx, errors];
    }

    recalcIndex(ctx, index) {
        return findIndex(ctx.list, o => o.isApplying, index + 1);
    }

    nextStepUrl(req, ctx) {
        if (ctx.index === -1) {
            return this.next(req, ctx).constructor.getUrl();
        }
        return this.next(req, ctx).constructor.getUrl(ctx.index);
    }

    nextStepOptions(ctx) {
        ctx.continue = get(ctx, 'index', -1) !== -1;
        return {
            options: [
                {key: 'continue', value: true, choice: 'continue'},
            ],
        };
    }

    setCodicilFlagInCtx(ctx, formdata) {
        ctx.codicilPresent = (new WillWrapper(formdata.will)).hasCodicils();
    }

    isComplete(ctx) {
        const executorsWrapper = new ExecutorsWrapper(ctx);
        return [executorsWrapper.executorsWithAnotherName().every(exec => exec.currentNameReason), 'inProgress'];
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
            if (ctx.currentNameReason === 'optionOther' && !ctx.otherReason) {
                validationError.field = 'otherReason';
            } else {
                validationError.field = 'currentNameReason';
            }
        });
        return errorMessages;
    }

    composeMessage(language, ctx, executorName) {
        if (ctx.currentNameReason === 'optionOther' && !ctx.otherReason) {
            const messageType = 'required';
            return FieldError('otherReason', messageType, this.resourcePath, this.generateContent({}, {}, language), language);
        } else if (typeof ctx.currentNameReason === 'undefined' || !ctx.currentNameReason) {
            const messageType = 'required';
            const errorMessage = FieldError('currentNameReason', messageType, this.resourcePath, this.generateContent({}, {}, language), language);
            errorMessage.msg = errorMessage.msg.replace('{executorName}', executorName);
            return errorMessage;
        }
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);

        if (ctx.currentNameReasonUpdated) {
            formdata = AliasData.resetDeclaration(formdata);
        }

        delete ctx.index;
        delete ctx.currentNameReason;
        delete ctx.otherReason;
        delete ctx.currentNameReasonUpdated;
        return [ctx, formdata];
    }
}

module.exports = ExecutorCurrentNameReason;
