// eslint-disable-line max-lines

'use strict';

const TestWrapper = require('test/util/TestWrapper');
const Taskist = require('app/steps/ui/tasklist');
const testCommonContent = require('test/component/common/testCommonContent.js');
const declarationContent = require('app/resources/en/translation/declaration');
const config = require('config');
const nock = require('nock');
const caseTypes = require('app/utils/CaseTypes');

describe('declaration, intestacy', () => {
    let testWrapper, contentData, sessionData;
    const expectedNextUrlForExecInvite = Taskist.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('Declaration');

        nock(config.services.idam.s2s_url)
            .post('/lease')
            .reply(
                200,
                'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJSRUZFUkVOQ0UifQ.Z_YYn0go02ApdSMfbehsLXXbxJxLugPG8v_3kt' +
                'CpQurK8tHkOy1qGyTo02bTdilX4fq4M5glFh80edDuhDJXPA'
            );

        nock(config.services.orchestrator.url)
            .put(uri => uri.includes('validations'))
            .reply(200, {});

        nock(config.services.orchestrator.url)
            .post(config.pdf.path + '/' + config.pdf.template.declaration)
            .reply(200, {buffer: {}, originalname: {}});

        nock(config.services.orchestrator.url)
            .post(config.documentUpload.paths.upload)
            .reply(200, {});

        sessionData = require('test/data/complete-form-undeclared').formdata;
        sessionData.caseType = caseTypes.INTESTACY;
        const applicantData = sessionData.applicant;
        const deceasedData = sessionData.deceased;

        contentData = {
            applicantName: `${applicantData.firstName} ${applicantData.lastName}`,
            applicantAddress: applicantData.address.formattedAddress,
            deceasedName: `${deceasedData.firstName} ${deceasedData.lastName}`,
            deceasedAddress: deceasedData.address.formattedAddress,
            deceasedDob: deceasedData['dob-formattedDate'],
            deceasedDod: deceasedData['dod-formattedDate'],
            ihtGrossValue: sessionData.iht.grossValueField,
            ihtNetValue: sessionData.iht.netValueField
        };
    });

    afterEach(async () => {
        delete require.cache[require.resolve('test/data/complete-form-undeclared')];
        nock.cleanAll();
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('Declaration');

        it('test right content loaded on the page when deceased has assets overseas and the total net value is more than the IHT threshold', (done) => {
            const contentToExclude = [
                'probateHeader',
                'legalStatementDeceased',
                'deceasedEstateLand',
                'executorApplyingHeader',
                'applicantSend',
                'declarationConfirmItem3',
                'declarationRequestsItem1',
                'declarationRequestsItem2',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseApplyingHadChildren',
                'intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThanIhtThreshold',
                'deceasedOtherNames',
                'applicantName',
                'applicantName-alias',
                'applicantName-alias-codicils',
                'applicantName-multipleApplicants-alias',
                'applicantName-multipleApplicants-alias-codicils',
                'applicantName-multipleApplicants-mainApplicant-alias',
                'applicantName-multipleApplicants-mainApplicant-alias-codicils',
                'executorApplyingName-codicils',
                'executorNotApplyingHeader',
                'executorNotApplyingReason',
                'executorNotApplyingReason-codicils',
                'optionDiedBefore',
                'optionDiedAfter',
                'optionPowerReserved',
                'optionRenunciated',
                'optionMarried',
                'optionWidowed',
                'optionNotMarried',
                'optionSeparated',
                'additionalExecutorNotified',
                'intro-multipleApplicants',
                'legalStatementApplicant-multipleApplicants',
                'deceasedEstateLand-multipleApplicants',
                'applicantName-multipleApplicants',
                'applicantName-multipleApplicants-codicils',
                'applicantName-multipleApplicants-mainApplicant',
                'applicantName-multipleApplicants-mainApplicant-codicils',
                'applicantSend-codicils',
                'applicantSend-multipleApplicants',
                'applicantSend-multipleApplicants-mainApplicant',
                'applicantSend-multipleApplicants-codicils',
                'applicantSend-multipleApplicants-mainApplicant-codicils',
                'declarationConfirm-multipleApplicants',
                'declarationRequests-multipleApplicants',
                'declarationUnderstand-multipleApplicants',
                'declarationUnderstandItem1',
                'declarationUnderstandItem1-multipleApplicants',
                'declarationUnderstandItem2-multipleApplicants',
                'submitWarning-multipleApplicants',
                'applicantName-codicils',
                'codicil',
                'codicils'
            ];
            sessionData.iht.assetsOutside = 'optionYes';
            sessionData.iht.grossValueField = '300000.10';
            sessionData.iht.netValueField = '270000.34';
            sessionData.iht.netValueAssetsOutsideField = '300000.10';
            sessionData.iht.grossValue = 300000.1;
            sessionData.iht.netValue = 270000.34;
            sessionData.iht.netValueAssetsOutside = 300000.1;
            sessionData.deceased.maritalStatus = 'optionDivorced';
            sessionData.deceased.anyOtherChildren = 'optionYes';
            sessionData.applicant.relationshipToDeceased = 'optionAdoptedChild';

            contentData.ihtGrossValue = sessionData.iht.grossValueField;
            contentData.ihtNetValue = sessionData.iht.netValueField;
            contentData.ihtNetValueAssetsOutside = sessionData.iht.netValueAssetsOutsideField;
            contentData.deceasedMaritalStatus = declarationContent.optionDivorced;

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page when deceased was divorced, the applicant is the child, has siblings and is adopted', (done) => {
            const contentToExclude = [
                'probateHeader',
                'legalStatementDeceased',
                'deceasedEstateLand',
                'executorApplyingHeader',
                'applicantSend',
                'declarationConfirmItem3',
                'declarationRequestsItem1',
                'declarationRequestsItem2',
                'intestacyDeceasedEstateOutside',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseApplyingHadChildren',
                'intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThanIhtThreshold',
                'deceasedOtherNames',
                'applicantName',
                'applicantName-alias',
                'applicantName-alias-codicils',
                'applicantName-multipleApplicants-alias',
                'applicantName-multipleApplicants-alias-codicils',
                'applicantName-multipleApplicants-mainApplicant-alias',
                'applicantName-multipleApplicants-mainApplicant-alias-codicils',
                'executorApplyingName-codicils',
                'executorNotApplyingHeader',
                'executorNotApplyingReason',
                'executorNotApplyingReason-codicils',
                'optionDiedBefore',
                'optionDiedAfter',
                'optionPowerReserved',
                'optionRenunciated',
                'optionMarried',
                'optionWidowed',
                'optionNotMarried',
                'optionSeparated',
                'additionalExecutorNotified',
                'intro-multipleApplicants',
                'legalStatementApplicant-multipleApplicants',
                'deceasedEstateLand-multipleApplicants',
                'applicantName-multipleApplicants',
                'applicantName-multipleApplicants-codicils',
                'applicantName-multipleApplicants-mainApplicant',
                'applicantName-multipleApplicants-mainApplicant-codicils',
                'applicantSend-codicils',
                'applicantSend-multipleApplicants',
                'applicantSend-multipleApplicants-mainApplicant',
                'applicantSend-multipleApplicants-codicils',
                'applicantSend-multipleApplicants-mainApplicant-codicils',
                'declarationConfirm-multipleApplicants',
                'declarationRequests-multipleApplicants',
                'declarationUnderstand-multipleApplicants',
                'declarationUnderstandItem1',
                'declarationUnderstandItem1-multipleApplicants',
                'declarationUnderstandItem2-multipleApplicants',
                'submitWarning-multipleApplicants',
                'applicantName-codicils',
                'codicil',
                'codicils'
            ];
            sessionData.deceased.maritalStatus = 'optionDivorced';
            sessionData.deceased.anyOtherChildren = 'optionYes';
            sessionData.applicant.relationshipToDeceased = 'optionAdoptedChild';

            contentData.deceasedMaritalStatus = declarationContent.optionDivorced;

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page when deceased was divorced, the applicant is the child, has siblings and is not adopted', (done) => {
            const contentToExclude = [
                'probateHeader',
                'legalStatementDeceased',
                'deceasedEstateLand',
                'executorApplyingHeader',
                'applicantSend',
                'declarationConfirmItem3',
                'declarationRequestsItem1',
                'declarationRequestsItem2',
                'intestacyDeceasedEstateOutside',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseApplyingHadChildren',
                'intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThanIhtThreshold',
                'deceasedOtherNames',
                'applicantName',
                'applicantName-alias',
                'applicantName-alias-codicils',
                'applicantName-multipleApplicants-alias',
                'applicantName-multipleApplicants-alias-codicils',
                'applicantName-multipleApplicants-mainApplicant-alias',
                'applicantName-multipleApplicants-mainApplicant-alias-codicils',
                'executorApplyingName-codicils',
                'executorNotApplyingHeader',
                'executorNotApplyingReason',
                'executorNotApplyingReason-codicils',
                'optionDiedBefore',
                'optionDiedAfter',
                'optionPowerReserved',
                'optionRenunciated',
                'optionMarried',
                'optionWidowed',
                'optionNotMarried',
                'optionSeparated',
                'additionalExecutorNotified',
                'intro-multipleApplicants',
                'legalStatementApplicant-multipleApplicants',
                'deceasedEstateLand-multipleApplicants',
                'applicantName-multipleApplicants',
                'applicantName-multipleApplicants-codicils',
                'applicantName-multipleApplicants-mainApplicant',
                'applicantName-multipleApplicants-mainApplicant-codicils',
                'applicantSend-codicils',
                'applicantSend-multipleApplicants',
                'applicantSend-multipleApplicants-mainApplicant',
                'applicantSend-multipleApplicants-codicils',
                'applicantSend-multipleApplicants-mainApplicant-codicils',
                'declarationConfirm-multipleApplicants',
                'declarationRequests-multipleApplicants',
                'declarationUnderstand-multipleApplicants',
                'declarationUnderstandItem1',
                'declarationUnderstandItem1-multipleApplicants',
                'declarationUnderstandItem2-multipleApplicants',
                'submitWarning-multipleApplicants',
                'applicantName-codicils',
                'codicil',
                'codicils'
            ];
            sessionData.deceased.maritalStatus = 'optionDivorced';
            sessionData.deceased.anyOtherChildren = 'optionYes';
            sessionData.applicant.relationshipToDeceased = 'optionChild';

            contentData.deceasedMaritalStatus = declarationContent.optionDivorced;

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page when deceased was divorced, the applicant is the child, has no siblings and is adopted', (done) => {
            const contentToExclude = [
                'probateHeader',
                'legalStatementDeceased',
                'deceasedEstateLand',
                'executorApplyingHeader',
                'applicantSend',
                'declarationConfirmItem3',
                'declarationRequestsItem1',
                'declarationRequestsItem2',
                'intestacyDeceasedEstateOutside',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseApplyingHadChildren',
                'intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThanIhtThreshold',
                'deceasedOtherNames',
                'applicantName',
                'applicantName-alias',
                'applicantName-alias-codicils',
                'applicantName-multipleApplicants-alias',
                'applicantName-multipleApplicants-alias-codicils',
                'applicantName-multipleApplicants-mainApplicant-alias',
                'applicantName-multipleApplicants-mainApplicant-alias-codicils',
                'executorApplyingName-codicils',
                'executorNotApplyingHeader',
                'executorNotApplyingReason',
                'executorNotApplyingReason-codicils',
                'optionDiedBefore',
                'optionDiedAfter',
                'optionPowerReserved',
                'optionRenunciated',
                'optionMarried',
                'optionWidowed',
                'optionNotMarried',
                'optionSeparated',
                'additionalExecutorNotified',
                'intro-multipleApplicants',
                'legalStatementApplicant-multipleApplicants',
                'deceasedEstateLand-multipleApplicants',
                'applicantName-multipleApplicants',
                'applicantName-multipleApplicants-codicils',
                'applicantName-multipleApplicants-mainApplicant',
                'applicantName-multipleApplicants-mainApplicant-codicils',
                'applicantSend-codicils',
                'applicantSend-multipleApplicants',
                'applicantSend-multipleApplicants-mainApplicant',
                'applicantSend-multipleApplicants-codicils',
                'applicantSend-multipleApplicants-mainApplicant-codicils',
                'declarationConfirm-multipleApplicants',
                'declarationRequests-multipleApplicants',
                'declarationUnderstand-multipleApplicants',
                'declarationUnderstandItem1',
                'declarationUnderstandItem1-multipleApplicants',
                'declarationUnderstandItem2-multipleApplicants',
                'submitWarning-multipleApplicants',
                'applicantName-codicils',
                'codicil',
                'codicils'
            ];
            sessionData.deceased.maritalStatus = 'optionDivorced';
            sessionData.deceased.anyOtherChildren = 'optionNo';
            sessionData.applicant.relationshipToDeceased = 'optionAdoptedChild';

            contentData.deceasedMaritalStatus = declarationContent.optionDivorced;

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page when deceased was divorced, the applicant is the child, has no siblings and is not adopted', (done) => {
            const contentToExclude = [
                'probateHeader',
                'legalStatementDeceased',
                'deceasedEstateLand',
                'executorApplyingHeader',
                'applicantSend',
                'declarationConfirmItem3',
                'declarationRequestsItem1',
                'declarationRequestsItem2',
                'intestacyDeceasedEstateOutside',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseApplyingHadChildren',
                'intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThanIhtThreshold',
                'deceasedOtherNames',
                'applicantName',
                'applicantName-alias',
                'applicantName-alias-codicils',
                'applicantName-multipleApplicants-alias',
                'applicantName-multipleApplicants-alias-codicils',
                'applicantName-multipleApplicants-mainApplicant-alias',
                'applicantName-multipleApplicants-mainApplicant-alias-codicils',
                'executorApplyingName-codicils',
                'executorNotApplyingHeader',
                'executorNotApplyingReason',
                'executorNotApplyingReason-codicils',
                'optionDiedBefore',
                'optionDiedAfter',
                'optionPowerReserved',
                'optionRenunciated',
                'optionMarried',
                'optionWidowed',
                'optionNotMarried',
                'optionSeparated',
                'additionalExecutorNotified',
                'intro-multipleApplicants',
                'legalStatementApplicant-multipleApplicants',
                'deceasedEstateLand-multipleApplicants',
                'applicantName-multipleApplicants',
                'applicantName-multipleApplicants-codicils',
                'applicantName-multipleApplicants-mainApplicant',
                'applicantName-multipleApplicants-mainApplicant-codicils',
                'applicantSend-codicils',
                'applicantSend-multipleApplicants',
                'applicantSend-multipleApplicants-mainApplicant',
                'applicantSend-multipleApplicants-codicils',
                'applicantSend-multipleApplicants-mainApplicant-codicils',
                'declarationConfirm-multipleApplicants',
                'declarationRequests-multipleApplicants',
                'declarationUnderstand-multipleApplicants',
                'declarationUnderstandItem1',
                'declarationUnderstandItem1-multipleApplicants',
                'declarationUnderstandItem2-multipleApplicants',
                'submitWarning-multipleApplicants',
                'applicantName-codicils',
                'codicil',
                'codicils'
            ];
            sessionData.deceased.maritalStatus = 'optionDivorced';
            sessionData.deceased.anyOtherChildren = 'optionNo';
            sessionData.applicant.relationshipToDeceased = 'optionChild';

            contentData.deceasedMaritalStatus = declarationContent.optionDivorced;

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page when deceased was married, the applicant is the child, has siblings and is adopted, the estate is less than or equal to the IHT threshold', (done) => {
            const contentToExclude = [
                'probateHeader',
                'legalStatementDeceased',
                'deceasedEstateLand',
                'executorApplyingHeader',
                'applicantSend',
                'declarationConfirmItem3',
                'declarationRequestsItem1',
                'declarationRequestsItem2',
                'intestacyDeceasedEstateOutside',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseApplyingHadChildren',
                'intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThanIhtThreshold',
                'deceasedOtherNames',
                'applicantName',
                'applicantName-alias',
                'applicantName-alias-codicils',
                'applicantName-multipleApplicants-alias',
                'applicantName-multipleApplicants-alias-codicils',
                'applicantName-multipleApplicants-mainApplicant-alias',
                'applicantName-multipleApplicants-mainApplicant-alias-codicils',
                'executorApplyingName-codicils',
                'executorNotApplyingHeader',
                'executorNotApplyingReason',
                'executorNotApplyingReason-codicils',
                'optionDiedBefore',
                'optionDiedAfter',
                'optionPowerReserved',
                'optionRenunciated',
                'optionDivorced',
                'optionWidowed',
                'optionNotMarried',
                'optionSeparated',
                'additionalExecutorNotified',
                'intro-multipleApplicants',
                'legalStatementApplicant-multipleApplicants',
                'deceasedEstateLand-multipleApplicants',
                'applicantName-multipleApplicants',
                'applicantName-multipleApplicants-codicils',
                'applicantName-multipleApplicants-mainApplicant',
                'applicantName-multipleApplicants-mainApplicant-codicils',
                'applicantSend-codicils',
                'applicantSend-multipleApplicants',
                'applicantSend-multipleApplicants-mainApplicant',
                'applicantSend-multipleApplicants-codicils',
                'applicantSend-multipleApplicants-mainApplicant-codicils',
                'declarationConfirm-multipleApplicants',
                'declarationRequests-multipleApplicants',
                'declarationUnderstand-multipleApplicants',
                'declarationUnderstandItem1',
                'declarationUnderstandItem1-multipleApplicants',
                'declarationUnderstandItem2-multipleApplicants',
                'submitWarning-multipleApplicants',
                'applicantName-codicils',
                'codicil',
                'codicils'
            ];
            sessionData.deceased['dod-date'] = '2016-05-12';
            sessionData.deceased.maritalStatus = 'optionMarried';
            sessionData.deceased.anyOtherChildren = 'optionYes';
            sessionData.applicant.relationshipToDeceased = 'optionAdoptedChild';

            contentData.deceasedMaritalStatus = declarationContent.optionMarried;

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page when deceased was married, the applicant is the child, has siblings and is not adopted, the estate is less than or equal to the IHT threshold', (done) => {
            const contentToExclude = [
                'probateHeader',
                'legalStatementDeceased',
                'deceasedEstateLand',
                'executorApplyingHeader',
                'applicantSend',
                'declarationConfirmItem3',
                'declarationRequestsItem1',
                'declarationRequestsItem2',
                'intestacyDeceasedEstateOutside',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseApplyingHadChildren',
                'intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThanIhtThreshold',
                'deceasedOtherNames',
                'applicantName',
                'applicantName-alias',
                'applicantName-alias-codicils',
                'applicantName-multipleApplicants-alias',
                'applicantName-multipleApplicants-alias-codicils',
                'applicantName-multipleApplicants-mainApplicant-alias',
                'applicantName-multipleApplicants-mainApplicant-alias-codicils',
                'executorApplyingName-codicils',
                'executorNotApplyingHeader',
                'executorNotApplyingReason',
                'executorNotApplyingReason-codicils',
                'optionDiedBefore',
                'optionDiedAfter',
                'optionPowerReserved',
                'optionRenunciated',
                'optionDivorced',
                'optionWidowed',
                'optionNotMarried',
                'optionSeparated',
                'additionalExecutorNotified',
                'intro-multipleApplicants',
                'legalStatementApplicant-multipleApplicants',
                'deceasedEstateLand-multipleApplicants',
                'applicantName-multipleApplicants',
                'applicantName-multipleApplicants-codicils',
                'applicantName-multipleApplicants-mainApplicant',
                'applicantName-multipleApplicants-mainApplicant-codicils',
                'applicantSend-codicils',
                'applicantSend-multipleApplicants',
                'applicantSend-multipleApplicants-mainApplicant',
                'applicantSend-multipleApplicants-codicils',
                'applicantSend-multipleApplicants-mainApplicant-codicils',
                'declarationConfirm-multipleApplicants',
                'declarationRequests-multipleApplicants',
                'declarationUnderstand-multipleApplicants',
                'declarationUnderstandItem1',
                'declarationUnderstandItem1-multipleApplicants',
                'declarationUnderstandItem2-multipleApplicants',
                'submitWarning-multipleApplicants',
                'applicantName-codicils',
                'codicil',
                'codicils'
            ];
            sessionData.deceased['dod-date'] = '2016-05-12';
            sessionData.deceased.maritalStatus = 'optionMarried';
            sessionData.deceased.anyOtherChildren = 'optionYes';
            sessionData.applicant.relationshipToDeceased = 'optionChild';

            contentData.deceasedMaritalStatus = declarationContent.optionMarried;

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page when deceased was married, the applicant is the child, has no siblings and is adopted, the estate is less than or equal to the IHT threshold', (done) => {
            const contentToExclude = [
                'probateHeader',
                'legalStatementDeceased',
                'deceasedEstateLand',
                'executorApplyingHeader',
                'applicantSend',
                'declarationConfirmItem3',
                'declarationRequestsItem1',
                'declarationRequestsItem2',
                'intestacyDeceasedEstateOutside',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseApplyingHadChildren',
                'intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThanIhtThreshold',
                'deceasedOtherNames',
                'applicantName',
                'applicantName-alias',
                'applicantName-alias-codicils',
                'applicantName-multipleApplicants-alias',
                'applicantName-multipleApplicants-alias-codicils',
                'applicantName-multipleApplicants-mainApplicant-alias',
                'applicantName-multipleApplicants-mainApplicant-alias-codicils',
                'executorApplyingName-codicils',
                'executorNotApplyingHeader',
                'executorNotApplyingReason',
                'executorNotApplyingReason-codicils',
                'optionDiedBefore',
                'optionDiedAfter',
                'optionPowerReserved',
                'optionRenunciated',
                'optionDivorced',
                'optionWidowed',
                'optionNotMarried',
                'optionSeparated',
                'additionalExecutorNotified',
                'intro-multipleApplicants',
                'legalStatementApplicant-multipleApplicants',
                'deceasedEstateLand-multipleApplicants',
                'applicantName-multipleApplicants',
                'applicantName-multipleApplicants-codicils',
                'applicantName-multipleApplicants-mainApplicant',
                'applicantName-multipleApplicants-mainApplicant-codicils',
                'applicantSend-codicils',
                'applicantSend-multipleApplicants',
                'applicantSend-multipleApplicants-mainApplicant',
                'applicantSend-multipleApplicants-codicils',
                'applicantSend-multipleApplicants-mainApplicant-codicils',
                'declarationConfirm-multipleApplicants',
                'declarationRequests-multipleApplicants',
                'declarationUnderstand-multipleApplicants',
                'declarationUnderstandItem1',
                'declarationUnderstandItem1-multipleApplicants',
                'declarationUnderstandItem2-multipleApplicants',
                'submitWarning-multipleApplicants',
                'applicantName-codicils',
                'codicil',
                'codicils'
            ];
            sessionData.deceased['dod-date'] = '2016-05-12';
            sessionData.deceased.maritalStatus = 'optionMarried';
            sessionData.deceased.anyOtherChildren = 'optionNo';
            sessionData.applicant.relationshipToDeceased = 'optionAdoptedChild';

            contentData.deceasedMaritalStatus = declarationContent.optionMarried;

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page when deceased was married, the applicant is the child, has no siblings and is not adopted, the estate is less than or equal to the IHT threshold', (done) => {
            const contentToExclude = [
                'probateHeader',
                'legalStatementDeceased',
                'deceasedEstateLand',
                'executorApplyingHeader',
                'applicantSend',
                'declarationConfirmItem3',
                'declarationRequestsItem1',
                'declarationRequestsItem2',
                'intestacyDeceasedEstateOutside',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseApplyingHadChildren',
                'intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThanIhtThreshold',
                'deceasedOtherNames',
                'applicantName',
                'applicantName-alias',
                'applicantName-alias-codicils',
                'applicantName-multipleApplicants-alias',
                'applicantName-multipleApplicants-alias-codicils',
                'applicantName-multipleApplicants-mainApplicant-alias',
                'applicantName-multipleApplicants-mainApplicant-alias-codicils',
                'executorApplyingName-codicils',
                'executorNotApplyingHeader',
                'executorNotApplyingReason',
                'executorNotApplyingReason-codicils',
                'optionDiedBefore',
                'optionDiedAfter',
                'optionPowerReserved',
                'optionRenunciated',
                'optionDivorced',
                'optionWidowed',
                'optionNotMarried',
                'optionSeparated',
                'additionalExecutorNotified',
                'intro-multipleApplicants',
                'legalStatementApplicant-multipleApplicants',
                'deceasedEstateLand-multipleApplicants',
                'applicantName-multipleApplicants',
                'applicantName-multipleApplicants-codicils',
                'applicantName-multipleApplicants-mainApplicant',
                'applicantName-multipleApplicants-mainApplicant-codicils',
                'applicantSend-codicils',
                'applicantSend-multipleApplicants',
                'applicantSend-multipleApplicants-mainApplicant',
                'applicantSend-multipleApplicants-codicils',
                'applicantSend-multipleApplicants-mainApplicant-codicils',
                'declarationConfirm-multipleApplicants',
                'declarationRequests-multipleApplicants',
                'declarationUnderstand-multipleApplicants',
                'declarationUnderstandItem1',
                'declarationUnderstandItem1-multipleApplicants',
                'declarationUnderstandItem2-multipleApplicants',
                'submitWarning-multipleApplicants',
                'applicantName-codicils',
                'codicil',
                'codicils'
            ];
            sessionData.deceased['dod-date'] = '2016-05-12';
            sessionData.deceased.maritalStatus = 'optionMarried';
            sessionData.deceased.anyOtherChildren = 'optionNo';
            sessionData.applicant.relationshipToDeceased = 'optionChild';

            contentData.deceasedMaritalStatus = declarationContent.optionMarried;

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page when deceased was married, the applicant is the child, has siblings and is adopted, the estate is more than the IHT threshold', (done) => {
            const contentToExclude = [
                'probateHeader',
                'legalStatementDeceased',
                'deceasedEstateLand',
                'executorApplyingHeader',
                'applicantSend',
                'declarationConfirmItem3',
                'declarationRequestsItem1',
                'declarationRequestsItem2',
                'intestacyDeceasedEstateOutside',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseApplyingHadChildren',
                'intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThanIhtThreshold',
                'deceasedOtherNames',
                'applicantName',
                'applicantName-alias',
                'applicantName-alias-codicils',
                'applicantName-multipleApplicants-alias',
                'applicantName-multipleApplicants-alias-codicils',
                'applicantName-multipleApplicants-mainApplicant-alias',
                'applicantName-multipleApplicants-mainApplicant-alias-codicils',
                'executorApplyingName-codicils',
                'executorNotApplyingHeader',
                'executorNotApplyingReason',
                'executorNotApplyingReason-codicils',
                'optionDiedBefore',
                'optionDiedAfter',
                'optionPowerReserved',
                'optionRenunciated',
                'optionDivorced',
                'optionWidowed',
                'optionNotMarried',
                'optionSeparated',
                'additionalExecutorNotified',
                'intro-multipleApplicants',
                'legalStatementApplicant-multipleApplicants',
                'deceasedEstateLand-multipleApplicants',
                'applicantName-multipleApplicants',
                'applicantName-multipleApplicants-codicils',
                'applicantName-multipleApplicants-mainApplicant',
                'applicantName-multipleApplicants-mainApplicant-codicils',
                'applicantSend-codicils',
                'applicantSend-multipleApplicants',
                'applicantSend-multipleApplicants-mainApplicant',
                'applicantSend-multipleApplicants-codicils',
                'applicantSend-multipleApplicants-mainApplicant-codicils',
                'declarationConfirm-multipleApplicants',
                'declarationRequests-multipleApplicants',
                'declarationUnderstand-multipleApplicants',
                'declarationUnderstandItem1',
                'declarationUnderstandItem1-multipleApplicants',
                'declarationUnderstandItem2-multipleApplicants',
                'submitWarning-multipleApplicants',
                'applicantName-codicils',
                'codicil',
                'codicils'
            ];
            sessionData.deceased.maritalStatus = 'optionMarried';
            sessionData.deceased.anyOtherChildren = 'optionYes';
            sessionData.applicant.relationshipToDeceased = 'optionAdoptedChild';
            sessionData.iht.grossValueField = '300000.10';
            sessionData.iht.netValueField = '270000.34';
            sessionData.iht.grossValue = 300000.1;
            sessionData.iht.netValue = 270000.34;

            contentData.deceasedMaritalStatus = declarationContent.optionMarried;
            contentData.ihtGrossValue = sessionData.iht.grossValueField;
            contentData.ihtNetValue = sessionData.iht.netValueField;

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page when deceased was married, the applicant is the child, has siblings and is not adopted, the estate is more than the IHT threshold', (done) => {
            const contentToExclude = [
                'probateHeader',
                'legalStatementDeceased',
                'deceasedEstateLand',
                'executorApplyingHeader',
                'applicantSend',
                'declarationConfirmItem3',
                'declarationRequestsItem1',
                'declarationRequestsItem2',
                'intestacyDeceasedEstateOutside',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseApplyingHadChildren',
                'intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThanIhtThreshold',
                'deceasedOtherNames',
                'applicantName',
                'applicantName-alias',
                'applicantName-alias-codicils',
                'applicantName-multipleApplicants-alias',
                'applicantName-multipleApplicants-alias-codicils',
                'applicantName-multipleApplicants-mainApplicant-alias',
                'applicantName-multipleApplicants-mainApplicant-alias-codicils',
                'executorApplyingName-codicils',
                'executorNotApplyingHeader',
                'executorNotApplyingReason',
                'executorNotApplyingReason-codicils',
                'optionDiedBefore',
                'optionDiedAfter',
                'optionPowerReserved',
                'optionRenunciated',
                'optionDivorced',
                'optionWidowed',
                'optionNotMarried',
                'optionSeparated',
                'additionalExecutorNotified',
                'intro-multipleApplicants',
                'legalStatementApplicant-multipleApplicants',
                'deceasedEstateLand-multipleApplicants',
                'applicantName-multipleApplicants',
                'applicantName-multipleApplicants-codicils',
                'applicantName-multipleApplicants-mainApplicant',
                'applicantName-multipleApplicants-mainApplicant-codicils',
                'applicantSend-codicils',
                'applicantSend-multipleApplicants',
                'applicantSend-multipleApplicants-mainApplicant',
                'applicantSend-multipleApplicants-codicils',
                'applicantSend-multipleApplicants-mainApplicant-codicils',
                'declarationConfirm-multipleApplicants',
                'declarationRequests-multipleApplicants',
                'declarationUnderstand-multipleApplicants',
                'declarationUnderstandItem1',
                'declarationUnderstandItem1-multipleApplicants',
                'declarationUnderstandItem2-multipleApplicants',
                'submitWarning-multipleApplicants',
                'applicantName-codicils',
                'codicil',
                'codicils'
            ];
            sessionData.deceased.maritalStatus = 'optionMarried';
            sessionData.deceased.anyOtherChildren = 'optionYes';
            sessionData.applicant.relationshipToDeceased = 'optionChild';
            sessionData.iht.grossValueField = '300000.10';
            sessionData.iht.netValueField = '270000.34';
            sessionData.iht.grossValue = 300000.1;
            sessionData.iht.netValue = 270000.34;

            contentData.deceasedMaritalStatus = declarationContent.optionMarried;
            contentData.ihtGrossValue = sessionData.iht.grossValueField;
            contentData.ihtNetValue = sessionData.iht.netValueField;

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page when deceased was married, the applicant is the child, has no siblings and is adopted, the estate is more than the IHT threshold', (done) => {
            const contentToExclude = [
                'probateHeader',
                'legalStatementDeceased',
                'deceasedEstateLand',
                'executorApplyingHeader',
                'applicantSend',
                'declarationConfirmItem3',
                'declarationRequestsItem1',
                'declarationRequestsItem2',
                'intestacyDeceasedEstateOutside',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseApplyingHadChildren',
                'intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThanIhtThreshold',
                'deceasedOtherNames',
                'applicantName',
                'applicantName-alias',
                'applicantName-alias-codicils',
                'applicantName-multipleApplicants-alias',
                'applicantName-multipleApplicants-alias-codicils',
                'applicantName-multipleApplicants-mainApplicant-alias',
                'applicantName-multipleApplicants-mainApplicant-alias-codicils',
                'executorApplyingName-codicils',
                'executorNotApplyingHeader',
                'executorNotApplyingReason',
                'executorNotApplyingReason-codicils',
                'optionDiedBefore',
                'optionDiedAfter',
                'optionPowerReserved',
                'optionRenunciated',
                'optionDivorced',
                'optionWidowed',
                'optionNotMarried',
                'optionSeparated',
                'additionalExecutorNotified',
                'intro-multipleApplicants',
                'legalStatementApplicant-multipleApplicants',
                'deceasedEstateLand-multipleApplicants',
                'applicantName-multipleApplicants',
                'applicantName-multipleApplicants-codicils',
                'applicantName-multipleApplicants-mainApplicant',
                'applicantName-multipleApplicants-mainApplicant-codicils',
                'applicantSend-codicils',
                'applicantSend-multipleApplicants',
                'applicantSend-multipleApplicants-mainApplicant',
                'applicantSend-multipleApplicants-codicils',
                'applicantSend-multipleApplicants-mainApplicant-codicils',
                'declarationConfirm-multipleApplicants',
                'declarationRequests-multipleApplicants',
                'declarationUnderstand-multipleApplicants',
                'declarationUnderstandItem1',
                'declarationUnderstandItem1-multipleApplicants',
                'declarationUnderstandItem2-multipleApplicants',
                'submitWarning-multipleApplicants',
                'applicantName-codicils',
                'codicil',
                'codicils'
            ];
            sessionData.deceased.maritalStatus = 'optionMarried';
            sessionData.deceased.anyOtherChildren = 'optionNo';
            sessionData.applicant.relationshipToDeceased = 'optionAdoptedChild';
            sessionData.iht.grossValueField = '300000.10';
            sessionData.iht.netValueField = '270000.34';
            sessionData.iht.grossValue = 300000.1;
            sessionData.iht.netValue = 270000.34;

            contentData.deceasedMaritalStatus = declarationContent.optionMarried;
            contentData.ihtGrossValue = sessionData.iht.grossValueField;
            contentData.ihtNetValue = sessionData.iht.netValueField;

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page when deceased was married, the applicant is the child, has no siblings and is not adopted, the estate is more than the IHT threshold', (done) => {
            const contentToExclude = [
                'probateHeader',
                'legalStatementDeceased',
                'deceasedEstateLand',
                'executorApplyingHeader',
                'applicantSend',
                'declarationConfirmItem3',
                'declarationRequestsItem1',
                'declarationRequestsItem2',
                'intestacyDeceasedEstateOutside',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseApplyingHadChildren',
                'intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThanIhtThreshold',
                'deceasedOtherNames',
                'applicantName',
                'applicantName-alias',
                'applicantName-alias-codicils',
                'applicantName-multipleApplicants-alias',
                'applicantName-multipleApplicants-alias-codicils',
                'applicantName-multipleApplicants-mainApplicant-alias',
                'applicantName-multipleApplicants-mainApplicant-alias-codicils',
                'executorApplyingName-codicils',
                'executorNotApplyingHeader',
                'executorNotApplyingReason',
                'executorNotApplyingReason-codicils',
                'optionDiedBefore',
                'optionDiedAfter',
                'optionPowerReserved',
                'optionRenunciated',
                'optionDivorced',
                'optionWidowed',
                'optionNotMarried',
                'optionSeparated',
                'additionalExecutorNotified',
                'intro-multipleApplicants',
                'legalStatementApplicant-multipleApplicants',
                'deceasedEstateLand-multipleApplicants',
                'applicantName-multipleApplicants',
                'applicantName-multipleApplicants-codicils',
                'applicantName-multipleApplicants-mainApplicant',
                'applicantName-multipleApplicants-mainApplicant-codicils',
                'applicantSend-codicils',
                'applicantSend-multipleApplicants',
                'applicantSend-multipleApplicants-mainApplicant',
                'applicantSend-multipleApplicants-codicils',
                'applicantSend-multipleApplicants-mainApplicant-codicils',
                'declarationConfirm-multipleApplicants',
                'declarationRequests-multipleApplicants',
                'declarationUnderstand-multipleApplicants',
                'declarationUnderstandItem1',
                'declarationUnderstandItem1-multipleApplicants',
                'declarationUnderstandItem2-multipleApplicants',
                'submitWarning-multipleApplicants',
                'applicantName-codicils',
                'codicil',
                'codicils'
            ];
            sessionData.deceased.maritalStatus = 'optionMarried';
            sessionData.deceased.anyOtherChildren = 'optionNo';
            sessionData.applicant.relationshipToDeceased = 'optionChild';
            sessionData.iht.grossValueField = '300000.10';
            sessionData.iht.netValueField = '270000.34';
            sessionData.iht.grossValue = 300000.1;
            sessionData.iht.netValue = 270000.34;

            contentData.deceasedMaritalStatus = declarationContent.optionMarried;
            contentData.ihtGrossValue = sessionData.iht.grossValueField;
            contentData.ihtNetValue = sessionData.iht.netValueField;

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page when deceased was married, had no children, the applicant is the spouse', (done) => {
            const contentToExclude = [
                'probateHeader',
                'legalStatementDeceased',
                'deceasedEstateLand',
                'executorApplyingHeader',
                'applicantSend',
                'declarationConfirmItem3',
                'declarationRequestsItem1',
                'declarationRequestsItem2',
                'intestacyDeceasedEstateOutside',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseApplyingHadChildren',
                'deceasedOtherNames',
                'applicantName',
                'applicantName-alias',
                'applicantName-alias-codicils',
                'applicantName-multipleApplicants-alias',
                'applicantName-multipleApplicants-alias-codicils',
                'applicantName-multipleApplicants-mainApplicant-alias',
                'applicantName-multipleApplicants-mainApplicant-alias-codicils',
                'executorApplyingName-codicils',
                'executorNotApplyingHeader',
                'executorNotApplyingReason',
                'executorNotApplyingReason-codicils',
                'optionDiedBefore',
                'optionDiedAfter',
                'optionPowerReserved',
                'optionRenunciated',
                'optionDivorced',
                'optionWidowed',
                'optionNotMarried',
                'optionSeparated',
                'additionalExecutorNotified',
                'intro-multipleApplicants',
                'legalStatementApplicant-multipleApplicants',
                'deceasedEstateLand-multipleApplicants',
                'applicantName-multipleApplicants',
                'applicantName-multipleApplicants-codicils',
                'applicantName-multipleApplicants-mainApplicant',
                'applicantName-multipleApplicants-mainApplicant-codicils',
                'applicantSend-codicils',
                'applicantSend-multipleApplicants',
                'applicantSend-multipleApplicants-mainApplicant',
                'applicantSend-multipleApplicants-codicils',
                'applicantSend-multipleApplicants-mainApplicant-codicils',
                'declarationConfirm-multipleApplicants',
                'declarationRequests-multipleApplicants',
                'declarationUnderstand-multipleApplicants',
                'declarationUnderstandItem1',
                'declarationUnderstandItem1-multipleApplicants',
                'declarationUnderstandItem2-multipleApplicants',
                'submitWarning-multipleApplicants',
                'applicantName-codicils',
                'codicil',
                'codicils'
            ];
            sessionData.deceased['dod-date'] = '2016-05-12';
            sessionData.deceased.maritalStatus = 'optionMarried';
            sessionData.applicant.anyChildren = 'optionNo';
            sessionData.applicant.relationshipToDeceased = 'optionSpousePartner';

            contentData.deceasedMaritalStatus = declarationContent.optionMarried;

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page when deceased was married, had children, the applicant is the spouse, the estate is less than or equal to the IHT threshold', (done) => {
            const contentToExclude = [
                'probateHeader',
                'legalStatementDeceased',
                'deceasedEstateLand',
                'executorApplyingHeader',
                'applicantSend',
                'declarationConfirmItem3',
                'declarationRequestsItem1',
                'declarationRequestsItem2',
                'intestacyDeceasedEstateOutside',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseApplyingHadChildren',
                'deceasedOtherNames',
                'applicantName',
                'applicantName-alias',
                'applicantName-alias-codicils',
                'applicantName-multipleApplicants-alias',
                'applicantName-multipleApplicants-alias-codicils',
                'applicantName-multipleApplicants-mainApplicant-alias',
                'applicantName-multipleApplicants-mainApplicant-alias-codicils',
                'executorApplyingName-codicils',
                'executorNotApplyingHeader',
                'executorNotApplyingReason',
                'executorNotApplyingReason-codicils',
                'optionDiedBefore',
                'optionDiedAfter',
                'optionPowerReserved',
                'optionRenunciated',
                'optionDivorced',
                'optionWidowed',
                'optionNotMarried',
                'optionSeparated',
                'additionalExecutorNotified',
                'intro-multipleApplicants',
                'legalStatementApplicant-multipleApplicants',
                'deceasedEstateLand-multipleApplicants',
                'applicantName-multipleApplicants',
                'applicantName-multipleApplicants-codicils',
                'applicantName-multipleApplicants-mainApplicant',
                'applicantName-multipleApplicants-mainApplicant-codicils',
                'applicantSend-codicils',
                'applicantSend-multipleApplicants',
                'applicantSend-multipleApplicants-mainApplicant',
                'applicantSend-multipleApplicants-codicils',
                'applicantSend-multipleApplicants-mainApplicant-codicils',
                'declarationConfirm-multipleApplicants',
                'declarationRequests-multipleApplicants',
                'declarationUnderstand-multipleApplicants',
                'declarationUnderstandItem1',
                'declarationUnderstandItem1-multipleApplicants',
                'declarationUnderstandItem2-multipleApplicants',
                'submitWarning-multipleApplicants',
                'applicantName-codicils',
                'codicil',
                'codicils'
            ];
            sessionData.deceased['dod-date'] = '2016-05-12';
            sessionData.deceased.maritalStatus = 'optionMarried';
            sessionData.applicant.anyChildren = 'optionYes';
            sessionData.applicant.relationshipToDeceased = 'optionSpousePartner';

            contentData.deceasedMaritalStatus = declarationContent.optionMarried;

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page when deceased was married, had no children, the applicant is the spouse, the estate is more the IHT threshold', (done) => {
            const contentToExclude = [
                'probateHeader',
                'legalStatementDeceased',
                'deceasedEstateLand',
                'executorApplyingHeader',
                'applicantSend',
                'declarationConfirmItem3',
                'declarationRequestsItem1',
                'declarationRequestsItem2',
                'intestacyDeceasedEstateOutside',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThanIhtThreshold',
                'deceasedOtherNames',
                'applicantName',
                'applicantName-alias',
                'applicantName-alias-codicils',
                'applicantName-multipleApplicants-alias',
                'applicantName-multipleApplicants-alias-codicils',
                'applicantName-multipleApplicants-mainApplicant-alias',
                'applicantName-multipleApplicants-mainApplicant-alias-codicils',
                'executorApplyingName-codicils',
                'executorNotApplyingHeader',
                'executorNotApplyingReason',
                'executorNotApplyingReason-codicils',
                'optionDiedBefore',
                'optionDiedAfter',
                'optionPowerReserved',
                'optionRenunciated',
                'optionDivorced',
                'optionWidowed',
                'optionNotMarried',
                'optionSeparated',
                'additionalExecutorNotified',
                'intro-multipleApplicants',
                'legalStatementApplicant-multipleApplicants',
                'deceasedEstateLand-multipleApplicants',
                'applicantName-multipleApplicants',
                'applicantName-multipleApplicants-codicils',
                'applicantName-multipleApplicants-mainApplicant',
                'applicantName-multipleApplicants-mainApplicant-codicils',
                'applicantSend-codicils',
                'applicantSend-multipleApplicants',
                'applicantSend-multipleApplicants-mainApplicant',
                'applicantSend-multipleApplicants-codicils',
                'applicantSend-multipleApplicants-mainApplicant-codicils',
                'declarationConfirm-multipleApplicants',
                'declarationRequests-multipleApplicants',
                'declarationUnderstand-multipleApplicants',
                'declarationUnderstandItem1',
                'declarationUnderstandItem1-multipleApplicants',
                'declarationUnderstandItem2-multipleApplicants',
                'submitWarning-multipleApplicants',
                'applicantName-codicils',
                'codicil',
                'codicils'
            ];
            sessionData.deceased['dod-date'] = '2016-05-12';
            sessionData.deceased.maritalStatus = 'optionMarried';
            sessionData.applicant.anyChildren = 'optionNo';
            sessionData.applicant.relationshipToDeceased = 'optionSpousePartner';
            sessionData.iht.grossValueField = '300000.10';
            sessionData.iht.netValueField = '270000.34';
            sessionData.iht.grossValue = 300000.1;
            sessionData.iht.netValue = 270000.34;

            contentData.deceasedMaritalStatus = declarationContent.optionMarried;
            contentData.ihtGrossValue = sessionData.iht.grossValueField;
            contentData.ihtNetValue = sessionData.iht.netValueField;

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page when deceased was married, had children, the applicant is the spouse, the estate is more the IHT threshold', (done) => {
            const contentToExclude = [
                'probateHeader',
                'legalStatementDeceased',
                'deceasedEstateLand',
                'executorApplyingHeader',
                'applicantSend',
                'declarationConfirmItem3',
                'declarationRequestsItem1',
                'declarationRequestsItem2',
                'intestacyDeceasedEstateOutside',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThanIhtThreshold',
                'deceasedOtherNames',
                'applicantName',
                'applicantName-alias',
                'applicantName-alias-codicils',
                'applicantName-multipleApplicants-alias',
                'applicantName-multipleApplicants-alias-codicils',
                'applicantName-multipleApplicants-mainApplicant-alias',
                'applicantName-multipleApplicants-mainApplicant-alias-codicils',
                'executorApplyingName-codicils',
                'executorNotApplyingHeader',
                'executorNotApplyingReason',
                'executorNotApplyingReason-codicils',
                'optionDiedBefore',
                'optionDiedAfter',
                'optionPowerReserved',
                'optionRenunciated',
                'optionDivorced',
                'optionWidowed',
                'optionNotMarried',
                'optionSeparated',
                'additionalExecutorNotified',
                'intro-multipleApplicants',
                'legalStatementApplicant-multipleApplicants',
                'deceasedEstateLand-multipleApplicants',
                'applicantName-multipleApplicants',
                'applicantName-multipleApplicants-codicils',
                'applicantName-multipleApplicants-mainApplicant',
                'applicantName-multipleApplicants-mainApplicant-codicils',
                'applicantSend-codicils',
                'applicantSend-multipleApplicants',
                'applicantSend-multipleApplicants-mainApplicant',
                'applicantSend-multipleApplicants-codicils',
                'applicantSend-multipleApplicants-mainApplicant-codicils',
                'declarationConfirm-multipleApplicants',
                'declarationRequests-multipleApplicants',
                'declarationUnderstand-multipleApplicants',
                'declarationUnderstandItem1',
                'declarationUnderstandItem1-multipleApplicants',
                'declarationUnderstandItem2-multipleApplicants',
                'submitWarning-multipleApplicants',
                'applicantName-codicils',
                'codicil',
                'codicils'
            ];
            sessionData.deceased.maritalStatus = 'optionMarried';
            sessionData.applicant.anyChildren = 'optionYes';
            sessionData.applicant.relationshipToDeceased = 'optionSpousePartner';
            sessionData.iht.grossValueField = '300000.10';
            sessionData.iht.netValueField = '270000.34';
            sessionData.iht.grossValue = 300000.1;
            sessionData.iht.netValue = 270000.34;

            contentData.deceasedMaritalStatus = declarationContent.optionMarried;
            contentData.ihtGrossValue = sessionData.iht.grossValueField;
            contentData.ihtNetValue = sessionData.iht.netValueField;

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const errorsToTest = ['declarationCheckbox'];

                    testWrapper.testErrors(done, {}, 'required', errorsToTest);
                });
        });

        it(`test it redirects to next page: ${expectedNextUrlForExecInvite}`, (done) => {
            sessionData = {
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
                form: {
                    executors: {
                        list: [
                            {firstName: 'Bob', lastName: 'Smith', isApplying: true, isApplicant: true}
                        ],
                        invitesSent: 'true'
                    },
                    declaration: {
                        hasDataChanged: false
                    },
                    session: {
                        legalDeclaration: {}
                    }
                }
            };

            testWrapper.agent.post('/prepare-session-field/serviceAuthorization/SERVICE_AUTH_123')
                .end(() => {
                    testWrapper.agent.post('/prepare-session/form')
                        .send(sessionData)
                        .end(() => {
                            const data = {
                                declarationCheckbox: true
                            };

                            testWrapper.testRedirect(done, data, expectedNextUrlForExecInvite);
                        });
                });
        });
    });
});
