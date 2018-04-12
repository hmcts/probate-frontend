const Step = require('app/core/steps/Step');
const OptionGetRunner = require('app/core/runners/OptionGetRunner');
const FieldError = require('app/components/error');
const {isEmpty, map, includes, get, filter, some} = require('lodash');
const utils = require('app/components/step-utils');
const services = require('app/components/services');
const ExecutorsWrapper = require('app/wrappers/Executors');
const WillWrapper = require('app/wrappers/Will');

module.exports = class Summary extends Step {

    runner() {
        return new OptionGetRunner();
    }

    static getUrl(redirect = '*') {
        return `/summary/${redirect}`;
    }

    * handleGet(ctx, formdata) {
        const result = yield this.validateFormData(ctx, formdata);
        const errors = map(result.errors, err => {
            return FieldError(err.param, err.code, this.resourcePath, ctx);
        });
        const executors = get(formdata, 'executors', {});
        const executorsApplying = (new ExecutorsWrapper(executors)).executorsApplying(true);
        const executorsList = get(formdata, 'executors.list', []);

        ctx.executorsAlive = some(filter(executorsList, exec => !exec.isDead && !exec.isApplicant));
        ctx.executorsWhoDied = filter(executorsList, exec => exec.isDead).map(exec => exec.fullName);
        ctx.executorsDealingWithEstate = executorsApplying.map(exec => exec.fullName);
        ctx.executorsPowerReservedOrRenounced = some(
            executorsList,
            exec => includes(['optionPowerReserved', 'optionRenunciated'], exec.notApplyingKey)
        );

        utils.updateTaskStatus(ctx, ctx, this.steps);

        return [ctx, !isEmpty(errors) ? errors : null];
    }

    * validateFormData(ctx, formdata) {
        return services.validateFormData(formdata, ctx.sessionID);
    }

    generateContent (ctx, formdata) {
        const content = {};

        Object.keys(this.steps).filter((stepName) => stepName !== this.name)
            .forEach((stepName) => {
                const step = this.steps[stepName];
                content[stepName] = step.generateContent(formdata[step.section], formdata);
                content[stepName].url = step.constructor.getUrl();
            });
        content[this.name] = super.generateContent(ctx, formdata);
        content[this.name].url = Summary.getUrl();
        return content;
    }

    generateFields (ctx, errors, formdata) {
        const fields = {};
        Object.keys(this.steps).filter((stepName) => stepName !== this.name)
            .forEach((stepName) => {
                const step = this.steps[stepName];
                if (isEmpty(fields[step.section])) {
                    fields[step.section] = step.generateFields(formdata[step.section], errors, formdata);
                }
            });
        fields[this.section] = super.generateFields(ctx, errors, formdata);
        return fields;
    }

    getContextData (req) {
        const formdata = req.session.form;
        formdata.summary = {'readyToDeclare': includes(req.url, 'declaration')}
        const ctx = super.getContextData(req);
        const willWrapper = new WillWrapper(formdata.will);
        const isWillDated = willWrapper.hasWillDate();
        const isCodicilDated = willWrapper.hasCodicilsDate();

        ctx.codicilPresent = willWrapper.hasCodicils();
        ctx.softStop = this.anySoftStops(formdata, ctx);
        ctx.alreadyDeclared = this.alreadyDeclared(req.session);
        ctx.session = req.session;
        ctx.deceasedMarriedAfterDateOnCodicilOrWill = isCodicilDated || (!ctx.codicilPresent && isWillDated);
        return ctx;
    }
};
