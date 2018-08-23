const ValidationStep = require('app/core/steps/ValidationStep');
const executorNotifiedContent = require('app/resources/en/translation/executors/notified');
const executorContent = require('app/resources/en/translation/executors/executorcontent');
const {get} = require('lodash');
const ExecutorsWrapper = require('app/wrappers/Executors');
const services = require('app/components/services');
const WillWrapper = require('app/wrappers/Will');
const FormatName = require('app/utils/FormatName');

module.exports = class Declaration extends ValidationStep {
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
        ctx.hasMultipleApplicants = ctx.executorsWrapper.hasMultipleApplicants(get(formdata, 'executors.list'));
        ctx.executorsEmailChanged = ctx.executorsWrapper.hasExecutorsEmailChanged();
        ctx.invitesSent = get(formdata, 'executors.invitesSent');
        return ctx;
    }

    prepareDataForTemplate(ctx, content, formdata) {
        const applicant = formdata.applicant || {};
        const deceased = formdata.deceased || {};
        const iht = formdata.iht || {};
        const hasCodicils = (new WillWrapper(formdata.will)).hasCodicils();
        const applicantName = FormatName.format(applicant);
        const deceasedName = FormatName.format(deceased);
        const executorsApplying = ctx.executorsWrapper.executorsApplying();
        const executorsNotApplying = ctx.executorsWrapper.executorsNotApplying();
        const deceasedOtherNames = this.formatMultipleNames(get(deceased, 'otherNames'), content);
        const hasMultipleApplicants = ctx.executorsWrapper.hasMultipleApplicants();
        const multipleApplicantSuffix = this.multipleApplicantSuffix(hasMultipleApplicants);
        const legalStatement = {
            intro: content[`intro${multipleApplicantSuffix}`]
                .replace('{applicantName}', applicantName),
            applicant: content[`legalStatementApplicant${multipleApplicantSuffix}`]
                .replace('{detailsOfApplicants}', this.formatMultipleNames(executorsApplying, content, applicant.address))
                .replace('{applicantName}', applicantName)
                .replace('{applicantAddress}', applicant.address),
            deceased: content.legalStatementDeceased
                .replace('{deceasedName}', deceasedName)
                .replace('{deceasedAddress}', deceased.address)
                .replace('{deceasedDob}', deceased.dob_formattedDate)
                .replace('{deceasedDod}', deceased.dod_formattedDate),
            deceasedOtherNames: deceasedOtherNames ? content.deceasedOtherNames.replace('{deceasedOtherNames}', deceasedOtherNames) : '',
            executorsApplying: this.executorsApplying(hasMultipleApplicants, executorsApplying, content, hasCodicils, deceasedName, applicantName),
            deceasedEstateValue: content.deceasedEstateValue
                .replace('{ihtGrossValue}', iht.grossValue)
                .replace('{ihtNetValue}', iht.netValue),
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

    formatName(person, useOtherName) {
        if (useOtherName && person.hasOtherName) {
            return person.currentName;
        } else if (person.fullName) {
            return person.fullName;
        }
        return FormatName.format(person);
    }

    codicilsSuffix(hasCodicils) {
        return hasCodicils ? '-codicils' : '';
    }

    multipleApplicantSuffix(hasMultipleApplicants) {
        return hasMultipleApplicants ? '-multipleApplicants' : '';
    }

    getNameAndAddress(person, contentOf, applicantAddress) {
        const fullName = this.formatName(person, true);
        const address = person.isApplicant ? applicantAddress : person.address;
        return address ? `${fullName} ${contentOf} ${address}` : fullName;
    }

    delimitNames(formattedNames, separator, contentAnd) {
        const lastCommaPos = formattedNames.lastIndexOf(separator);
        if (lastCommaPos > -1) {
            return `${formattedNames.substring(0, lastCommaPos)} ${contentAnd} ${formattedNames.substring(lastCommaPos + separator.length)}`;
        }
        return formattedNames;
    }

    formatMultipleNames(persons, content, applicantAddress) {
        if (persons) {
            const separator = ', ';
            const formattedNames = Object.keys(persons)
                .map(key => this.getNameAndAddress(persons[key], content.of, applicantAddress))
                .join(separator);
            return this.delimitNames(formattedNames, separator, content.and);
        }
    }

    executorsApplying(hasMultipleApplicants, executorsApplying, content, hasCodicils, deceasedName, mainApplicantName) {
        const multipleApplicantSuffix = this.multipleApplicantSuffix(hasMultipleApplicants);
        return executorsApplying.map(executor => {
            return this.executorsApplyingText({
                hasCodicils,
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
        const applicantNameOnWill = this.formatName(props.executor);
        const applicantCurrentName = this.formatName(props.executor, true);
        return {
            name: props.content[`applicantName${props.multipleApplicantSuffix}${mainApplicantSuffix}${codicilsSuffix}`]
                .replace('{applicantName}', props.mainApplicantName)
                .replace('{applicantCurrentName}', applicantCurrentName)
                .replace('{applicantNameOnWill}', props.executor.hasOtherName ? ` ${props.content.as} ${applicantNameOnWill}` : ''),
            sign: props.content[`applicantSign${props.multipleApplicantSuffix}${mainApplicantSuffix}${codicilsSuffix}`]
                .replace('{applicantName}', props.mainApplicantName)
                .replace('{applicantCurrentName}', applicantCurrentName)
                .replace('{deceasedName}', props.deceasedName)
        };
    }

    executorsNotApplying(executorsNotApplying, content, deceasedName, hasCodicils) {
        return executorsNotApplying.map(executor => {
            return content[`executorNotApplyingReason${this.codicilsSuffix(hasCodicils)}`]
                .replace('{otherExecutorName}', this.formatName(executor))
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
                {key: 'hasEmailChanged', value: true, choice: 'executorEmailChanged'},
                {key: 'hasDataChangedAfterEmailSent', value: true, choice: 'dataChangedAfterEmailSent'},
                {key: 'hasMultipleApplicants', value: true, choice: 'otherExecutorsApplying'}
            ]
        };
        return nextStepOptions;
    }

    resetAgreedFlags(executorsInvited) {
        const data = {agreed: null};
        const promises = executorsInvited.map(exec => services.updateInviteData(exec.inviteId, data));
        return Promise.all(promises);
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.hasMultipleApplicants;

        if (ctx.hasDataChanged === true) {
            this.resetAgreedFlags(ctx.executorsWrapper.executorsInvited());
        }

        delete ctx.executorsWrapper;
        delete ctx.hasDataChanged;
        delete ctx.hasEmailChanged;
        delete ctx.executorsEmailChanged;
        delete ctx.hasDataChangedAfterEmailSent;
        delete ctx.invitesSent;
        return [ctx, formdata];
    }
};
