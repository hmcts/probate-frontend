'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const {findIndex, merge} = require('lodash');
const FormatName = require('../../../../utils/FormatName');
const ExecutorsWrapper = require('app/wrappers/Executors');
const pageUrl = '/executors-alias';
const {sanitizeInput} = require('../../../../utils/Sanitize');

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
        ctx.otherExecName = ctx.list?.[ctx.index] ? ctx.list[ctx.index].fullName : '';
        ctx.deceasedName = FormatName.format(req.session.form.deceased);
        return ctx;
    }

    recalcIndex(ctx, index) {
        return findIndex(ctx.list, o => o.isApplying === true && o.isDead !== true, index + 1);
    }

    pruneFormData(ctx) {
        if (ctx.list && Array.isArray(ctx.list)) {
            const list = ctx.list.map(executor => {
                if (executor.hasOtherName === false) {
                    delete executor.currentName;
                    delete executor.currentNameReason;
                    delete executor.otherReason;
                }
                return executor;
            });
            return merge(ctx, {list: sanitizeInput(list)});
        }
        return ctx;
    }
    handleGet(ctx) {
        if (ctx.list?.[ctx.index]) {
            if (ctx.list[ctx.index].hasOtherName === true) {
                ctx.alias = 'optionYes';
            } else if (ctx.list[ctx.index].hasOtherName === false) {
                ctx.alias = 'optionNo';
            } else {
                ctx.alias = '';
            }
        }
        return [ctx];
    }
    handlePost(ctx, errors) {
        const executor = ctx.list[ctx.index];
        if (executor.isApplying) {
            if (ctx.alias === 'optionYes') {
                executor.hasOtherName = true;
            } else if (ctx.alias === 'optionNo') {
                executor.hasOtherName = false;
                ctx = this.pruneFormData(ctx);
            }
        }
        return [ctx, errors];
    }

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

    isComplete(ctx) {
        const executorsWrapper = new ExecutorsWrapper(ctx);
        const executors = executorsWrapper.executorsApplying(true);

        const allExecutorsValid = executors.every(executor => {
            return (executor.hasOtherName === true && executor.currentName && executor.currentNameReason) || executor.hasOtherName === false;
        });

        return [allExecutorsValid, 'inProgress'];
    }

    generateFields(language, ctx, errors) {
        const fields = super.generateFields(language, ctx, errors);
        if (fields.otherExecName && errors) {
            errors[0].msg = errors[0].msg.replace('{executorName}', fields.otherExecName.value);
        }
        return fields;
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.index;
        delete ctx.alias;
        delete ctx.continue;
        return [ctx, formdata];
    }
}

module.exports = ExecutorsAlias;
