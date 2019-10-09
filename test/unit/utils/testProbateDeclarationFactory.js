'use strict';

const ExecutorsWrapper = require('app/wrappers/Executors');
const FormatName = require('app/utils/FormatName');
const {get} = require('lodash');
const content = require('app/resources/en/translation/declaration');
const expect = require('chai').expect;
const probateDeclarationFactory = require('app/utils/ProbateDeclarationFactory');
const formdata = require('test/data/complete-form');

describe('ProbateDeclarationFactory', () => {
    let ctx;
    let multipleApplicantSuffix;
    let executorsApplying;
    let executorsApplyingText;
    let executorsNotApplyingText;

    beforeEach(() => {
        ctx = {};
        ctx.executorsWrapper = new ExecutorsWrapper(formdata.executors);

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

        multipleApplicantSuffix = '';
        executorsApplying = ctx.executorsWrapper.executorsApplying();
        executorsApplyingText = {};
        executorsNotApplyingText = {};
    });

    describe('build()', () => {
        it('should return the Legal Statement and Declaration objects', (done) => {
            const templateData = probateDeclarationFactory.build(ctx, content, formdata, multipleApplicantSuffix, executorsApplying, executorsApplyingText, executorsNotApplyingText);

            expect(templateData).to.deep.equal({
                legalStatement: {
                    applicant: content[`legalStatementApplicant${multipleApplicantSuffix}`]
                        .replace('{detailsOfApplicants}', FormatName.formatMultipleNamesAndAddress(executorsApplying, content, formdata.applicantAddress))
                        .replace('{applicantName}', formdata.applicantName)
                        .replace('{applicantAddress}', formdata.applicantAddress.formattedAddress),
                    deceased: content.legalStatementDeceased
                        .replace('{deceasedName}', formdata.deceasedName)
                        .replace('{deceasedAddress}', formdata.deceasedAddress.formattedAddress)
                        .replace('{deceasedDob}', formdata.dobFormattedDate)
                        .replace('{deceasedDod}', formdata.dodFormattedDate),
                    deceasedEstateLand: content[`deceasedEstateLand${multipleApplicantSuffix}`]
                        .replace(/{deceasedName}/g, formdata.deceasedName),
                    deceasedEstateValue: content.deceasedEstateValue
                        .replace('{ihtGrossValue}', formdata.ihtGrossValue)
                        .replace('{ihtNetValue}', formdata.ihtNetValue),
                    deceasedOtherNames: '',
                    executorsApplying: {},
                    executorsNotApplying: {},
                    intro: content[`intro${multipleApplicantSuffix}`]
                        .replace('{applicantName}', formdata.applicantName)
                },
                declaration: {
                    accept: content.declarationCheckbox,
                    confirm: content[`declarationConfirm${multipleApplicantSuffix}`]
                        .replace('{deceasedName}', formdata.deceasedName),
                    confirmItem1: content.declarationConfirmItem1,
                    confirmItem2: content.declarationConfirmItem2,
                    confirmItem3: content.declarationConfirmItem3,
                    requests: content[`declarationRequests${multipleApplicantSuffix}`],
                    requestsItem1: content.declarationRequestsItem1,
                    requestsItem2: content.declarationRequestsItem2,
                    submitWarning: content[`submitWarning${multipleApplicantSuffix}`],
                    understand: content[`declarationUnderstand${multipleApplicantSuffix}`],
                    understandItem1: content[`declarationUnderstandItem1${multipleApplicantSuffix}`],
                    understandItem2: content[`declarationUnderstandItem2${multipleApplicantSuffix}`]
                }
            });
            done();
        });
    });
});
