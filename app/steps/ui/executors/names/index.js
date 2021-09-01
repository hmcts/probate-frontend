'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FieldError = require('app/components/error');
const resourcePath = 'executors.names';
const i18next = require('i18next');
const {isEmpty, size} = require('lodash');
const FormatName = require('app/utils/FormatName');

class ExecutorsNames extends ValidationStep {

    static getUrl() {
        return '/executors-names*';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        const applicant = formdata.applicant;
        ctx.applicantCurrentName = FormatName.applicantWillName(applicant);
        return ctx;
    }

    handleGet(ctx) {
        this.createExecutorFullNameArray(ctx);
        return [ctx];
    }

    createExecutorFullNameArray(ctx) {
        ctx.executorName = [];
        if (ctx.list) {
            ctx.list.forEach((executor) => {
                if (executor && 'fullName' in executor && !executor.isApplicant) {
                    ctx.executorName.push(executor.fullName);
                }
            });
        }
    }

    handlePost(ctx, errors) {
        for (let i=1; i < ctx.executorsNumber; i++) {
            if (isEmpty(ctx.list[i])) {
                ctx.list[i] = {fullName: ctx.executorName[i-1]};
            } else {
                ctx.list[i].fullName = ctx.executorName[i-1];
            }
        }
        return [ctx, errors];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.applicantCurrentName;
        delete ctx.executorName;
        return [ctx, formdata];
    }

    validate(ctx, formdata, language) {
        let validationResult = [];
        if (isEmpty(ctx.executorName)) {
            validationResult[0] = size(ctx.list) === ctx.executorsNumber;
        } else {
            this.trimArrayTextFields(ctx);
            validationResult = super.validate(ctx, formdata, language);
            if (!validationResult[0]) { // has errors
                ctx.errors = this.createErrorMessages(validationResult[1], ctx, language);
            }
        }
        return validationResult;
    }

    trimArrayTextFields(ctx) {
        if (ctx.executorName) {
            for (let i = 0; i < ctx.executorName.length; i++) {
                ctx.executorName[i] = ctx.executorName[i].trim();
                if (ctx.executorName[i].length > 0 && !isNaN(ctx.executorName[i])) {
                    ctx.executorName[i]=parseInt(ctx.executorName[i]);
                }
            }
        }
    }

    createErrorMessages(validationErrors, ctx, language) {
        const self = this;
        const errorMessages = [];
        errorMessages.length = [ctx.executorsNumber - 1];
        validationErrors.forEach((validationError) => {
            const index = self.getIndexFromErrorParameter(validationError);
            errorMessages[index] = self.composeMessage(language, ctx.executorName[index], parseInt(index) + 2);
            validationError.msg = errorMessages[index].msg;
            validationError.field = `executorName_${index}`;
        });
        return errorMessages;
    }

    getIndexFromErrorParameter(validationError) {
        return validationError.field.split('[')[1].split(']')[0];
    }

    composeMessage(language, inputTextFieldValue, screenExecutorNumber) {
        const messageType = inputTextFieldValue === '' ? 'required' : 'invalid';
        const errorMessage = FieldError('executorName', messageType, resourcePath, language);
        const displayExecutor = i18next.t(`${resourcePath}.executor`);
        errorMessage.msg = `${displayExecutor} ${screenExecutorNumber}: ${errorMessage.msg}`;
        return errorMessage;
    }
}

module.exports = ExecutorsNames;
