'use strict';

const applicant2NameFactory = require('app/utils/Applicant2NameFactory');
const {get} = require('lodash');
const IhtThreshold = require('app/utils/IhtThreshold');

class IntestacyDeclarationFactory {

    static build(ctx, content, formdata) {
        const legalStatement = {};
        const declaration = {};
        const ihtThreshold = IhtThreshold.getIhtThreshold(new Date(get(formdata, 'deceased.dod-date')));

        legalStatement.en = {
            intro: content.en.intro,
            applicant: content.en.legalStatementApplicant
                .replace('{applicantName}', formdata.applicantName)
                .replace('{applicantAddress}', formdata.applicantAddress.formattedAddress),
            deceased: content.en.intestacyLegalStatementDeceased
                .replace('{deceasedName}', formdata.deceasedName)
                .replace('{deceasedAddress}', formdata.deceasedAddress.formattedAddress)
                .replace('{deceasedDob}', formdata.dobFormattedDate.en)
                .replace('{deceasedDod}', formdata.dodFormattedDate.en),
            deceasedOtherNames: (formdata.deceasedOtherNames && formdata.deceasedOtherNames.en) ? content.en.deceasedOtherNames.replace('{deceasedOtherNames}', formdata.deceasedOtherNames.en) : '',
            deceasedMaritalStatus: content.en.intestacyDeceasedMaritalStatus
                .replace('{deceasedMaritalStatus}', this.getMaritalStatus(formdata, content.en)),
            deceasedChildren: content.en.intestacyDeceasedChildren,
            deceasedEstateValue: content.en.deceasedEstateValue
                .replace('{ihtGrossValue}', formdata.ihtGrossValue)
                .replace('{ihtNetValue}', formdata.ihtNetValue),
            deceasedEstateValueExceptedEstateConfirmation: content.en.deceasedEstateValueExceptedEstateConfirmation,
            deceasedEstateAssetsOverseas: content.en.intestacyDeceasedEstateOutside
                .replace('{ihtNetValueAssetsOutside}', formdata.ihtNetValueAssetsOutside),
            deceasedEstateLand: content.en.intestacyDeceasedEstateLand
                .replace(/{deceasedName}/g, formdata.deceasedName),
            applying: content.en.intestacyLettersOfAdministration
                .replace('{deceasedName}', formdata.deceasedName)
        };
        legalStatement.en.applicant2 = applicant2NameFactory.getApplicant2Name(formdata, content.en, ihtThreshold);
        declaration.en = {
            confirm: content.en.declarationConfirm
                .replace('{deceasedName}', formdata.deceasedName),
            confirmItem1: content.en.declarationConfirmItem1,
            confirmItem2: content.en.declarationConfirmItem2,
            confirmItem3: content.en['declarationConfirmItem3-intestacy'],
            requests: content.en.declarationRequests,
            requestsItem1: content.en['declarationRequestsItem1-intestacy'],
            requestsItem2: content.en['declarationRequestsItem2-intestacy'],
            understand: content.en.declarationUnderstand,
            understandItem1: content.en['declarationUnderstandItem1-intestacy'],
            understandItem2: content.en.declarationUnderstandItem2,
            accept: content.en.declarationCheckbox,
            submitWarning: content.en.submitWarning
        };

        legalStatement.cy = {
            intro: content.cy.intro,
            applicant: content.cy.legalStatementApplicant
                .replace('{applicantName}', formdata.applicantName)
                .replace('{applicantAddress}', formdata.applicantAddress.formattedAddress),
            deceased: content.cy.intestacyLegalStatementDeceased
                .replace('{deceasedName}', formdata.deceasedName)
                .replace('{deceasedAddress}', formdata.deceasedAddress.formattedAddress)
                .replace('{deceasedDob}', formdata.dobFormattedDate.cy)
                .replace('{deceasedDod}', formdata.dodFormattedDate.cy),
            deceasedOtherNames: (formdata.deceasedOtherNames && formdata.deceasedOtherNames.cy) ? content.cy.deceasedOtherNames.replace('{deceasedOtherNames}', formdata.deceasedOtherNames.cy) : '',
            deceasedMaritalStatus: content.cy.intestacyDeceasedMaritalStatus
                .replace('{deceasedMaritalStatus}', this.getMaritalStatus(formdata, content.cy)),
            deceasedChildren: content.cy.intestacyDeceasedChildren,
            deceasedEstateValue: content.cy.deceasedEstateValue
                .replace('{ihtGrossValue}', formdata.ihtGrossValue)
                .replace('{ihtNetValue}', formdata.ihtNetValue),
            deceasedEstateValueExceptedEstateConfirmation: content.cy.deceasedEstateValueExceptedEstateConfirmation,
            deceasedEstateAssetsOverseas: content.cy.intestacyDeceasedEstateOutside
                .replace('{ihtNetValueAssetsOutside}', formdata.ihtNetValueAssetsOutside),
            deceasedEstateLand: content.cy.intestacyDeceasedEstateLand
                .replace(/{deceasedName}/g, formdata.deceasedName),
            applying: content.cy.intestacyLettersOfAdministration
                .replace('{deceasedName}', formdata.deceasedName)
        };
        legalStatement.cy.applicant2 = applicant2NameFactory.getApplicant2Name(formdata, content.cy, ihtThreshold);
        declaration.cy = {
            confirm: content.cy.declarationConfirm
                .replace('{deceasedName}', formdata.deceasedName),
            confirmItem1: content.cy.declarationConfirmItem1,
            confirmItem2: content.cy.declarationConfirmItem2,
            confirmItem3: content.cy['declarationConfirmItem3-intestacy'],
            requests: content.cy.declarationRequests,
            requestsItem1: content.cy['declarationRequestsItem1-intestacy'],
            requestsItem2: content.cy['declarationRequestsItem2-intestacy'],
            understand: content.cy.declarationUnderstand,
            understandItem1: content.cy['declarationUnderstandItem1-intestacy'],
            understandItem2: content.cy.declarationUnderstandItem2,
            accept: content.cy.declarationCheckbox,
            submitWarning: content.cy.submitWarning
        };

        return {legalStatement, declaration};
    }

    static getMaritalStatus(formdata, content) {
        return get(content, get(formdata.deceased, 'maritalStatus', ''), '').toLowerCase();
    }
}

module.exports = IntestacyDeclarationFactory;
