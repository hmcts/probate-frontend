/*eslint complexity: ["off"]*/

'use strict';

const config = require('config');
const ApplicantWrapper = require('app/wrappers/Applicant.cjs');
const DeceasedWrapper = require('app/wrappers/Deceased.cjs');
const WillWrapper = require('app/wrappers/Will.cjs');
const DeathCertificateWrapper = require('app/wrappers/DeathCertificate.cjs');
const ExecutorsWrapper = require('app/wrappers/Executors.cjs');
const DocumentsWrapper = require('app/wrappers/Documents.cjs');
const caseTypes = require('app/utils/CaseTypes.cjs');
const ExceptedEstateDod = require('./ExceptedEstateDod.cjs');
const {get} = require('lodash');

class DocumentPageUtil {

    static getCheckListItems(ctx, content) {
        const checkListItems = [];
        if (ctx.ccdReferenceNumber) {
            checkListItems.push(content['checklist-item1-application-coversheet'].replace('{ccdReferenceNumber}', ctx.ccdReferenceNumber));
        }
        if (ctx.caseType === caseTypes.GOP) {
            if (ctx.hasCodicils && ctx.codicilsNumber > 0) {
                checkListItems.push(content['checklist-item2-codicils']);
            } else {
                checkListItems.push(content['checklist-item2-no-codicils']);
            }
        }
        if (ctx.deceasedWrittenWishes==='optionYes') {
            checkListItems.push(content['checklist-item3-codicils-written-wishes']);
        }
        if (ctx.interimDeathCertificate) {
            checkListItems.push(content['checklist-item4-interim-death-cert']);
        }
        if (ctx.foreignDeathCertificate) {
            checkListItems.push(content['checklist-item4-foreign-death-cert']);
        }
        if (ctx.foreignDeathCertTranslatedSeparately) {
            checkListItems.push(content['checklist-item4-foreign-death-cert-translation']);
            checkListItems.push(content['checklist-item5-foreign-death-cert-PA19'].replace('{applicationFormPA19}', config.links.applicationFormPA19));
        }
        if (ctx.is205) {
            checkListItems.push(content['checklist-item7-iht205']);
        }
        if (ctx.is207) {
            checkListItems.push(content['checklist-item10-iht207']);
        }
        if (ctx.hasRenunciated) {
            checkListItems.push(content['checklist-item8-renunciated'].replace('{applicationFormPA15}', config.links.applicationFormPA15).replace('{applicationFormPA17}', config.links.applicationFormPA17));
        }
        if (ctx.executorsNameChangedByDeedPollList && ctx.executorsNameChangedByDeedPollList.length > 0) {
            ctx.executorsNameChangedByDeedPollList.forEach(executor => {
                checkListItems.push(content['checklist-item9-deed-poll'].replace('{executorCurrentName}', executor));
            });
        }
        if (ctx.spouseRenouncing) {
            checkListItems.push(content['checklist-item6-spouse-renouncing'].replace('{renunciationFormLink}', config.links.renunciationForm));
        }
        if (ctx.isSpouseGivingUpAdminRights) {
            checkListItems.push(content['checklist-item11-spouse-giving-up-admin-rights-PA16'].replace('{spouseGivingUpAdminRightsPA16Link}', config.links.spouseGivingUpAdminRightsPA16Link));
        }
        return checkListItems;
    }

    static getCheckListItemsCoversheet(formdata, language = 'en') {
        const content = require(`app/resources/${language}/translation/documents`);
        const applicantWrapper = new ApplicantWrapper(formdata);
        const deceasedWrapper = new DeceasedWrapper(formdata.deceased);
        const willWrapper = new WillWrapper(formdata.will);
        const deathCertWrapper = new DeathCertificateWrapper(formdata.deceased);
        const executorsWrapper = new ExecutorsWrapper(formdata.executors);
        const checkListItems = [];

        if (this.noDocsRequired(formdata)) {
            return checkListItems;
        }

        if (formdata.caseType === caseTypes.GOP) {
            if (willWrapper.hasCodicils() && willWrapper.codicilsNumber() > 0) {
                checkListItems.push(this.getCheckListItemTextOnly(content['checklist-item2-codicils']));
            } else {
                checkListItems.push(this.getCheckListItemTextOnly(content['checklist-item2-no-codicils']));
            }
        }
        if (formdata.will && formdata.will.deceasedWrittenWishes==='optionYes') {
            checkListItems.push(this.getCheckListItemTextOnly(content['checklist-item3-codicils-written-wishes']));
        }
        if (deathCertWrapper.hasInterimDeathCertificate()) {
            checkListItems.push(this.getCheckListItemTextOnly(content['checklist-item4-interim-death-cert']));
        }
        if (deathCertWrapper.hasForeignDeathCertificate()) {
            checkListItems.push(this.getCheckListItemTextOnly(content['checklist-item4-foreign-death-cert']));
        }
        if (deathCertWrapper.isForeignDeathCertTranslatedSeparately()) {
            checkListItems.push(this.getCheckListItemTextOnly(content['checklist-item4-foreign-death-cert-translation']));
            checkListItems.push(this.getCheckListItemTextWithLink(content['checklist-item5-foreign-death-cert-PA19'], config.links.applicationFormPA19));
        }
        if (formdata.iht && ExceptedEstateDod.beforeEeDodThreshold(get(formdata, 'deceased.dod-date')) && (formdata.iht.form === 'optionIHT205' || formdata.iht.ihtFormId === 'optionIHT205')) {
            checkListItems.push(this.getCheckListItemTextOnly(content['checklist-item7-iht205']));
        }
        if (formdata.iht && (formdata.iht.form === 'optionIHT207' || formdata.iht.ihtFormEstateId === 'optionIHT207')) {
            checkListItems.push(this.getCheckListItemTextOnly(content['checklist-item10-iht207']));
        }
        if (executorsWrapper.hasRenunciated()) {
            checkListItems.push(this.getCheckListItemTextWithMultipleLinks(content['checklist-item8-renunciated'],
                [config.links.applicationFormPA15, config.links.applicationFormPA17]));
        }
        if (executorsWrapper.executorsNameChangedByDeedPoll() && executorsWrapper.executorsNameChangedByDeedPoll().length > 0) {
            executorsWrapper.executorsNameChangedByDeedPoll().forEach(executor => {
                checkListItems.push(this.getCheckListItemTextOnly(content['checklist-item9-deed-poll'].replace('{executorCurrentName}', executor)));
            });
        }
        if (deceasedWrapper.hasMarriedStatus() && applicantWrapper.isApplicantChild()) {
            checkListItems.push(this.getCheckListItemTextWithLink(content['checklist-item6-spouse-renouncing'], config.links.renunciationForm));
        }
        if (deceasedWrapper.hasMarriedStatus() && applicantWrapper.isApplicantChild() && applicantWrapper.isSpouseRenouncing() && !deceasedWrapper.hasAnyOtherChildren()) {
            checkListItems.push(this.getCheckListItemTextWithLink(content['checklist-item11-spouse-giving-up-admin-rights-PA16'], config.links.spouseGivingUpAdminRightsPA16Link));
        }

        return checkListItems;
    }

    static getCheckListItemTextOnly(contentCheckListItem) {
        return {text: contentCheckListItem, type: 'textOnly'};
    }

    static getCheckListItemTextWithLink(contentCheckListItem, link) {
        if (!link) {
            throw new Error('please pass in a valid url');
        }

        const splitContentItem = contentCheckListItem.split(/(<a.*?)<\/a>/g);

        for (let i = 0; i < splitContentItem.length; i++) {
            if (splitContentItem[i].includes('href')) {
                const linkText = splitContentItem[i].split('>')[1];
                return {text: linkText, type: 'textWithLink', url: link, beforeLinkText: splitContentItem[i-1], afterLinkText: splitContentItem[i+1]};
            }
        }
        throw new Error(`there is no link in content item: "${contentCheckListItem}"`);
    }
    static getCheckListItemTextWithMultipleLinks(contentCheckListItem, links) {
        if (!Array.isArray(links) || links.length === 0) {
            throw new Error('Please pass in a valid array of URLs');
        }

        const splitContentItem = contentCheckListItem.split(/(<a.*?<\/a>)/g);
        const segments = [];
        let linkIndex = 0;

        for (const part of splitContentItem) {
            if (part.includes('<a') && links[linkIndex]) {
                const start = part.indexOf('>') + 1;
                const end = part.indexOf('</a>', start);
                const linkText = (start > 0 && end > start) ? part.substring(start, end) : '';
                segments.push({text: linkText, link: links[linkIndex]});
                // eslint-disable-next-line no-plusplus
                linkIndex++;
            } else if (part.trim() !== '') {
                segments.push({text: part, link: null});
            }
        }

        return {
            type: 'textWithMultipleLinks',
            segments: segments
        };
    }
    static noDocsRequired(formdata) {
        const documentsWrapper = new DocumentsWrapper(formdata);
        return !documentsWrapper.documentsRequired();
    }

    static getNoDocsRequiredText(formdata, language = 'en') {
        const content = require(`app/resources/${language}/translation/documents`);
        if (this.noDocsRequired(formdata)) {
            return content['no-docs-required'];
        }
        return null;
    }
}

module.exports = DocumentPageUtil;
