'use strict';

const Step = require('app/core/steps/Step');
const {format} = require('../../../utils/FormatName');

class StopPage extends Step {

    static getUrl(reason = '*') {
        return `/stop-page/${reason}`;
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.stopReason = req.params[0];

        const formdata = req.session.form;

        ctx.stoppageHeader = this.returnStopPageHeader(ctx.stopReason);

        ctx.deceasedName = format(formdata.deceased);
        ctx.applicantName = formdata.executors?.list?.[formdata.executors.list.length - 1]?.fullName;
        const templateContent = this.generateContent(ctx, formdata, req.session.language)[ctx.stopReason];

        if (templateContent) {
            ctx.linkPlaceholders = this.replaceLinkPlaceholders(templateContent);
        }

        return ctx;
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.stopReason;
        delete ctx.linkPlaceholders;
        delete ctx.stoppageHeader;
        return [ctx, formdata];
    }

    replaceLinkPlaceholders(templateContent) {
        const linkPlaceholders = templateContent.match(/{(.*?)}/g);

        if (linkPlaceholders) {
            return linkPlaceholders.map(placeholder => placeholder.substr(1, placeholder.length - 2));
        }

        return [];
    }

    // eslint-disable-next-line complexity
    returnStopPageHeader(stopReason) {
        let pageHeader;
        switch (stopReason) {
        case 'deathCertificate':
            pageHeader = 'deathCertificateHeader';
            break;
        case 'deathCertificateTranslation':
            pageHeader = 'deathCertificateTranslationHeader';
            break;
        case 'notInEnglandOrWales':
            pageHeader = 'applyByPostHeader';
            break;
        case 'ihtNotCompleted':
            pageHeader = 'inheritanceHeader';
            break;
        case 'eeEstateNotValued':
            pageHeader = 'eeEstateValuedHeader';
            break;
        case 'notDiedAfterOctober2014':
            pageHeader = 'applyByPostHeader';
            break;
        case 'notRelated':
            pageHeader = 'applyByPostHeader';
            break;
        case 'notOriginal':
            pageHeader = 'notOriginalHeader';
            break;
        case 'notExecutor':
            pageHeader = 'applyByPostHeader';
            break;
        case 'mentalCapacity':
            pageHeader = 'applyByPostHeader';
            break;
        case 'deceasedHadLegalPartnerAndRelationshipOther':
            pageHeader = 'deceasedHadLegalPartnerAndRelationshipOtherHeader';
            break;
        case 'deceasedNoLegalPartnerAndRelationshipOther':
            pageHeader = 'deceasedNoLegalPartnerAndRelationshipOtherHeader';
            break;
        case 'divorcePlace':
        case 'separationPlace':
            pageHeader = 'postHeader';
            break;
        case 'spouseNotApplying':
        case 'adoptionNotEnglandOrWales':
        case 'adoptedOut':
        case 'childrenUnder18':
        case 'coApplicantAdoptionPlaceStop':
        case 'coApplicantAdoptedOutStop':
        case 'coApplicantParentAdoptedOutStop':
        case 'grandchildrenUnder18':
            pageHeader = 'cannotApplyByOnlineHeader';
            break;
        case 'otherCoApplicantRelationship':
            pageHeader = 'personCannotApplyByOnlineHeader';
            break;
        default:
            pageHeader = 'defaultHeader';
        }

        return pageHeader;
    }
}

module.exports = StopPage;
