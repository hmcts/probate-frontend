'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const ExecutorsWrapper = require('app/wrappers/Executors');
const FormatName = require('../../../../utils/FormatName');
const {includes} = require('lodash');
const FieldError = require('app/components/error');

class ExecutorsApplying extends ValidationStep {

    static getUrl() {
        return '/other-executors-applying';
    }

    getContextData(req) {
        const formdata = req.session.form;
        const ctx = super.getContextData(req);
        if (ctx.list) {
            ctx.options = (new ExecutorsWrapper(ctx)).aliveExecutors()
                .filter(executor => !executor.isApplicant)
                .map(executor => {
                    return {value: executor.fullName, text: executor.fullName, checked: executor.isApplying === true};
                });
        }
        ctx.deceasedName = FormatName.format(formdata.deceased);
        ctx.executorName = ctx.list && ctx.list.length ===2 ? ctx.list[1].fullName: '';
        return ctx;
    }

    pruneExecutorData(data) {
        if (data.isApplying) {
            delete data.isDead;
            delete data.diedBefore;
            delete data.notApplyingReason;
            delete data.notApplyingKey;
        } else {
            delete data.isApplying;
            delete data.address;
            delete data.currentName;
            delete data.currentNameReason;
            delete data.email;
            delete data.hasOtherName;
            delete data.mobile;
            delete data.postcode;
        }
        return data;
    }

    generateDynamicErrorMessage(field, session, executorName) {
        const baseMessage = FieldError('otherExecutorsApplying', 'required', this.resourcePath, this.generateContent({}, {}, session.language), session.language);
        baseMessage.msg = baseMessage.msg.replace('{executorName}', executorName);
        return baseMessage;
    }
    handlePost(ctx, errors = [], formdata, session) {
        let applyingCount = 0;
        if (ctx.list && ctx.list.length === 2) {
            errors = errors.filter(error => error.field !== 'executorsApplying');
            if (ctx.otherExecutorsApplying === 'undefined' || !ctx.otherExecutorsApplying) {
                errors.push(this.generateDynamicErrorMessage('otherExecutorsApplying', session, ctx.executorName));
            } else if (ctx.otherExecutorsApplying === 'optionYes') {
                ctx.list[1].isApplying = true;
                ctx.executorsApplying = [ctx.list[1].fullName];
            } else {
                ctx.list[1].isApplying = false;
            }
            this.pruneExecutorData(ctx.list[1]);
        } else if (ctx.list && ctx.list.length > 2) {
            errors = errors.filter(error => error.field !== 'otherExecutorsApplying');
            let anyApplying = false;
            ctx.list.slice(1).forEach(executor => {
                executor.isApplying = includes(ctx.executorsApplying, executor.fullName);
                if (executor.isApplying) {
                    anyApplying = true;
                    // eslint-disable-next-line no-plusplus
                    applyingCount++;
                    ctx.otherExecutorsApplying = 'optionYes';
                }
                this.pruneExecutorData(executor);
            });
            if (!anyApplying) {
                ctx.otherExecutorsApplying = 'optionNo';
            }
        }
        if (applyingCount > 3) {
            errors = errors.filter(error => error.field !== 'otherExecutorsApplying');
            errors.push(FieldError('executorsApplying', 'invalid', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
            return [ctx, errors];
        }
        return [ctx, errors];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.options;
        delete ctx.executorsApplying;
        return [ctx, formdata];
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'otherExecutorsApplying', value: 'optionYes', choice: 'otherExecutorsApplying'}
            ]
        };
    }
}

module.exports = ExecutorsApplying;
