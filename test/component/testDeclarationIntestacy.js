// eslint-disable-line max-lines

'use strict';

const TestWrapper = require('test/util/TestWrapper');
const Taskist = require('app/steps/ui/tasklist');
const contentDeceasedMaritalStatus = require('app/resources/en/translation/deceased/maritalstatus');
const contentAssetsOutside = require('app/resources/en/translation/iht/assetsoutside');
const contentAnyChildren = require('app/resources/en/translation/deceased/anychildren');
const contentAnyOtherChildren = require('app/resources/en/translation/deceased/anyotherchildren');
const contentRelationshipToDeceased = require('app/resources/en/translation/applicant/relationshiptodeceased');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');
const config = require('app/config');
const nock = require('nock');
const featureToggleUrl = config.featureToggles.url;
const intestacyQuestionsFeatureTogglePath = `${config.featureToggles.path}/${config.featureToggles.intestacy_questions}`;
const featureTogglesNock = (status = 'true') => {
    nock(featureToggleUrl)
        .get(intestacyQuestionsFeatureTogglePath)
        .reply(200, status);
};
const caseTypes = require('app/utils/CaseTypes');

describe('declaration, intestacy', () => {
    let testWrapper, contentData, sessionData;
    const expectedNextUrlForExecInvite = Taskist.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('Declaration');
        featureTogglesNock();

        sessionData = require('test/data/complete-form-undeclared').formdata;
        sessionData.caseType = caseTypes.INTESTACY;
        const applicantData = sessionData.applicant;
        const deceasedData = sessionData.deceased;

        contentData = {
            applicantName: `${applicantData.firstName} ${applicantData.lastName}`,
            applicantAddress: applicantData.address.formattedAddress,
            deceasedName: `${deceasedData.firstName} ${deceasedData.lastName}`,
            deceasedAddress: deceasedData.address.formattedAddress,
            deceasedDob: deceasedData.dob_formattedDate,
            deceasedDod: deceasedData.dod_formattedDate,
            ihtGrossValue: sessionData.iht.grossValueField,
            ihtNetValue: sessionData.iht.netValueField
        };
    });

    afterEach(() => {
        delete require.cache[require.resolve('test/data/complete-form-undeclared')];
        testWrapper.destroy();
        nock.cleanAll();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('Declaration', featureTogglesNock);

        it('test right content loaded on the page when deceased has assets overseas and the total net value is more than £250k', (done) => {
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
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseApplyingHadChildren',
                'intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThan250k',
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
            sessionData.iht.assetsOutside = contentAssetsOutside.optionYes;
            sessionData.iht.grossValueField = '300000.10';
            sessionData.iht.netValueField = '270000.34';
            sessionData.iht.netValueAssetsOutsideField = '300000.10';
            sessionData.iht.grossValue = 300000.1;
            sessionData.iht.netValue = 270000.34;
            sessionData.iht.netValueAssetsOutside = 300000.1;
            sessionData.deceased.maritalStatus = contentDeceasedMaritalStatus.optionDivorced;
            sessionData.deceased.anyOtherChildren = contentAnyOtherChildren.optionYes;
            sessionData.applicant.relationshipToDeceased = contentRelationshipToDeceased.optionAdoptedChild;

            contentData.ihtGrossValue = sessionData.iht.grossValueField;
            contentData.ihtNetValue = sessionData.iht.netValueField;
            contentData.ihtNetValueAssetsOutside = sessionData.iht.netValueAssetsOutsideField;
            contentData.deceasedMaritalStatus = contentDeceasedMaritalStatus.optionDivorced;

            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    testWrapper.agent.post('/prepare-session/form')
                        .send(sessionData)
                        .end(() => {
                            testWrapper.testContent(done, contentToExclude, contentData);
                        });
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
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseApplyingHadChildren',
                'intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThan250k',
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
            sessionData.deceased.maritalStatus = contentDeceasedMaritalStatus.optionDivorced;
            sessionData.deceased.anyOtherChildren = contentAnyOtherChildren.optionYes;
            sessionData.applicant.relationshipToDeceased = contentRelationshipToDeceased.optionAdoptedChild;

            contentData.deceasedMaritalStatus = contentDeceasedMaritalStatus.optionDivorced;

            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    testWrapper.agent.post('/prepare-session/form')
                        .send(sessionData)
                        .end(() => {
                            testWrapper.testContent(done, contentToExclude, contentData);
                        });
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
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseApplyingHadChildren',
                'intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThan250k',
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
            sessionData.deceased.maritalStatus = contentDeceasedMaritalStatus.optionDivorced;
            sessionData.deceased.anyOtherChildren = contentAnyOtherChildren.optionYes;
            sessionData.applicant.relationshipToDeceased = contentRelationshipToDeceased.optionChild;

            contentData.deceasedMaritalStatus = contentDeceasedMaritalStatus.optionDivorced;

            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    testWrapper.agent.post('/prepare-session/form')
                        .send(sessionData)
                        .end(() => {
                            testWrapper.testContent(done, contentToExclude, contentData);
                        });
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
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseApplyingHadChildren',
                'intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThan250k',
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
            sessionData.deceased.maritalStatus = contentDeceasedMaritalStatus.optionDivorced;
            sessionData.deceased.anyOtherChildren = contentAnyOtherChildren.optionNo;
            sessionData.applicant.relationshipToDeceased = contentRelationshipToDeceased.optionAdoptedChild;

            contentData.deceasedMaritalStatus = contentDeceasedMaritalStatus.optionDivorced;

            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    testWrapper.agent.post('/prepare-session/form')
                        .send(sessionData)
                        .end(() => {
                            testWrapper.testContent(done, contentToExclude, contentData);
                        });
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
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseApplyingHadChildren',
                'intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThan250k',
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
            sessionData.deceased.maritalStatus = contentDeceasedMaritalStatus.optionDivorced;
            sessionData.deceased.anyOtherChildren = contentAnyOtherChildren.optionNo;
            sessionData.applicant.relationshipToDeceased = contentRelationshipToDeceased.optionChild;

            contentData.deceasedMaritalStatus = contentDeceasedMaritalStatus.optionDivorced;

            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    testWrapper.agent.post('/prepare-session/form')
                        .send(sessionData)
                        .end(() => {
                            testWrapper.testContent(done, contentToExclude, contentData);
                        });
                });
        });

        it('test right content loaded on the page when deceased was married, the applicant is the child, has siblings and is adopted, the estate is less than or equal to £250k', (done) => {
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
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseApplyingHadChildren',
                'intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThan250k',
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
            sessionData.deceased.maritalStatus = contentDeceasedMaritalStatus.optionMarried;
            sessionData.deceased.anyOtherChildren = contentAnyOtherChildren.optionYes;
            sessionData.applicant.relationshipToDeceased = contentRelationshipToDeceased.optionAdoptedChild;

            contentData.deceasedMaritalStatus = contentDeceasedMaritalStatus.optionMarried;

            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    testWrapper.agent.post('/prepare-session/form')
                        .send(sessionData)
                        .end(() => {
                            testWrapper.testContent(done, contentToExclude, contentData);
                        });
                });
        });

        it('test right content loaded on the page when deceased was married, the applicant is the child, has siblings and is not adopted, the estate is less than or equal to £250k', (done) => {
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
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseApplyingHadChildren',
                'intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThan250k',
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
            sessionData.deceased.maritalStatus = contentDeceasedMaritalStatus.optionMarried;
            sessionData.deceased.anyOtherChildren = contentAnyOtherChildren.optionYes;
            sessionData.applicant.relationshipToDeceased = contentRelationshipToDeceased.optionChild;

            contentData.deceasedMaritalStatus = contentDeceasedMaritalStatus.optionMarried;

            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    testWrapper.agent.post('/prepare-session/form')
                        .send(sessionData)
                        .end(() => {
                            testWrapper.testContent(done, contentToExclude, contentData);
                        });
                });
        });

        it('test right content loaded on the page when deceased was married, the applicant is the child, has no siblings and is adopted, the estate is less than or equal to £250k', (done) => {
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
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseApplyingHadChildren',
                'intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThan250k',
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
            sessionData.deceased.maritalStatus = contentDeceasedMaritalStatus.optionMarried;
            sessionData.deceased.anyOtherChildren = contentAnyOtherChildren.optionNo;
            sessionData.applicant.relationshipToDeceased = contentRelationshipToDeceased.optionAdoptedChild;

            contentData.deceasedMaritalStatus = contentDeceasedMaritalStatus.optionMarried;

            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    testWrapper.agent.post('/prepare-session/form')
                        .send(sessionData)
                        .end(() => {
                            testWrapper.testContent(done, contentToExclude, contentData);
                        });
                });
        });

        it('test right content loaded on the page when deceased was married, the applicant is the child, has no siblings and is not adopted, the estate is less than or equal to £250k', (done) => {
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
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseApplyingHadChildren',
                'intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThan250k',
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
            sessionData.deceased.maritalStatus = contentDeceasedMaritalStatus.optionMarried;
            sessionData.deceased.anyOtherChildren = contentAnyOtherChildren.optionNo;
            sessionData.applicant.relationshipToDeceased = contentRelationshipToDeceased.optionChild;

            contentData.deceasedMaritalStatus = contentDeceasedMaritalStatus.optionMarried;

            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    testWrapper.agent.post('/prepare-session/form')
                        .send(sessionData)
                        .end(() => {
                            testWrapper.testContent(done, contentToExclude, contentData);
                        });
                });
        });

        it('test right content loaded on the page when deceased was married, the applicant is the child, has siblings and is adopted, the estate is more than £250k', (done) => {
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
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseApplyingHadChildren',
                'intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThan250k',
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
            sessionData.deceased.maritalStatus = contentDeceasedMaritalStatus.optionMarried;
            sessionData.deceased.anyOtherChildren = contentAnyOtherChildren.optionYes;
            sessionData.applicant.relationshipToDeceased = contentRelationshipToDeceased.optionAdoptedChild;
            sessionData.iht.grossValueField = '300000.10';
            sessionData.iht.netValueField = '270000.34';
            sessionData.iht.grossValue = 300000.1;
            sessionData.iht.netValue = 270000.34;

            contentData.deceasedMaritalStatus = contentDeceasedMaritalStatus.optionMarried;
            contentData.ihtGrossValue = sessionData.iht.grossValueField;
            contentData.ihtNetValue = sessionData.iht.netValueField;

            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    testWrapper.agent.post('/prepare-session/form')
                        .send(sessionData)
                        .end(() => {
                            testWrapper.testContent(done, contentToExclude, contentData);
                        });
                });
        });

        it('test right content loaded on the page when deceased was married, the applicant is the child, has siblings and is not adopted, the estate is more than £250k', (done) => {
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
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseApplyingHadChildren',
                'intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThan250k',
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
            sessionData.deceased.maritalStatus = contentDeceasedMaritalStatus.optionMarried;
            sessionData.deceased.anyOtherChildren = contentAnyOtherChildren.optionYes;
            sessionData.applicant.relationshipToDeceased = contentRelationshipToDeceased.optionChild;
            sessionData.iht.grossValueField = '300000.10';
            sessionData.iht.netValueField = '270000.34';
            sessionData.iht.grossValue = 300000.1;
            sessionData.iht.netValue = 270000.34;

            contentData.deceasedMaritalStatus = contentDeceasedMaritalStatus.optionMarried;
            contentData.ihtGrossValue = sessionData.iht.grossValueField;
            contentData.ihtNetValue = sessionData.iht.netValueField;

            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    testWrapper.agent.post('/prepare-session/form')
                        .send(sessionData)
                        .end(() => {
                            testWrapper.testContent(done, contentToExclude, contentData);
                        });
                });
        });

        it('test right content loaded on the page when deceased was married, the applicant is the child, has no siblings and is adopted, the estate is more than £250k', (done) => {
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
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseApplyingHadChildren',
                'intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThan250k',
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
            sessionData.deceased.maritalStatus = contentDeceasedMaritalStatus.optionMarried;
            sessionData.deceased.anyOtherChildren = contentAnyOtherChildren.optionNo;
            sessionData.applicant.relationshipToDeceased = contentRelationshipToDeceased.optionAdoptedChild;
            sessionData.iht.grossValueField = '300000.10';
            sessionData.iht.netValueField = '270000.34';
            sessionData.iht.grossValue = 300000.1;
            sessionData.iht.netValue = 270000.34;

            contentData.deceasedMaritalStatus = contentDeceasedMaritalStatus.optionMarried;
            contentData.ihtGrossValue = sessionData.iht.grossValueField;
            contentData.ihtNetValue = sessionData.iht.netValueField;

            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    testWrapper.agent.post('/prepare-session/form')
                        .send(sessionData)
                        .end(() => {
                            testWrapper.testContent(done, contentToExclude, contentData);
                        });
                });
        });

        it('test right content loaded on the page when deceased was married, the applicant is the child, has no siblings and is not adopted, the estate is more than £250k', (done) => {
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
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseApplyingHadChildren',
                'intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThan250k',
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
            sessionData.deceased.maritalStatus = contentDeceasedMaritalStatus.optionMarried;
            sessionData.deceased.anyOtherChildren = contentAnyOtherChildren.optionNo;
            sessionData.applicant.relationshipToDeceased = contentRelationshipToDeceased.optionChild;
            sessionData.iht.grossValueField = '300000.10';
            sessionData.iht.netValueField = '270000.34';
            sessionData.iht.grossValue = 300000.1;
            sessionData.iht.netValue = 270000.34;

            contentData.deceasedMaritalStatus = contentDeceasedMaritalStatus.optionMarried;
            contentData.ihtGrossValue = sessionData.iht.grossValueField;
            contentData.ihtNetValue = sessionData.iht.netValueField;

            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    testWrapper.agent.post('/prepare-session/form')
                        .send(sessionData)
                        .end(() => {
                            testWrapper.testContent(done, contentToExclude, contentData);
                        });
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
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsNotAdopted',
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
            sessionData.deceased.maritalStatus = contentDeceasedMaritalStatus.optionMarried;
            sessionData.applicant.anyChildren = contentAnyChildren.optionNo;
            sessionData.applicant.relationshipToDeceased = contentRelationshipToDeceased.optionSpousePartner;

            contentData.deceasedMaritalStatus = contentDeceasedMaritalStatus.optionMarried;

            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    testWrapper.agent.post('/prepare-session/form')
                        .send(sessionData)
                        .end(() => {
                            testWrapper.testContent(done, contentToExclude, contentData);
                        });
                });
        });

        it('test right content loaded on the page when deceased was married, had children, the applicant is the spouse, the estate is less than or equal to £250k', (done) => {
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
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsNotAdopted',
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
            sessionData.deceased.maritalStatus = contentDeceasedMaritalStatus.optionMarried;
            sessionData.applicant.anyChildren = contentAnyChildren.optionYes;
            sessionData.applicant.relationshipToDeceased = contentRelationshipToDeceased.optionSpousePartner;

            contentData.deceasedMaritalStatus = contentDeceasedMaritalStatus.optionMarried;

            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    testWrapper.agent.post('/prepare-session/form')
                        .send(sessionData)
                        .end(() => {
                            testWrapper.testContent(done, contentToExclude, contentData);
                        });
                });
        });

        it('test right content loaded on the page when deceased was married, had no children, the applicant is the spouse, the estate is more £250k', (done) => {
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
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThan250k',
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
            sessionData.deceased.maritalStatus = contentDeceasedMaritalStatus.optionMarried;
            sessionData.applicant.anyChildren = contentAnyChildren.optionNo;
            sessionData.applicant.relationshipToDeceased = contentRelationshipToDeceased.optionSpousePartner;
            sessionData.iht.grossValueField = '300000.10';
            sessionData.iht.netValueField = '270000.34';
            sessionData.iht.grossValue = 300000.1;
            sessionData.iht.netValue = 270000.34;

            contentData.deceasedMaritalStatus = contentDeceasedMaritalStatus.optionMarried;
            contentData.ihtGrossValue = sessionData.iht.grossValueField;
            contentData.ihtNetValue = sessionData.iht.netValueField;

            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    testWrapper.agent.post('/prepare-session/form')
                        .send(sessionData)
                        .end(() => {
                            testWrapper.testContent(done, contentToExclude, contentData);
                        });
                });
        });

        it('test right content loaded on the page when deceased was married, had children, the applicant is the spouse, the estate is more £250k', (done) => {
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
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsAdopted',
                'intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsNotAdopted',
                'intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThan250k',
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
            sessionData.deceased.maritalStatus = contentDeceasedMaritalStatus.optionMarried;
            sessionData.applicant.anyChildren = contentAnyChildren.optionYes;
            sessionData.applicant.relationshipToDeceased = contentRelationshipToDeceased.optionSpousePartner;
            sessionData.iht.grossValueField = '300000.10';
            sessionData.iht.netValueField = '270000.34';
            sessionData.iht.grossValue = 300000.1;
            sessionData.iht.netValue = 270000.34;

            contentData.deceasedMaritalStatus = contentDeceasedMaritalStatus.optionMarried;
            contentData.ihtGrossValue = sessionData.iht.grossValueField;
            contentData.ihtNetValue = sessionData.iht.netValueField;

            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    testWrapper.agent.post('/prepare-session/form')
                        .send(sessionData)
                        .end(() => {
                            testWrapper.testContent(done, contentToExclude, contentData);
                        });
                });
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {};
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testErrors(done, data, 'required', [
                        'declarationCheckbox'
                    ]);
                });
        });

        it(`test it redirects to next page: ${expectedNextUrlForExecInvite}`, (done) => {
            sessionData = {
                executors: {
                    list: [
                        {firstName: 'Bob', lastName: 'Smith', isApplying: true, isApplicant: true}
                    ],
                    invitesSent: 'true'
                },
                declaration: {
                    hasDataChanged: false
                }
            };
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
