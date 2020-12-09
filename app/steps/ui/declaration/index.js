'use strict';

const probateDeclarationFactory = require('app/utils/ProbateDeclarationFactory');
const intestacyDeclarationFactory = require('app/utils/IntestacyDeclarationFactory');
const ValidationStep = require('app/core/steps/ValidationStep');
const {mapValues, get} = require('lodash');
const ExecutorsWrapper = require('app/wrappers/Executors');
const WillWrapper = require('app/wrappers/Will');
const FormatName = require('app/utils/FormatName');
const FormatAlias = require('app/utils/FormatAlias');
const LegalDocumentJSONObjectBuilder = require('app/utils/LegalDocumentJSONObjectBuilder');
const legalDocumentJSONObjBuilder = new LegalDocumentJSONObjectBuilder();
const InviteData = require('app/services/InviteData');
const config = require('config');
const caseTypes = require('app/utils/CaseTypes');
const UploadLegalDeclaration = require('app/services/UploadLegalDeclaration');
const ServiceMapper = require('app/utils/ServiceMapper');
const FieldError = require('app/components/error');
const utils = require('app/components/step-utils');
const moment = require('moment');
const IhtThreshold = require('app/utils/IhtThreshold');

class Declaration extends ValidationStep {
    static getUrl() {
        return '/declaration';
    }

    constructor(steps, section = null, resourcePath, i18next, schema, language = 'en') {
        super(steps, section, resourcePath, i18next, schema, language);
        this.content = {
            en: require(`app/resources/en/translation/${resourcePath}`),
            cy: require(`app/resources/cy/translation/${resourcePath}`)
        };
    }

    pruneFormData(body, ctx) {
        if (body && Object.keys(body).length > 0 && !Object.keys(body).includes('declarationCheckbox')) {
            delete ctx.declarationCheckbox;
        }
        return ctx;
    }

    * handlePost(ctx, errors, formdata, session) {
        const result = yield this.validateFormData(formdata, ctx, session.req);
        let returnErrors;

        if (result.type === 'VALIDATION') {
            returnErrors = [FieldError('businessError', 'validationError', this.resourcePath, ctx, session.language)];
        } else {
            returnErrors = errors;
        }

        const uploadLegalDec = new UploadLegalDeclaration();
        formdata.statementOfTruthDocument =
            yield uploadLegalDec.generateAndUpload(ctx.sessionID, session.req.userId, session.req);
        session.form.statementOfTruthDocument = formdata.statementOfTruthDocument;
        return [ctx, returnErrors];
    }

    * validateFormData(data, ctx, req) {
        const validateData = ServiceMapper.map(
            'ValidateData',
            [config.services.orchestrator.url, ctx.sessionID]
        );
        return yield validateData.put(data, req.authToken, req.session.serviceAuthorization, caseTypes.getCaseType(req.session));
    }

    getFormDataForTemplate(content, formdata) {
        const formdataApplicant = formdata.applicant || {};
        formdata.applicantName = FormatName.format(formdataApplicant);
        formdata.applicantAddress = get(formdataApplicant, 'address', {});

        const formdataDeceased = formdata.deceased || {};
        formdata.deceasedName = FormatName.format(formdataDeceased);
        formdata.deceasedAddress = get(formdataDeceased, 'address', {});
        formdata.deceasedOtherNames = {
            en: FormatName.formatMultipleNamesAndAddress(get(formdataDeceased, 'otherNames'), content.en),
            cy: FormatName.formatMultipleNamesAndAddress(get(formdataDeceased, 'otherNames'), content.cy)
        };

        formdata.dobFormattedDate = {};
        formdata.dodFormattedDate = {};
        formdata.dobFormattedDate.en = formdataDeceased['dob-day'] ? utils.formattedDate(moment(formdataDeceased['dob-day'] + '/' + formdataDeceased['dob-month'] + '/' + formdataDeceased['dob-year'], config.dateFormat).parseZone(), 'en') : '';
        formdata.dodFormattedDate.en = formdataDeceased['dod-day'] ? utils.formattedDate(moment(formdataDeceased['dod-day'] + '/' + formdataDeceased['dod-month'] + '/' + formdataDeceased['dod-year'], config.dateFormat).parseZone(), 'en') : '';

        if (get(formdata, 'language.bilingual', 'optionNo') === 'optionYes') {
            formdata.dobFormattedDate.cy = formdataDeceased['dob-day'] ? utils.formattedDate(moment(formdataDeceased['dob-day'] + '/' + formdataDeceased['dob-month'] + '/' + formdataDeceased['dob-year'], config.dateFormat).parseZone(), 'cy') : '';
            formdata.dodFormattedDate.cy = formdataDeceased['dod-day'] ? utils.formattedDate(moment(formdataDeceased['dod-day'] + '/' + formdataDeceased['dod-month'] + '/' + formdataDeceased['dod-year'], config.dateFormat).parseZone(), 'cy') : '';
        }

        formdata.maritalStatus = formdataDeceased.maritalStatus;
        formdata.relationshipToDeceased = formdataApplicant.relationshipToDeceased;
        formdata.anyChildren = formdataDeceased.anyChildren;
        formdata.anyOtherChildren = formdataDeceased.anyOtherChildren;

        const formdataIht = formdata.iht || {};
        formdata.ihtGrossValue = formdataIht.grossValue ? formdataIht.grossValue.toFixed(2) : 0;
        formdata.ihtNetValue = formdataIht.netValue ? formdataIht.netValue.toFixed(2) : 0;
        formdata.ihtNetValueAssetsOutside = formdataIht.netValueAssetsOutside ? formdataIht.netValueAssetsOutside.toFixed(2) : 0;
        formdata.ihtTotalNetValue = formdataIht.netValue;
        formdata.ihtTotalNetValue += formdataIht.netValueAssetsOutside ? formdataIht.netValueAssetsOutside : 0;

        return formdata;
    }

    generateContent(ctx, formdata) {
        const contentCtx = Object.assign({}, formdata, ctx, this.commonProps);
        mapValues(this.content.en, (value, key) => this.i18next.t(`${this.resourcePath.replace(/\//g, '.')}.${key}`, contentCtx));
        mapValues(this.content.cy, (value, key) => this.i18next.t(`${this.resourcePath.replace(/\//g, '.')}.${key}`, contentCtx));
        return this.content;
    }

    getContextData(req) {
        let templateData;
        let ctx = super.getContextData(req);
        ctx = this.pruneFormData(req.body, ctx);
        const formdata = req.session.form;
        ctx.bilingual = (get(formdata, 'language.bilingual', 'optionNo') === 'optionYes').toString();
        ctx.language = req.session.language;
        const content = this.generateContent(ctx, formdata, req.session.language);
        const formDataForTemplate = this.getFormDataForTemplate(content, formdata);

        if (ctx.caseType === caseTypes.INTESTACY && formdata.iht) {
            ctx.ihtThreshold = IhtThreshold.getIhtThreshold(new Date(get(formdata, 'deceased.dod-date')));
            ctx.showNetValueAssetsOutside = ((formdata.iht.assetsOutside === 'optionYes' && (formdata.iht.netValue + formdata.iht.netValueAssetsOutside) > ctx.ihtThreshold)).toString();
            if (ctx.showNetValueAssetsOutside) {
                ctx.ihtNetValueAssetsOutside = formDataForTemplate.ihtNetValueAssetsOutside;
            }
            templateData = intestacyDeclarationFactory.build(ctx, content, formDataForTemplate);
        } else {
            ctx.executorsWrapper = new ExecutorsWrapper(formdata.executors);
            ctx.invitesSent = get(formdata, 'executors.invitesSent');
            ctx.hasMultipleApplicants = ctx.executorsWrapper.hasMultipleApplicants();
            ctx.executorsEmailChanged = ctx.executorsWrapper.hasExecutorsEmailChanged();
            ctx.hasExecutorsToNotify = ctx.executorsWrapper.hasExecutorsToNotify() && ctx.invitesSent;

            const hasCodicils = (new WillWrapper(formdata.will)).hasCodicils();
            const codicilsNumber = (new WillWrapper(formdata.will)).codicilsNumber();
            const multipleApplicantSuffix = this.multipleApplicantSuffix(ctx.hasMultipleApplicants);

            const executorsApplying = ctx.executorsWrapper.executorsApplying();
            const executorsApplyingText = {
                en: this.executorsApplying(ctx.hasMultipleApplicants, executorsApplying, content.en, hasCodicils, codicilsNumber, formdata.deceasedName, formdata.applicantName),
                cy: this.executorsApplying(ctx.hasMultipleApplicants, executorsApplying, content.cy, hasCodicils, codicilsNumber, formdata.deceasedName, formdata.applicantName)
            };

            const executorsNotApplying = ctx.executorsWrapper.executorsNotApplying();
            const executorsNotApplyingText = {
                en: this.executorsNotApplying(executorsNotApplying, content.en, formdata.deceasedName, hasCodicils, req.session.language),
                cy: this.executorsNotApplying(executorsNotApplying, content.cy, formdata.deceasedName, hasCodicils, req.session.language)
            };

            templateData = probateDeclarationFactory.build(ctx, content, formDataForTemplate, multipleApplicantSuffix, executorsApplying, executorsApplyingText, executorsNotApplyingText);
        }

        Object.assign(ctx, templateData);
        ctx.softStop = this.anySoftStops(formdata, ctx);
        return ctx;
    }

    codicilsSuffix(hasCodicils) {
        return hasCodicils ? '-codicils' : '';
    }

    multipleApplicantSuffix(hasMultipleApplicants) {
        return hasMultipleApplicants ? '-multipleApplicants' : '';
    }

    executorsApplying(hasMultipleApplicants, executorsApplying, content, hasCodicils, codicilsNumber, deceasedName, mainApplicantName) {
        const multipleApplicantSuffix = this.multipleApplicantSuffix(hasMultipleApplicants);
        return executorsApplying.map(executor => {
            return this.executorsApplyingText(
                {
                    hasCodicils,
                    codicilsNumber,
                    hasMultipleApplicants,
                    content,
                    multipleApplicantSuffix,
                    executor,
                    deceasedName,
                    mainApplicantName
                });
        });
    }

    executorsApplyingText(props) {
        const mainApplicantSuffix = (props.hasMultipleApplicants && props.executor.isApplicant) ? '-mainApplicant' : '';
        const codicilsSuffix = this.codicilsSuffix(props.hasCodicils);
        const applicantNameOnWill = FormatName.formatName(props.executor);
        const applicantCurrentName = FormatName.formatName(props.executor, true);
        const aliasSuffix = props.executor.alias || props.executor.currentName ? '-alias' : '';
        const aliasReason = FormatAlias.aliasReason(props.executor, props.hasMultipleApplicants);
        const content = {
            name: props.content[`applicantName${props.multipleApplicantSuffix}${mainApplicantSuffix}${aliasSuffix}${codicilsSuffix}`]
                .replace('{applicantWillName}', props.executor.isApplicant && props.executor.alias ? FormatName.applicantWillName(props.executor) : props.mainApplicantName)
                .replace(/{applicantCurrentName}/g, applicantCurrentName)
                .replace('{applicantNameOnWill}', props.executor.hasOtherName ? ` ${props.content.as} ${applicantNameOnWill}` : '')
                .replace('{aliasReason}', aliasReason),
            sign: ''
        };
        if (props.executor.isApplicant) {
            content.sign = props.content[`applicantSend${props.multipleApplicantSuffix}${mainApplicantSuffix}${codicilsSuffix}`]
                .replace('{applicantName}', props.mainApplicantName)
                .replace('{deceasedName}', props.deceasedName);

            if (props.hasCodicils) {
                if (props.codicilsNumber === 1) {
                    content.sign = content.sign
                        .replace('{codicilsNumber}', '')
                        .replace('{codicils}', props.content.codicil);
                } else {
                    content.sign = content.sign
                        .replace('{codicilsNumber}', props.codicilsNumber)
                        .replace('{codicils}', props.content.codicils);
                }
            }
        }
        return content;
    }

    executorsNotApplying(executorsNotApplying, content, deceasedName, hasCodicils, language) {
        return executorsNotApplying.map(executor => {
            return content[`executorNotApplyingReason${this.codicilsSuffix(hasCodicils)}`]
                .replace('{otherExecutorName}', FormatName.formatName(executor))
                .replace('{otherExecutorApplying}', this.executorsNotApplyingText(executor, content, language))
                .replace('{deceasedName}', deceasedName);
        });
    }

    executorsNotApplyingText(executor, content, language) {
        const executorContent = require(`app/resources/${language}/translation/executors/executorcontent`);

        if (Object.keys(executorContent).includes(executor.notApplyingKey)) {
            let executorApplyingText = content[executor.notApplyingKey];

            if (executor.executorNotified === 'optionYes') {
                executorApplyingText += ` ${content.additionalExecutorNotified}`;
            }
            return executorApplyingText;
        }
    }

    nextStepOptions(ctx) {
        console.log('hasDataChanged= ' + ctx.hasDataChanged);
        console.log('inviteSent= ' + ctx.invitesSent + ' and type = ' + (typeof ctx.invitesSent));
        ctx.hasDataChangedAfterEmailSent = ctx.hasDataChanged && ctx.invitesSent;
        ctx.hasEmailChanged = ctx.executorsEmailChanged && ctx.invitesSent;

        return {
            options: [
                {key: 'hasExecutorsToNotify', value: true, choice: 'sendAdditionalInvites'},
                {key: 'hasEmailChanged', value: true, choice: 'executorEmailChanged'},
                {key: 'hasDataChangedAfterEmailSent', value: true, choice: 'dataChangedAfterEmailSent'},
                {key: 'hasMultipleApplicants', value: true, choice: 'otherExecutorsApplying'}
            ]
        };
    }

    resetAgreedFlags(ctx) {
        const inviteData = new InviteData(config.services.orchestrator.url, ctx.sessionID);
        const promise = inviteData.resetAgreedFlag(ctx.ccdCase.id, ctx);
        return promise;
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.showNetValueAssetsOutside;
        delete ctx.ihtNetValueAssetsOutside;
        delete ctx.hasMultipleApplicants;

        if (ctx.hasDataChanged === true) {
            this.resetAgreedFlags(ctx);
        }

        delete ctx.executorsWrapper;
        delete ctx.hasDataChanged;
        delete ctx.hasExecutorsToNotify;
        delete ctx.executorsEmailChanged;
        delete ctx.hasDataChangedAfterEmailSent;
        delete ctx.invitesSent;
        delete ctx.serviceAuthorization;
        delete ctx.authToken;
        delete ctx.bilingual;
        delete ctx.language;
        return [ctx, formdata];
    }

    renderPage(res, html) {
        const formdata = res.req.session.form;
        res.req.session.form.legalDeclaration = legalDocumentJSONObjBuilder.build(formdata, html);
        res.send(html);
    }

    isComplete(ctx, formdata) {
        return [get(formdata, 'declaration.declarationCheckbox') === 'true', 'inProgress'];
    }
}

module.exports = Declaration;
