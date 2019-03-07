'use strict';

const Step = require('app/core/steps/Step');
const copiesSteps = ['CopiesUk', 'AssetsJEGG', 'CopiesJEGG', 'AssetsOverseas', 'CopiesOverseas'];
const FormatName = require('app/utils/FormatName');

class CopiesSummary extends Step {

    static getUrl() {
        return '/copies-summary';
    }

    generateContent (ctx, formdata) {
        const content = {};

        Object.keys(this.steps).filter(stepName => copiesSteps.includes(stepName))
            .forEach((stepName) => {
                const step = this.steps[stepName];

                content[stepName] = step.generateContent(formdata[step.section], formdata);
                content[stepName].url = step.constructor.getUrl();
            });
        content[this.name] = super.generateContent(ctx, formdata);
        content[this.name].url = CopiesSummary.getUrl();
        return content;
    }

    generateFields (ctx, errors, formdata) {
        const fields = {};
        Object.keys(this.steps).filter(stepName => copiesSteps.includes(stepName))
            .forEach(stepName => {
                const step = this.steps[stepName];
                if (!fields[step.section]) {
                    fields[step.section] = step.generateFields(formdata[step.section], errors, formdata);
                }
            });
        fields[this.section] = super.generateFields(ctx, errors, formdata);
        return fields;
    }

    getContextData(req) {
        const formdata = req.session.form;
        const ctx = super.getContextData(req);
        const deceasedName = FormatName.format(formdata.deceased);
        const content = this.generateContent(ctx, formdata);

        ctx.assetsOverseasQuestion = content.AssetsOverseas.question.replace('{deceasedName}', deceasedName);

        return ctx;
    }
}

module.exports = CopiesSummary;
