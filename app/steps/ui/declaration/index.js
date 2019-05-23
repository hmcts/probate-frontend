'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const executorNotifiedContent = require('app/resources/en/translation/executors/notified');
const executorContent = require('app/resources/en/translation/executors/executorcontent');
const {get} = require('lodash');
const ExecutorsWrapper = require('app/wrappers/Executors');
const WillWrapper = require('app/wrappers/Will');
const FormatName = require('app/utils/FormatName');
const FormatAlias = require('app/utils/FormatAlias');
const LegalDocumentJSONObjectBuilder = require('app/utils/LegalDocumentJSONObjectBuilder');
const legalDocumentJSONObjBuilder = new LegalDocumentJSONObjectBuilder();
const InviteData = require('app/services/InviteData');
const config = require('app/config');

class Declaration extends ValidationStep {
    static getUrl() {
        return '/declaration';
    }

    pruneFormData(body, ctx) {
        if (body && Object.keys(body).length > 0 && !Object.keys(body).includes('declarationCheckbox')) {
            delete ctx.declarationCheckbox;
        }
        return ctx;
    }

    getContextData(req) {
        let ctx = super.getContextData(req);
        ctx = this.pruneFormData(req.body, ctx);
        const formdata = req.session.form;
        ctx.executorsWrapper = new ExecutorsWrapper(formdata.executors);
        const templateData = this.prepareDataForTemplate(ctx, this.generateContent(ctx, formdata), formdata);
        Object.assign(ctx, templateData);
        ctx.softStop = this.anySoftStops(formdata, ctx);
        ctx.invitesSent = get(formdata, 'executors.invitesSent');
        ctx.hasMultipleApplicants = ctx.executorsWrapper.hasMultipleApplicants(get(formdata, 'executors.list'));
        ctx.executorsEmailChanged = ctx.executorsWrapper.hasExecutorsEmailChanged();
        ctx.hasExecutorsToNotify = ctx.executorsWrapper.hasExecutorsToNotify() && ctx.invitesSent === 'true';
        return ctx;
    }

    prepareDataForTemplate(ctx, content, formdata) {
        const applicant = formdata.applicant || {};
        const applicantAddress = get(applicant, 'address', {});
        const deceased = formdata.deceased || {};
        const deceasedAddress = get(deceased, 'address', {});
        const iht = formdata.iht || {};
        const ihtGrossValue = iht.grossValue ? iht.grossValue.toFixed(2) : 0;
        const ihtNetValue = iht.netValue ? iht.netValue.toFixed(2) : 0;
        const hasCodicils = (new WillWrapper(formdata.will)).hasCodicils();
        const codicilsNumber = (new WillWrapper(formdata.will)).codicilsNumber();
        const applicantName = FormatName.format(applicant);
        const deceasedName = FormatName.format(deceased);
        const executorsApplying = ctx.executorsWrapper.executorsApplying();
        const executorsNotApplying = ctx.executorsWrapper.executorsNotApplying();
        const deceasedOtherNames = FormatName.formatMultipleNamesAndAddress(get(deceased, 'otherNames'), content);
        const hasMultipleApplicants = ctx.executorsWrapper.hasMultipleApplicants();
        const multipleApplicantSuffix = this.multipleApplicantSuffix(hasMultipleApplicants);
        const legalStatement = {
            intro: content[`intro${multipleApplicantSuffix}`]
                .replace('{applicantName}', applicantName),
            applicant: content[`legalStatementApplicant${multipleApplicantSuffix}`]
                .replace('{detailsOfApplicants}', FormatName.formatMultipleNamesAndAddress(executorsApplying, content, applicantAddress))
                .replace('{applicantName}', applicantName)
                .replace('{applicantAddress}', applicantAddress.formattedAddress),
            deceased: content.legalStatementDeceased
                .replace('{deceasedName}', deceasedName)
                .replace('{deceasedAddress}', deceasedAddress.formattedAddress)
                .replace('{deceasedDob}', deceased.dob_formattedDate)
                .replace('{deceasedDod}', deceased.dod_formattedDate),
            deceasedOtherNames: deceasedOtherNames ? content.deceasedOtherNames.replace('{deceasedOtherNames}', deceasedOtherNames) : '',
            executorsApplying: this.executorsApplying(hasMultipleApplicants, executorsApplying, content, hasCodicils, codicilsNumber, deceasedName, applicantName),
            deceasedEstateValue: content.deceasedEstateValue
                .replace('{ihtGrossValue}', ihtGrossValue)
                .replace('{ihtNetValue}', ihtNetValue),
            deceasedEstateLand: content[`deceasedEstateLand${multipleApplicantSuffix}`]
                .replace(/{deceasedName}/g, deceasedName),
            executorsNotApplying: this.executorsNotApplying(executorsNotApplying, content, deceasedName, hasCodicils)
        };
        const declaration = {
            confirm: content[`declarationConfirm${multipleApplicantSuffix}`]
                .replace('{deceasedName}', deceasedName),
            confirmItem1: content.declarationConfirmItem1,
            confirmItem2: content.declarationConfirmItem2,
            confirmItem3: content.declarationConfirmItem3,
            requests: content[`declarationRequests${multipleApplicantSuffix}`],
            requestsItem1: content.declarationRequestsItem1,
            requestsItem2: content.declarationRequestsItem2,
            understand: content[`declarationUnderstand${multipleApplicantSuffix}`],
            understandItem1: content[`declarationUnderstandItem1${multipleApplicantSuffix}`],
            understandItem2: content[`declarationUnderstandItem2${multipleApplicantSuffix}`],
            accept: content.declarationCheckbox,
            submitWarning: content[`submitWarning${multipleApplicantSuffix}`],
        };

        return {legalStatement, declaration};
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

    executorsNotApplying(executorsNotApplying, content, deceasedName, hasCodicils) {
        return executorsNotApplying.map(executor => {
            return content[`executorNotApplyingReason${this.codicilsSuffix(hasCodicils)}`]
                .replace('{otherExecutorName}', FormatName.formatName(executor))
                .replace('{otherExecutorApplying}', this.executorsNotApplyingText(executor, content))
                .replace('{deceasedName}', deceasedName);
        });
    }

    executorsNotApplyingText(executor, content) {
        if (Object.keys(executorContent).includes(executor.notApplyingKey)) {
            let executorApplyingText = content[executor.notApplyingKey];

            if (executor.executorNotified === executorNotifiedContent.optionYes) {
                executorApplyingText += ` ${content.additionalExecutorNotified}`;
            }

            return executorApplyingText;
        }
    }

    nextStepOptions(ctx) {
        ctx.hasDataChangedAfterEmailSent = ctx.hasDataChanged && ctx.invitesSent === 'true';
        ctx.hasEmailChanged = ctx.executorsEmailChanged && ctx.invitesSent === 'true';
        const nextStepOptions = {
            options: [
                {key: 'hasExecutorsToNotify', value: true, choice: 'sendAdditionalInvites'},
                {key: 'hasEmailChanged', value: true, choice: 'executorEmailChanged'},
                {key: 'hasDataChangedAfterEmailSent', value: true, choice: 'dataChangedAfterEmailSent'},
                {key: 'hasMultipleApplicants', value: true, choice: 'otherExecutorsApplying'}
            ]
        };
        return nextStepOptions;
    }

    resetAgreedFlags(ctx) {
        const data = {agreed: null};
        const inviteData = new InviteData(config.services.persistence.url, ctx.sessionID);
        const promises = ctx.executorsWrapper
            .executorsInvited()
            .map(exec => inviteData.patch(exec.inviteId, data));
        return Promise.all(promises);
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
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
        return [ctx, formdata];
    }

    renderPage(res, html) {
        const formdata = res.req.session.form;
        formdata.legalDeclaration = legalDocumentJSONObjBuilder.build(formdata, html);
        res.send(html);
    }
}

module.exports = Declaration;
