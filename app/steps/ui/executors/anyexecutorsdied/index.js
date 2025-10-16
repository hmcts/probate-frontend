'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FieldError = require('../../../../components/error');

class AnyExecutorsDied extends ValidationStep {

    static getUrl() {
        return '/any-executors-died';
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).getUrlWithContext(ctx, 1);
    }

    nextStepOptions(ctx) {
        ctx.singleExecutor = ctx.list && ctx.list.length === 2 && ctx.anyExecutorsDied === 'optionYes';
        ctx.multiExecutor = ctx.list && ctx.list.length > 2 && ctx.anyExecutorsDied === 'optionYes';
        return {
            options: [
                {key: 'singleExecutor', value: true, choice: 'whenDied'},
                {key: 'multiExecutor', value: true, choice: 'whoDied'},
                {key: 'anyExecutorsDied', value: 'optionNo', choice: 'isAlive'}
            ]
        };
    }

    handlePost(ctx, errors) {
        if (ctx.list.length === 2 && ctx.anyExecutorsDied === 'optionYes') {
            ctx.list[1].isDead = true;
            ctx.list[1] = this.pruneFormData(ctx.list[1]);
        }
        return [ctx, errors];
    }

    pruneFormData(executor) {
        if (executor.isDead) {
            delete executor.isApplying;
        }
        return executor;
    }

    validate(ctx, formdata, language) {
        const validationResult = super.validate(ctx, formdata, language);
        if (!validationResult[0]) { // has errors
            ctx.errors = this.createErrorMessages(validationResult[1], ctx, language);
        }
        return validationResult;
    }

    createErrorMessages(validationErrors, ctx, language) {
        const errorMessages = [];
        validationErrors.forEach((validationError) => {
            const dynamicText = ctx.list.length === 2 ? ctx.list[1].fullName : '';
            const errorMessage = this.composeMessage(language, ctx, dynamicText);
            errorMessages.push(errorMessage);
            validationError.msg = errorMessage.msg;
            validationError.field = 'anyExecutorsDied';
        });
        return errorMessages;
    }

    composeMessage(language, ctx, dynamicText) {
        const messageType = ctx.list.length > 2 ? 'multipleExecutorRequired' : 'singleExecutorRequired';
        const errorMessage = FieldError('anyExecutorsDied', messageType, this.resourcePath, this.generateContent({}, {}, language), language);
        errorMessage.msg = errorMessage.msg.replace('{executorName}', dynamicText);
        return errorMessage;
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        if (ctx.anyExecutorsDied === 'optionNo') {
            for (let i = 1; i < ctx.executorsNumber; i++) {
                if (ctx.list[i].isDead) {
                    ctx.list[i].isDead = false;
                    delete ctx.list[i].diedBefore;
                    delete ctx.list[i].notApplyingKey;
                    delete ctx.list[i].notApplyingReason;
                }

            }
        }

        return [ctx, formdata];
    }
}

module.exports = AnyExecutorsDied;
