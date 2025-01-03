'use strict';

const CollectionStep = require('app/core/steps/CollectionStep');
const {findIndex, every, tail, has, get} = require('lodash');
const FormatName = require('../../../../utils/FormatName');
const FieldError = require('../../../../components/error');
const path = '/executor-when-died/';

class ExecutorsWhenDied extends CollectionStep {

    constructor(steps, section, templatePath, i18next, schema, language) {
        super(steps, section, templatePath, i18next, schema, language);
        this.path = path;
    }

    static getUrl(index = '*') {
        return path + index;
    }

    handleGet(ctx) {
        if (ctx.list[ctx.index]) {
            ctx.diedbefore = ctx.list[ctx.index].diedBefore;
        }
        return [ctx];
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formData = req.session.form;
        ctx.deceasedName = FormatName.format(formData.deceased);
        return ctx;
    }

    recalcIndex(ctx, index) {
        return findIndex(ctx.list, o => o.isDead === true, index + 1);
    }

    handlePost(ctx, errors) {
        this.setNotApplyingReason(ctx);
        ctx.index = this.recalcIndex(ctx, ctx.index);
        return [ctx, errors];
    }

    setNotApplyingReason(ctx) {
        ctx.list[ctx.index].diedBefore = ctx.diedbefore;
        if (ctx.diedbefore === 'optionYes') {
            ctx.list[ctx.index].notApplyingReason = 'optionDiedBefore';
        } else {
            ctx.list[ctx.index].notApplyingReason = 'optionDiedAfter';
        }
        ctx.list[ctx.index].notApplyingKey = ctx.list[ctx.index].notApplyingReason;
    }

    nextStepOptions(ctx) {
        ctx.continue = get(ctx, 'index', -1) !== -1;
        ctx.allDead = every(tail(ctx.list), exec => exec.isDead === true);

        return {
            options: [
                {key: 'continue', value: true, choice: 'continue'},
                {key: 'allDead', value: true, choice: 'allDead'}
            ]
        };
    }

    isComplete(ctx) {
        const deadExecs = tail(ctx.list).filter(executor => executor.isDead);
        return [every(deadExecs, exec => has(exec, 'diedBefore')), 'inProgress'];
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
            const executorName = ctx.list[ctx.index].fullName;
            const deceasedName = ctx.deceasedName;
            const errorMessage = this.composeMessage(language, ctx, executorName, deceasedName);
            errorMessages.push(errorMessage);
            validationError.msg = errorMessage.msg;
            validationError.field = 'diedbefore';
        });
        return errorMessages;
    }

    composeMessage(language, ctx, executorName, deceasedName) {
        const messageType = 'required';
        const errorMessage = FieldError('diedbefore', messageType, this.resourcePath, this.generateContent({}, {}, language), language);
        errorMessage.msg = errorMessage.msg.replace('{executorName}', executorName).replace('{deceasedName}', deceasedName);
        return errorMessage;
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.diedbefore;
        delete ctx.continue;
        delete ctx.allDead;
        return [ctx, formdata];
    }
}

module.exports = ExecutorsWhenDied;
