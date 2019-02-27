'use strict';

const CollectionStep = require('app/core/steps/CollectionStep');
const execContent = require('app/resources/en/translation/executors/executorcontent');
const {findKey, findIndex, every, tail, has, get} = require('lodash');
const path = '/executor-when-died/';

class ExecutorsWhenDied extends CollectionStep {

    constructor(steps, section, templatePath, i18next, schema) {
        super(steps, section, templatePath, i18next, schema);
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
        if (ctx.diedbefore === 'Yes') {
            ctx.list[ctx.index].notApplyingReason = execContent.optionDiedBefore;
        } else {
            ctx.list[ctx.index].notApplyingReason = execContent.optionDiedAfter;
        }
        ctx.list[ctx.index].notApplyingKey = findKey(execContent, o => {
            return o === ctx.list[ctx.index].notApplyingReason;
        });
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

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.diedbefore;
        delete ctx.continue;
        delete ctx.allDead;
        return [ctx, formdata];
    }
}

module.exports = ExecutorsWhenDied;
