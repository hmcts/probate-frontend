'use strict';

const {get} = require('lodash');
const applicant2NameFactory = require('app/utils/Applicant2NameFactory');

class IntestacyDeclarationFactory {

    static build(ctx, content, formdata) {
        const legalStatement = {
            intro: content.intro,
            applicant: content.legalStatementApplicant
                .replace('{applicantName}', formdata.applicantName)
                .replace('{applicantAddress}', formdata.applicantAddress.formattedAddress),
            deceased: content.intestacyLegalStatementDeceased
                .replace('{deceasedName}', formdata.deceasedName)
                .replace('{deceasedAddress}', formdata.deceasedAddress.formattedAddress)
                .replace('{deceasedDob}', formdata.dob_formattedDate)
                .replace('{deceasedDod}', formdata.dod_formattedDate),
            deceasedOtherNames: formdata.deceasedOtherNames ? content.deceasedOtherNames.replace('{deceasedOtherNames}', formdata.deceasedOtherNames) : '',
            deceasedMaritalStatus: content.intestacyDeceasedMaritalStatus
                .replace('{deceasedMaritalStatus}', get(formdata.deceased, 'maritalStatus', '').toLowerCase()),
            deceasedChildren: content.intestacyDeceasedChildren,
            deceasedEstateValue: content.deceasedEstateValue
                .replace('{ihtGrossValue}', formdata.ihtGrossValue)
                .replace('{ihtNetValue}', formdata.ihtNetValue),
            deceasedEstateAssetsOverseas: content.intestacyDeceasedEstateOutside
                .replace('{ihtNetValueAssetsOutside}', formdata.ihtNetValueAssetsOutside),
            deceasedEstateLand: content.intestacyDeceasedEstateLand
                .replace(/{deceasedName}/g, formdata.deceasedName),
            applying: content.intestacyLettersOfAdministration
                .replace('{deceasedName}', formdata.deceasedName)
        };

        legalStatement.applicant2 = applicant2NameFactory.getApplicant2Name(formdata, content);

        const declaration = {
            confirm: content.declarationConfirm
                .replace('{deceasedName}', formdata.deceasedName),
            confirmItem1: content.declarationConfirmItem1,
            confirmItem2: content.declarationConfirmItem2,
            confirmItem3: content['declarationConfirmItem3-intestacy'],
            requests: content.declarationRequests,
            requestsItem1: content['declarationRequestsItem1-intestacy'],
            requestsItem2: content['declarationRequestsItem2-intestacy'],
            understand: content.declarationUnderstand,
            understandItem1: content['declarationUnderstandItem1-intestacy'],
            understandItem2: content.declarationUnderstandItem2,
            accept: content.declarationCheckbox,
            submitWarning: content.submitWarning
        };

        return {legalStatement, declaration};
    }
}

module.exports = IntestacyDeclarationFactory;
