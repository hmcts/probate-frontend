'use strict';

const config = require('config');
const ApplicantWrapper = require('app/wrappers/Applicant');
const DeceasedWrapper = require('app/wrappers/Deceased');

class DocumentPageUtil {

    static getCheckListItems(ctx, content) {
        const checkListItems = [];
        if (ctx.ccdReferenceNumber) {
            checkListItems.push(content['checklist-item1-application-coversheet'].replace('{ccdReferenceNumber}', ctx.ccdReferenceNumber));
        }
        if (ctx.hasCodicils && ctx.codicilsNumber > 0) {
            checkListItems.push(content['checklist-item2-codicils']);
        } else {
            checkListItems.push(content['checklist-item2-no-codicils']);
        }
        if (ctx.deceasedWrittenWishes) {
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
            checkListItems.push(content['checklist-item8-renunciated'].replace('{renunciationFormLink}', config.links.renunciationForm));
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
        const checkListItems = [];

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
}

module.exports = DocumentPageUtil;
