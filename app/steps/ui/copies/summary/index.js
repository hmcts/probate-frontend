'use strict';

const Step = require('app/core/steps/Step');
const copiesSteps = ['CopiesUk', 'AssetsJEGG', 'CopiesJEGG', 'AssetsOverseas', 'CopiesOverseas'];
const FormatName = require('app/utils/FormatName');
const {unescape, forEach} = require('lodash');

class CopiesSummary extends Step {

    static getUrl() {
        return '/copies-summary*';
    }

    generateContent(ctx, formdata, language) {
        const content = {};

        Object.keys(this.steps).filter(stepName => copiesSteps.includes(stepName))
            .forEach((stepName) => {
                const step = this.steps[stepName];
                content[stepName] = step.generateContent(formdata[step.section], formdata, language);
                content[stepName].url = step.constructor.getUrl();
            });
        content[this.name] = super.generateContent(ctx, formdata, language);
        content[this.name].url = CopiesSummary.getUrl();
        return content;
    }

    generateFields(language, ctx, errors, formdata) {
        const fields = {};
        Object.keys(this.steps).filter(stepName => copiesSteps.includes(stepName))
            .forEach((stepName) => {
                const step = this.steps[stepName];
                if (!fields[step.section]) {
                    fields[step.section] = step.generateFields(language, formdata[step.section], errors, formdata);
                }
            });
        fields[this.section] = super.generateFields(language, ctx, errors, formdata);

        if (ctx) {
            fields.userLoggedIn = {
                value: ctx.userLoggedIn ? ctx.userLoggedIn.toString() : 'true'
            };
            fields.featureToggles = {
                value: ctx.featureToggles
            };

            const skipItems = ['sessionID', 'authToken', 'caseType', 'userLoggedIn', 'uploadedDocuments'];

            forEach(fields[this.section], (item, itemKey) => {
                if (!skipItems.includes(itemKey) && typeof item.value === 'string' && item.value !== 'true' && item.value !== 'false') {
                    item.value = unescape(item.value);
                }

                return item;
            });
        }

        return fields;
    }

    getContextData(req) {
        const formdata = req.session.form;
        const ctx = super.getContextData(req);
        const deceasedName = FormatName.format(formdata.deceased);
        const content = this.generateContent(ctx, formdata, req.session.language);

        ctx.assetsOverseasQuestion = content.AssetsOverseas.question.replace('{deceasedName}', deceasedName);

        return ctx;
    }
}

module.exports = CopiesSummary;
