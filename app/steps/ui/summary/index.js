'use strict';

const caseTypes = require('app/utils/CaseTypes');
const Step = require('app/core/steps/Step');
const OptionGetRunner = require('app/core/runners/OptionGetRunner');
const {isEmpty, includes, get, unescape, forEach} = require('lodash');
const utils = require('app/components/step-utils');
const ExecutorsWrapper = require('app/wrappers/Executors');
const WillWrapper = require('app/wrappers/Will');
const FormatName = require('app/utils/FormatName');
const CheckAnswersSummaryJSONObjectBuilder = require('app/utils/CheckAnswersSummaryJSONObjectBuilder');
const checkAnswersSummaryJSONObjBuilder = new CheckAnswersSummaryJSONObjectBuilder();
const IhtThreshold = require('app/utils/IhtThreshold');
const featureToggle = require('app/utils/FeatureToggle');
const exceptedEstateDod = require('app/utils/ExceptedEstateDod');
const IhtEstateValuesUtil = require('app/utils/IhtEstateValuesUtil');

class Summary extends Step {

    runner() {
        return new OptionGetRunner();
    }

    static getUrl(redirect = '*') {
        return `/summary/${redirect}`;
    }

    handleGet(ctx, formdata) {
        const executorsWrapper = new ExecutorsWrapper(formdata.executors);
        const executorsApplying = executorsWrapper.executorsApplying(true);

        ctx.executorsAlive = executorsWrapper.hasAliveExecutors();
        ctx.executorsWhoDied = executorsWrapper.deadExecutors().map(exec => exec.fullName);
        ctx.executorsDealingWithEstate = executorsApplying.map(exec => exec.fullName);
        ctx.executorsPowerReservedOrRenounced = executorsWrapper.hasRenunciatedOrPowerReserved();
        ctx.executorsWithOtherNames = executorsWrapper.executorsWithAnotherName().map(exec => exec.fullName);

        utils.updateTaskStatus(ctx, ctx, null, this.steps);
        return [ctx, null];
    }

    generateContent(ctx, formdata, language) {
        const content = {};

        Object.keys(this.steps).filter((stepName) => stepName !== this.name)
            .forEach((stepName) => {
                const step = this.steps[stepName];
                content[stepName] = step.generateContent(formdata[step.section], formdata, language);
                content[stepName].url = step.constructor.getUrl();
            });
        content[this.name] = super.generateContent(ctx, formdata, language);
        content[this.name].url = Summary.getUrl();
        return content;
    }

    generateFields(language, ctx, errors, formdata) {
        const fields = {};
        Object.keys(this.steps).filter((stepName) => stepName !== this.name)
            .forEach((stepName) => {
                const step = this.steps[stepName];
                if (isEmpty(fields[step.section])) {
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
            fields.isGaEnabled = {
                value: ctx.isGaEnabled.toString()
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

    // eslint-disable-next-line complexity
    getContextData(req) {
        const formdata = req.session.form;
        formdata.summary = {'readyToDeclare': includes(req.url, 'declaration')};
        const ctx = super.getContextData(req);
        const willWrapper = new WillWrapper(formdata.will);
        const deceasedName = FormatName.format(formdata.deceased);
        const content = this.generateContent(ctx, formdata, req.session.language);
        const hasCodicils = willWrapper.hasCodicils();
        ctx.ihtTotalNetValue = get(formdata, 'iht.netValue', 0);
        ctx.deceasedAliasQuestion = content.DeceasedAlias.question
            .replace('{deceasedName}', deceasedName ? deceasedName : content.DeceasedAlias.theDeceased);
        ctx.diedEnglandOrWalesQuestion = content.DiedEnglandOrWales.question
            .replace('{deceasedName}', deceasedName ? deceasedName : content.DiedEnglandOrWales.theDeceased);
        if (ctx.caseType === caseTypes.GOP) {
            ctx.deceasedMarriedQuestion = (hasCodicils ? content.DeceasedMarried.questionWithCodicil : content.DeceasedMarried.question)
                .replace('{deceasedName}', deceasedName);
            ctx.deceasedNameAsOnWillQuestion = content.DeceasedNameAsOnWill.question
                .replace('{deceasedName}', deceasedName ? deceasedName : content.DeceasedNameAsOnWill.theDeceased);
            ctx.aliasNameOnWill = FormatName.formatAliasNameOnWIll(formdata.deceased);
            ctx.codicilPresent = hasCodicils;
        } else {
            ctx.ihtThreshold = IhtThreshold.getIhtThreshold(new Date(get(formdata, 'deceased.dod-date')));
            ctx.deceasedMaritalStatusQuestion = content.DeceasedMaritalStatus.question
                .replace('{deceasedName}', deceasedName ? deceasedName : content.DeceasedMaritalStatus.theDeceased);
            ctx.deceasedDivorcePlaceQuestion = content.DivorcePlace.question
                .replace('{legalProcess}', (formdata.deceased && formdata.deceased.maritalStatus === content.DeceasedMaritalStatus.optionDivorced) ? content.DeceasedMaritalStatus.divorce : content.DeceasedMaritalStatus.separation);
            ctx.deceasedAnyChildrenQuestion = content.AnyChildren.question
                .replace('{deceasedName}', deceasedName ? deceasedName : content.AnyChildren.theDeceased);
            ctx.deceasedAnyOtherChildrenQuestion = content.AnyOtherChildren.question
                .replace('{deceasedName}', deceasedName ? deceasedName : content.AnyOtherChildren.theDeceased);
            ctx.deceasedAnyDeceasedChildrenQuestion = content.AnyDeceasedChildren.question
                .replace('{deceasedName}', deceasedName ? deceasedName : content.AnyDeceasedChildren.theDeceased)
                .replace('{deceasedDoD}', (formdata.deceased && formdata.deceased['dod-formattedDate']) ? formdata.deceased['dod-formattedDate'] : '');
            ctx.deceasedAllChildrenOver18Question = content.AllChildrenOver18.question
                .replace('{deceasedName}', deceasedName ? deceasedName : content.AllChildrenOver18.theDeceased);
            ctx.deceasedSpouseNotApplyingReasonQuestion = content.SpouseNotApplyingReason.question
                .replace('{deceasedName}', deceasedName ? deceasedName : content.SpouseNotApplyingReason.theDeceased);

            if (ctx.caseType === caseTypes.INTESTACY && formdata.iht && formdata.iht.assetsOutside === 'optionYes') {
                ctx.ihtTotalNetValue += formdata.iht.netValueAssetsOutside;
            }
            ctx.ihtTotalNetValueGreaterThanIhtThreshold = (ctx.ihtTotalNetValue > ctx.ihtThreshold);
        }

        if (formdata.documents && formdata.documents.uploads) {
            ctx.uploadedDocuments = formdata.documents.uploads.map(doc => doc.filename);
        }

        ctx.softStop = this.anySoftStops(formdata, ctx);
        ctx.alreadyDeclared = this.alreadyDeclared(req.session);
        ctx.session = req.session;
        ctx.authToken = req.authToken;

        this.setToggleOnContext(ctx, req);

        this.ctx = this.getExceptedEstatesContext(ctx, formdata);

        return ctx;
    }

    getExceptedEstatesContext(ctx, formdata) {
        if (formdata.deceased && formdata.deceased['dod-date']) {
            ctx.exceptedEstateDodAfterThreshold = exceptedEstateDod.afterEeDodThreshold(formdata.deceased['dod-date']);
        }

        if (formdata.iht && formdata.iht.estateNetQualifyingValue) {
            ctx.withinNetQualifyingRange = IhtEstateValuesUtil.withinRange(formdata.iht.estateNetQualifyingValue);
        }
        return ctx;
    }

    setToggleOnContext(ctx, req) {
        if (featureToggle.isEnabled(req.session.featureToggles, 'ft_will_condition')) {
            ctx.featureToggles = req.session.featureToggles;
        }
    }

    renderPage(res, html) {
        res.req.session.form.checkAnswersSummary = checkAnswersSummaryJSONObjBuilder.build(html);
        res.send(html);
    }
}

module.exports = Summary;
