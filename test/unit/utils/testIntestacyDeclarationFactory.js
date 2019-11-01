'use strict';

const applicant2NameFactory = require('app/utils/Applicant2NameFactory');
const FormatName = require('app/utils/FormatName');
const {get} = require('lodash');
const content = require('app/resources/en/translation/declaration');
const expect = require('chai').expect;
const intestacyDeclarationFactory = require('app/utils/IntestacyDeclarationFactory');
const formdata = require('test/data/complete-form');

describe('IntestacyDeclarationFactory', () => {
    let ctx;

    beforeEach(() => {
        ctx = {};

        const formdataApplicant = formdata.applicant || {};
        formdata.applicantName = FormatName.format(formdataApplicant);
        formdata.applicantAddress = get(formdataApplicant, 'address', {});

        const formdataDeceased = formdata.deceased || {};
        formdata.deceasedName = FormatName.format(formdataDeceased);
        formdata.deceasedAddress = get(formdataDeceased, 'address', {});
        formdata.deceasedOtherNames = FormatName.formatMultipleNamesAndAddress(get(formdataDeceased, 'otherNames'), content);
        formdata.dobFormattedDate = formdataDeceased['dob-formattedDate'];
        formdata.dodFormattedDate = formdataDeceased['dod-formattedDate'];
        formdata.maritalStatus = formdataDeceased.maritalStatus;
        formdata.relationshipToDeceased = formdataDeceased.relationshipToDeceased;
        formdata.hadChildren = formdataDeceased.hadChildren;
        formdata.anyOtherChildren = formdataDeceased.anyOtherChildren;

        const formdataIht = formdata.iht || {};
        formdata.ihtGrossValue = formdataIht.grossValue ? formdataIht.grossValue.toFixed(2) : 0;
        formdata.ihtNetValue = formdataIht.netValue ? formdataIht.netValue.toFixed(2) : 0;
    });

    describe('build()', () => {
        it('should return the Legal Statement and Declaration objects', (done) => {
            const templateData = intestacyDeclarationFactory.build(ctx, content, formdata);

            expect(templateData).to.deep.equal({
                legalStatement: {
                    applicant: content.legalStatementApplicant
                        .replace('{applicantName}', formdata.applicantName)
                        .replace('{applicantAddress}', formdata.applicantAddress.formattedAddress),
                    applicant2: applicant2NameFactory.getApplicant2Name(formdata, content),
                    applying: content.intestacyLettersOfAdministration
                        .replace('{deceasedName}', formdata.deceasedName),
                    deceased: content.intestacyLegalStatementDeceased
                        .replace('{deceasedName}', formdata.deceasedName)
                        .replace('{deceasedAddress}', formdata.deceasedAddress.formattedAddress)
                        .replace('{deceasedDob}', formdata.dobFormattedDate)
                        .replace('{deceasedDod}', formdata.dodFormattedDate),
                    deceasedChildren: content.intestacyDeceasedChildren,
                    deceasedEstateLand: content.intestacyDeceasedEstateLand
                        .replace(/{deceasedName}/g, formdata.deceasedName),
                    deceasedEstateValue: content.deceasedEstateValue
                        .replace('{ihtGrossValue}', formdata.ihtGrossValue)
                        .replace('{ihtNetValue}', formdata.ihtNetValue),
                    deceasedEstateAssetsOverseas: content.intestacyDeceasedEstateOutside
                        .replace('{ihtNetValueAssetsOutside}', formdata.ihtNetValueAssetsOutside),
                    deceasedMaritalStatus: content.intestacyDeceasedMaritalStatus
                        .replace('{deceasedMaritalStatus}', get(formdata.deceased, 'maritalStatus', '').toLowerCase()),
                    deceasedOtherNames: formdata.deceasedOtherNames ? content.deceasedOtherNames.replace('{deceasedOtherNames}', formdata.deceasedOtherNames) : '',
                    intro: content.intro
                },
                declaration: {
                    accept: content.declarationCheckbox,
                    confirm: content.declarationConfirm
                        .replace('{deceasedName}', formdata.deceasedName),
                    confirmItem1: content.declarationConfirmItem1,
                    confirmItem2: content.declarationConfirmItem2,
                    confirmItem3: content['declarationConfirmItem3-intestacy'],
                    requests: content.declarationRequests,
                    requestsItem1: content['declarationRequestsItem1-intestacy'],
                    requestsItem2: content['declarationRequestsItem2-intestacy'],
                    submitWarning: content.submitWarning,
                    understand: content.declarationUnderstand,
                    understandItem1: content['declarationUnderstandItem1-intestacy'],
                    understandItem2: content.declarationUnderstandItem2,
                }
            });
            done();
        });
    });
});
