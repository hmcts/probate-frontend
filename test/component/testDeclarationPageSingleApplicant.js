// eslint-disable-line max-lines

'use strict';

const TestWrapper = require('test/util/TestWrapper');
const Taskist = require('app/steps/ui/tasklist');
const content = require('app/resources/en/translation/declaration');
const testCommonContent = require('test/component/common/testCommonContent.js');
const nock = require('nock');
const config = require('config');

describe('declaration, single applicant', () => {
    let testWrapper, contentData, sessionData;
    const expectedNextUrlForExecInvite = Taskist.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('Declaration');

        sessionData = require('test/data/complete-form-undeclared').formdata;
        const applicantData = sessionData.applicant;
        const deceasedData = sessionData.deceased;

        contentData = {
            applicantName: `${applicantData.firstName} ${applicantData.lastName}`,
            applicantWillName: applicantData.alias,
            applicantCurrentName: `${applicantData.firstName} ${applicantData.lastName}`,
            aliasReason: ' i changed my name by deed poll',
            applicantAddress: applicantData.address.formattedAddress,
            deceasedName: `${deceasedData.firstName} ${deceasedData.lastName}`,
            deceasedAddress: deceasedData.address.formattedAddress,
            deceasedDob: deceasedData['dob-formattedDate'],
            deceasedDod: deceasedData['dod-formattedDate'],
            ihtGrossValue: sessionData.iht.grossValueField,
            ihtNetValue: sessionData.iht.netValueField
        };

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
    });

    afterEach(async () => {
        delete require.cache[require.resolve('test/data/complete-form-undeclared')];
        nock.cleanAll();
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('Declaration');

        it('test right content loaded on the page when deceased has one other name, no codicils', (done) => {
            const contentToExclude = [
                'applicantName',
                'applicantName-alias-codicils',
                'applicantName-multipleApplicants-alias',
                'applicantName-multipleApplicants-alias-codicils',
                'applicantName-multipleApplicants-mainApplicant-alias',
                'applicantName-multipleApplicants-mainApplicant-alias-codicils',
                'executorApplyingName-codicils', 'executorNotApplyingHeader', 'executorNotApplyingReason',
                'executorNotApplyingReason-codicils',
                'optionDiedBefore',
                'optionDiedAfter',
                'optionPowerReserved',
                'optionRenunciated',
                'optionMarried',
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
                'declarationUnderstandItem1-multipleApplicants',
                'declarationUnderstandItem2-multipleApplicants',
                'submitWarning-multipleApplicants',
                'applicantName-codicils',
                'codicil',
                'codicils',
                'intestacyHeader',
                'declarationConfirmItem3-intestacy',
                'declarationRequestsItem1-intestacy',
                'declarationRequestsItem2-intestacy',
                'declarationUnderstandItem1-intestacy',
                'intestacyLegalStatementDeceased',
                'intestacyDeceasedMaritalStatus',
                'intestacyDeceasedChildren',
                'intestacyDeceasedEstateOutside',
                'intestacyDeceasedEstateLand',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsAdopted',
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
                'intestacyLettersOfAdministration',
                'deceasedEstateValueExceptedEstateConfirmation'
            ];
            sessionData.deceased.otherNames = {
                name_0: {
                    firstName: 'James',
                    lastName: 'Miller'
                }
            };
            contentData.deceasedOtherNames = 'James Miller';

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page when deceased has one other name, no codicils and applicant does not have an alias', (done) => {
            const contentToExclude = [
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
                'declarationUnderstandItem1-multipleApplicants',
                'declarationUnderstandItem2-multipleApplicants',
                'submitWarning-multipleApplicants',
                'applicantName-codicils',
                'codicil',
                'codicils',
                'intestacyHeader',
                'declarationConfirmItem3-intestacy',
                'declarationRequestsItem1-intestacy',
                'declarationRequestsItem2-intestacy',
                'declarationUnderstandItem1-intestacy',
                'intestacyLegalStatementDeceased',
                'intestacyDeceasedMaritalStatus',
                'intestacyDeceasedChildren',
                'intestacyDeceasedEstateOutside',
                'intestacyDeceasedEstateLand',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsAdopted',
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
                'intestacyLettersOfAdministration',
                'deceasedEstateValueExceptedEstateConfirmation'
            ];
            delete sessionData.applicant.alias;
            delete sessionData.applicant.aliasReason;
            delete sessionData.executors.list[0].alias;
            delete sessionData.executors.list[0].nameAsOnTheWill;
            contentData.applicantWillName = 'Bob Smith';
            sessionData.deceased.otherNames = {
                name_0: {
                    firstName: 'James',
                    lastName: 'Miller'
                }
            };
            contentData.deceasedOtherNames = 'James Miller';

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page when deceased has two other names, no codicils', (done) => {
            const contentToExclude = [
                'applicantName',
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
                'declarationUnderstandItem1-multipleApplicants',
                'declarationUnderstandItem2-multipleApplicants',
                'submitWarning-multipleApplicants',
                'applicantName-codicils',
                'codicil',
                'codicils',
                'intestacyHeader',
                'declarationConfirmItem3-intestacy',
                'declarationRequestsItem1-intestacy',
                'declarationRequestsItem2-intestacy',
                'declarationUnderstandItem1-intestacy',
                'intestacyLegalStatementDeceased',
                'intestacyDeceasedMaritalStatus',
                'intestacyDeceasedChildren',
                'intestacyDeceasedEstateOutside',
                'intestacyDeceasedEstateLand',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsAdopted',
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
                'intestacyLettersOfAdministration',
                'deceasedEstateValueExceptedEstateConfirmation'
            ];
            sessionData.deceased.otherNames = {
                name_0: {firstName: 'James', lastName: 'Miller'},
                name_1: {firstName: 'Joe', lastName: 'Smith'}
            };
            contentData.deceasedOtherNames = 'James Miller and Joe Smith';

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page when deceased has three other names, no codicils', (done) => {
            const contentToExclude = [
                'applicantName',
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
                'declarationUnderstandItem1-multipleApplicants',
                'declarationUnderstandItem2-multipleApplicants',
                'submitWarning-multipleApplicants',
                'applicantName-codicils',
                'codicil',
                'codicils',
                'intestacyHeader',
                'declarationConfirmItem3-intestacy',
                'declarationRequestsItem1-intestacy',
                'declarationRequestsItem2-intestacy',
                'declarationUnderstandItem1-intestacy',
                'intestacyLegalStatementDeceased',
                'intestacyDeceasedMaritalStatus',
                'intestacyDeceasedChildren',
                'intestacyDeceasedEstateOutside',
                'intestacyDeceasedEstateLand',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsAdopted',
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
                'intestacyLettersOfAdministration',
                'deceasedEstateValueExceptedEstateConfirmation'
            ];
            sessionData.deceased.otherNames = {
                name_0: {firstName: 'James', lastName: 'Miller'},
                name_1: {firstName: 'Joe', lastName: 'Smith'},
                name_2: {firstName: 'Ed', lastName: 'Brown'}
            };
            contentData.deceasedOtherNames = 'James Miller, Joe Smith and Ed Brown';

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page when deceased has no other names, no codicils', (done) => {
            const contentToExclude = [
                'applicantName',
                'applicantName-alias-codicils',
                'applicantName-multipleApplicants-alias',
                'applicantName-multipleApplicants-alias-codicils',
                'applicantName-multipleApplicants-mainApplicant-alias',
                'applicantName-multipleApplicants-mainApplicant-alias-codicils',
                'deceasedOtherNames',
                'executorApplyingName-codicils',
                'executorNotApplyingHeader',
                'executorNotApplyingReason',
                'executorNotApplyingReason-codicils',
                'optionDiedBefore',
                'optionDiedAfter',
                'optionPowerReserved',
                'optionRenunciated',
                'optionMarried',
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
                'declarationUnderstandItem1-multipleApplicants',
                'declarationUnderstandItem2-multipleApplicants',
                'submitWarning-multipleApplicants',
                'applicantName-codicils',
                'codicil',
                'codicils',
                'intestacyHeader',
                'declarationConfirmItem3-intestacy',
                'declarationRequestsItem1-intestacy',
                'declarationRequestsItem2-intestacy',
                'declarationUnderstandItem1-intestacy',
                'intestacyLegalStatementDeceased',
                'intestacyDeceasedMaritalStatus',
                'intestacyDeceasedChildren',
                'intestacyDeceasedEstateOutside',
                'intestacyDeceasedEstateLand',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsAdopted',
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
                'intestacyLettersOfAdministration',
                'deceasedEstateValueExceptedEstateConfirmation'
            ];
            delete contentData.deceasedOtherNames;

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page, excepted estate', (done) => {
            const contentToExclude = [
                'applicantName',
                'applicantName-alias-codicils',
                'applicantName-multipleApplicants-alias',
                'applicantName-multipleApplicants-alias-codicils',
                'applicantName-multipleApplicants-mainApplicant-alias',
                'applicantName-multipleApplicants-mainApplicant-alias-codicils',
                'deceasedOtherNames',
                'executorApplyingName-codicils',
                'executorNotApplyingHeader',
                'executorNotApplyingReason',
                'executorNotApplyingReason-codicils',
                'optionDiedBefore',
                'optionDiedAfter',
                'optionPowerReserved',
                'optionRenunciated',
                'optionMarried',
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
                'declarationUnderstandItem1-multipleApplicants',
                'declarationUnderstandItem2-multipleApplicants',
                'submitWarning-multipleApplicants',
                'applicantName-codicils',
                'codicil',
                'codicils',
                'intestacyHeader',
                'declarationConfirmItem3-intestacy',
                'declarationRequestsItem1-intestacy',
                'declarationRequestsItem2-intestacy',
                'declarationUnderstandItem1-intestacy',
                'intestacyLegalStatementDeceased',
                'intestacyDeceasedMaritalStatus',
                'intestacyDeceasedChildren',
                'intestacyDeceasedEstateOutside',
                'intestacyDeceasedEstateLand',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsAdopted',
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
                'intestacyLettersOfAdministration'
            ];
            delete contentData.deceasedOtherNames;
            sessionData.iht.estateValueCompleted = 'optionNo';
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });
        it('test right content loaded on the page when deceased has no other names and there are codicils', (done) => {
            const contentToExclude = [
                'applicantName-alias',
                'applicantName-alias-codicils',
                'applicantName-multipleApplicants-alias',
                'applicantName-multipleApplicants-alias-codicils',
                'applicantName-multipleApplicants-mainApplicant-alias',
                'applicantName-multipleApplicants-mainApplicant-alias-codicils',
                'deceasedOtherNames',
                'executorApplyingName',
                'executorNotApplyingHeader',
                'executorNotApplyingReason',
                'executorNotApplyingReason-codicils',
                'optionDiedBefore',
                'optionDiedAfter',
                'optionPowerReserved',
                'optionRenunciated',
                'optionMarried',
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
                'applicantSend',
                'applicantSend-multipleApplicants',
                'applicantSend-multipleApplicants-codicils',
                'applicantSend-multipleApplicants-mainApplicant',
                'applicantSend-multipleApplicants-mainApplicant-codicils',
                'declarationConfirm-multipleApplicants',
                'declarationRequests-multipleApplicants',
                'declarationUnderstand-multipleApplicants',
                'declarationUnderstandItem1-multipleApplicants',
                'declarationUnderstandItem2-multipleApplicants',
                'submitWarning-multipleApplicants',
                'applicantName-codicils',
                'applicantName',
                'codicil',
                'codicils',
                'intestacyHeader',
                'declarationConfirmItem3-intestacy',
                'declarationRequestsItem1-intestacy',
                'declarationRequestsItem2-intestacy',
                'declarationUnderstandItem1-intestacy',
                'intestacyLegalStatementDeceased',
                'intestacyDeceasedMaritalStatus',
                'intestacyDeceasedChildren',
                'intestacyDeceasedEstateOutside',
                'intestacyDeceasedEstateLand',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsAdopted',
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
                'intestacyLettersOfAdministration',
                'deceasedEstateValueExceptedEstateConfirmation'
            ];
            sessionData.will.codicils = 'optionYes';
            sessionData.will.codicilsNumber = 3;
            delete contentData.deceasedOtherNames;
            contentData.codicilsNumber = 3;
            contentData.codicils = 'codicils';

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page when deceased has no other names, no codicils and multiple executors (optionPowerReserved and additionalExecutorNotified)', (done) => {
            const contentToExclude = [
                'applicantName',
                'applicantName-alias-codicils',
                'applicantName-multipleApplicants-alias',
                'applicantName-multipleApplicants-alias-codicils',
                'applicantName-multipleApplicants-mainApplicant-alias',
                'applicantName-multipleApplicants-mainApplicant-alias-codicils',
                'executorApplyingName-codicils',
                'deceasedOtherNames',
                'executorApplyingName',
                'executorNotApplyingReason-codicils',
                'optionDiedBefore',
                'optionDiedAfter',
                'optionRenunciated',
                'optionMarried',
                'optionDivorced',
                'optionWidowed',
                'optionNotMarried',
                'optionSeparated',
                'intro-multipleApplicants',
                'legalStatementApplicant-multipleApplicants',
                'deceasedEstateLand-multipleApplicants',
                'applicantName-multipleApplicants',
                'applicantName-multipleApplicants-codicils',
                'applicantName-multipleApplicants-mainApplicant',
                'applicantName-multipleApplicants-mainApplicant-codicils',
                'applicantSend-codicils',
                'applicantSend-multipleApplicants',
                'applicantSend-multipleApplicants-codicils',
                'applicantSend-codicils',
                'applicantSend-multipleApplicants-mainApplicant',
                'applicantSend-multipleApplicants-mainApplicant-codicils',
                'declarationConfirm-multipleApplicants',
                'declarationRequests-multipleApplicants',
                'declarationUnderstand-multipleApplicants',
                'declarationUnderstandItem1-multipleApplicants',
                'declarationUnderstandItem2-multipleApplicants',
                'submitWarning-multipleApplicants',
                'applicantName-codicils',
                'applicantName',
                'codicil',
                'codicils',
                'intestacyHeader',
                'declarationConfirmItem3-intestacy',
                'declarationRequestsItem1-intestacy',
                'declarationRequestsItem2-intestacy',
                'declarationUnderstandItem1-intestacy',
                'intestacyLegalStatementDeceased',
                'intestacyDeceasedMaritalStatus',
                'intestacyDeceasedChildren',
                'intestacyDeceasedEstateOutside',
                'intestacyDeceasedEstateLand',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsAdopted',
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
                'intestacyLettersOfAdministration',
                'deceasedEstateValueExceptedEstateConfirmation'
            ];
            const executor = {
                fullName: 'James Miller',
                isDead: false,
                isApplying: false,
                notApplyingKey: 'optionPowerReserved',
                executorNotified: 'optionYes'
            };
            contentData.otherExecutorName = executor.fullName;
            contentData.otherExecutorApplying = content.optionPowerReserved;
            sessionData.executors.list.push(executor);

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page when deceased has no other names, there are codicils and multiple executors (optionDiedBefore)', (done) => {
            const contentToExclude = [
                'applicantName',
                'applicantName-alias',
                'applicantName-multipleApplicants-alias',
                'applicantName-multipleApplicants-alias-codicils',
                'applicantName-multipleApplicants-mainApplicant-alias',
                'applicantName-multipleApplicants-mainApplicant-alias-codicils',
                'deceasedOtherNames',
                'executorApplyingName',
                'executorNotApplyingReason',
                'optionDiedAfter',
                'optionPowerReserved',
                'optionRenunciated',
                'optionMarried',
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
                'applicantSend',
                'applicantSend-multipleApplicants',
                'applicantSend-multipleApplicants-codicils',
                'applicantSend-multipleApplicants-mainApplicant',
                'applicantSend-multipleApplicants-mainApplicant-codicils',
                'declarationConfirm-multipleApplicants',
                'declarationRequests-multipleApplicants',
                'declarationUnderstand-multipleApplicants',
                'declarationUnderstandItem1-multipleApplicants',
                'declarationUnderstandItem2-multipleApplicants',
                'submitWarning-multipleApplicants',
                'applicantName-codicils',
                'applicantName',
                'codicil',
                'codicils',
                'intestacyHeader',
                'declarationConfirmItem3-intestacy',
                'declarationRequestsItem1-intestacy',
                'declarationRequestsItem2-intestacy',
                'declarationUnderstandItem1-intestacy',
                'intestacyLegalStatementDeceased',
                'intestacyDeceasedMaritalStatus',
                'intestacyDeceasedChildren',
                'intestacyDeceasedEstateOutside',
                'intestacyDeceasedEstateLand',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsAdopted',
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
                'intestacyLettersOfAdministration',
                'deceasedEstateValueExceptedEstateConfirmation'
            ];
            const executor = {
                fullName: 'Joe Smith',
                isDead: true,
                diedBefore: 'optionYes',
                notApplyingKey: 'optionDiedBefore'
            };
            sessionData.will.codicils = 'optionYes';
            sessionData.will.codicilsNumber = 1;
            contentData.codicilsNumber = '';
            contentData.codicils = 'codicil';

            contentData.otherExecutorName = executor.fullName;
            contentData.otherExecutorApplying = content.optionDiedBefore.replace('{deceasedName}', sessionData.deceased.deceasedName);
            sessionData.executors.list.push(executor);

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page when deceased has no other names, there are codicils and multiple executors (optionDiedAfter)', (done) => {
            const contentToExclude = [
                'applicantName',
                'applicantName-alias',
                'applicantName-multipleApplicants-alias',
                'applicantName-multipleApplicants-alias-codicils',
                'applicantName-multipleApplicants-mainApplicant-alias',
                'applicantName-multipleApplicants-mainApplicant-alias-codicils',
                'deceasedOtherNames',
                'executorApplyingName',
                'executorNotApplyingReason',
                'optionDiedBefore',
                'optionPowerReserved',
                'optionRenunciated',
                'optionMarried',
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
                'applicantSend',
                'applicantSend-multipleApplicants',
                'applicantSend-multipleApplicants-codicils',
                'applicantSend-multipleApplicants-mainApplicant',
                'applicantSend-multipleApplicants-mainApplicant-codicils',
                'declarationConfirm-multipleApplicants',
                'declarationRequests-multipleApplicants',
                'declarationUnderstand-multipleApplicants',
                'declarationUnderstandItem1-multipleApplicants',
                'declarationUnderstandItem2-multipleApplicants',
                'submitWarning-multipleApplicants',
                'applicantName-codicils',
                'applicantName',
                'codicil',
                'codicils',
                'intestacyHeader',
                'declarationConfirmItem3-intestacy',
                'declarationRequestsItem1-intestacy',
                'declarationRequestsItem2-intestacy',
                'declarationUnderstandItem1-intestacy',
                'intestacyLegalStatementDeceased',
                'intestacyDeceasedMaritalStatus',
                'intestacyDeceasedChildren',
                'intestacyDeceasedEstateOutside',
                'intestacyDeceasedEstateLand',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsAdopted',
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
                'intestacyLettersOfAdministration',
                'deceasedEstateValueExceptedEstateConfirmation'
            ];
            const executor = {
                fullName: 'Ed Brown',
                isDead: true,
                diedBefore: 'optionNo',
                notApplyingKey: 'optionDiedAfter'
            };
            sessionData.will.codicils = 'optionYes';
            sessionData.will.codicilsNumber = 2;
            contentData.codicilsNumber = 2;
            contentData.codicils = 'codicils';
            contentData.otherExecutorName = executor.fullName;
            contentData.otherExecutorApplying = content.optionDiedAfter.replace('{deceasedName}', sessionData.deceased.deceasedName);
            sessionData.executors.list.push(executor);

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page when deceased has no other names, there are codicils and multiple executors (optionRenunciated)', (done) => {
            const contentToExclude = [
                'applicantName',
                'applicantName-alias',
                'applicantName-multipleApplicants-alias',
                'applicantName-multipleApplicants-alias-codicils',
                'applicantName-multipleApplicants-mainApplicant-alias',
                'applicantName-multipleApplicants-mainApplicant-alias-codicils',
                'deceasedOtherNames',
                'executorApplyingName',
                'executorNotApplyingReason',
                'optionDiedBefore',
                'optionDiedAfter',
                'optionPowerReserved',
                'optionMarried',
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
                'applicantSend',
                'applicantSend-multipleApplicants',
                'applicantSend-multipleApplicants-codicils',
                'applicantSend-multipleApplicants-mainApplicant',
                'applicantSend-multipleApplicants-mainApplicant-codicils',
                'declarationConfirm-multipleApplicants',
                'declarationRequests-multipleApplicants',
                'declarationUnderstand-multipleApplicants',
                'declarationUnderstandItem1-multipleApplicants',
                'declarationUnderstandItem2-multipleApplicants',
                'submitWarning-multipleApplicants',
                'applicantName-codicils',
                'applicantName',
                'codicil',
                'codicils',
                'intestacyHeader',
                'declarationConfirmItem3-intestacy',
                'declarationRequestsItem1-intestacy',
                'declarationRequestsItem2-intestacy',
                'declarationUnderstandItem1-intestacy',
                'intestacyLegalStatementDeceased',
                'intestacyDeceasedMaritalStatus',
                'intestacyDeceasedChildren',
                'intestacyDeceasedEstateOutside',
                'intestacyDeceasedEstateLand',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsAdopted',
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
                'intestacyLettersOfAdministration',
                'deceasedEstateValueExceptedEstateConfirmation'
            ];
            const executor = {
                fullName: 'Fred Jones',
                isDead: false,
                isApplying: false,
                notApplyingKey: 'optionRenunciated'
            };
            sessionData.will.codicils = 'optionYes';
            sessionData.will.codicilsNumber = 1;
            contentData.codicilsNumber = '';
            contentData.codicils = 'codicil';
            contentData.otherExecutorName = executor.fullName;
            contentData.otherExecutorApplying = content.optionRenunciated.replace('{deceasedName}', sessionData.deceased.deceasedName);
            sessionData.executors.list.push(executor);

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page, applicant has an alias, deceased has no other names and there are codicils', (done) => {
            const contentToExclude = [
                'deceasedOtherNames',
                'executorApplyingName',
                'executorNotApplyingHeader',
                'executorNotApplyingReason',
                'executorNotApplyingReason-codicils',
                'optionDiedBefore',
                'optionDiedAfter',
                'optionPowerReserved',
                'optionRenunciated',
                'optionMarried',
                'optionDivorced',
                'optionWidowed',
                'optionNotMarried',
                'optionSeparated',
                'additionalExecutorNotified',
                'intro-multipleApplicants',
                'legalStatementApplicant-multipleApplicants',
                'deceasedEstateLand-multipleApplicants',
                'applicantName',
                'applicantName-alias',
                'applicantName-multipleApplicants',
                'applicantName-multipleApplicants-alias',
                'applicantName-multipleApplicants-codicils',
                'applicantName-multipleApplicants-alias-codicils',
                'applicantName-multipleApplicants-mainApplicant',
                'applicantName-multipleApplicants-mainApplicant-alias',
                'applicantName-multipleApplicants-mainApplicant-codicils',
                'applicantName-multipleApplicants-mainApplicant-alias-codicils',
                'applicantSend',
                'applicantSend-multipleApplicants',
                'applicantSend-multipleApplicants-codicils',
                'applicantSend-multipleApplicants-mainApplicant',
                'applicantSend-multipleApplicants-mainApplicant-codicils',
                'declarationConfirm-multipleApplicants',
                'declarationRequests-multipleApplicants',
                'declarationUnderstand-multipleApplicants',
                'declarationUnderstandItem1-multipleApplicants',
                'declarationUnderstandItem2-multipleApplicants',
                'submitWarning-multipleApplicants',
                'applicantName-codicils',
                'codicil',
                'codicils',
                'intestacyHeader',
                'declarationConfirmItem3-intestacy',
                'declarationRequestsItem1-intestacy',
                'declarationRequestsItem2-intestacy',
                'declarationUnderstandItem1-intestacy',
                'intestacyLegalStatementDeceased',
                'intestacyDeceasedMaritalStatus',
                'intestacyDeceasedChildren',
                'intestacyDeceasedEstateOutside',
                'intestacyDeceasedEstateLand',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsAdopted',
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
                'intestacyLettersOfAdministration',
                'deceasedEstateValueExceptedEstateConfirmation'
            ];
            sessionData.will.codicils = 'optionYes';
            sessionData.will.codicilsNumber = 4;
            sessionData.applicant.nameAsOnTheWill = 'optionNo';
            sessionData.applicant.alias = 'Robert Bruce';
            sessionData.applicant.aliasReason = 'optionOther';
            sessionData.applicant.otherReason = 'Legal Name Change';
            sessionData.executors.list[0].alias = 'Robert Bruce';
            sessionData.executors.list[0].aliasReason = 'optionOther';
            sessionData.executors.list[0].otherReason = 'Legal Name Change';

            contentData.codicilsNumber = 4;
            contentData.codicils = 'codicils';
            contentData.applicantWillName = 'Robert Bruce';
            contentData.applicantCurrentNameSign = 'Robert Bruce';
            contentData.applicantCurrentName = 'Bob Smith';
            contentData.aliasReason = ': legal name change';

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page, applicant has an alias, deceased has no other names and there are no codicils', (done) => {
            const contentToExclude = [
                'deceasedOtherNames',
                'executorApplyingName',
                'executorNotApplyingHeader',
                'executorNotApplyingReason',
                'executorNotApplyingReason-codicils',
                'optionDiedBefore',
                'optionDiedAfter',
                'optionPowerReserved',
                'optionRenunciated',
                'optionMarried',
                'optionDivorced',
                'optionWidowed',
                'optionNotMarried',
                'optionSeparated',
                'additionalExecutorNotified',
                'intro-multipleApplicants',
                'legalStatementApplicant-multipleApplicants',
                'deceasedEstateLand-multipleApplicants',
                'applicantName-codicils',
                'applicantName-multipleApplicants',
                'applicantName-multipleApplicants-alias',
                'applicantName-multipleApplicants-codicils',
                'applicantName-multipleApplicants-alias-codicils',
                'applicantName-multipleApplicants-mainApplicant',
                'applicantName-multipleApplicants-mainApplicant-alias',
                'applicantName-multipleApplicants-mainApplicant-codicils',
                'applicantName-multipleApplicants-mainApplicant-alias-codicils',
                'applicantSend-codicils',
                'applicantSend-multipleApplicants',
                'applicantSend-multipleApplicants-codicils',
                'applicantSend-multipleApplicants-mainApplicant',
                'applicantSend-multipleApplicants-mainApplicant-codicils',
                'declarationConfirm-multipleApplicants',
                'declarationRequests-multipleApplicants',
                'declarationUnderstand-multipleApplicants',
                'declarationUnderstandItem1-multipleApplicants',
                'declarationUnderstandItem2-multipleApplicants',
                'submitWarning-multipleApplicants',
                'applicantName',
                'applicantName-alias-codicils',
                'codicil',
                'codicils',
                'intestacyHeader',
                'declarationConfirmItem3-intestacy',
                'declarationRequestsItem1-intestacy',
                'declarationRequestsItem2-intestacy',
                'declarationUnderstandItem1-intestacy',
                'intestacyLegalStatementDeceased',
                'intestacyDeceasedMaritalStatus',
                'intestacyDeceasedChildren',
                'intestacyDeceasedEstateOutside',
                'intestacyDeceasedEstateLand',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsAdopted',
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
                'intestacyLettersOfAdministration',
                'deceasedEstateValueExceptedEstateConfirmation'
            ];
            sessionData.will.codicils = 'optionNo';
            sessionData.applicant.nameAsOnTheWill = 'optionNo';
            sessionData.applicant.alias = 'Robert Bruce';
            sessionData.applicant.aliasReason = 'optionOther';
            sessionData.applicant.otherReason = 'Legal Name Change';
            sessionData.executors.list[0].alias = 'Robert Bruce';
            sessionData.executors.list[0].aliasReason = 'optionOther';
            sessionData.executors.list[0].otherReason = 'Legal Name Change';

            contentData.applicantWillName = 'Robert Bruce';
            contentData.applicantCurrentNameSign = 'Robert Bruce';
            contentData.applicantCurrentName = 'Bob Smith';
            contentData.aliasReason = ': legal name change';

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page, applicant has an alias, deceased has one other names and there are codicils', (done) => {
            const contentToExclude = [
                'deceasedOtherNames',
                'executorApplyingName',
                'executorNotApplyingHeader',
                'executorNotApplyingReason',
                'executorNotApplyingReason-codicils',
                'optionDiedBefore',
                'optionDiedAfter',
                'optionPowerReserved',
                'optionRenunciated',
                'optionMarried',
                'optionDivorced',
                'optionWidowed',
                'optionNotMarried',
                'optionSeparated',
                'additionalExecutorNotified',
                'intro-multipleApplicants',
                'legalStatementApplicant-multipleApplicants',
                'deceasedEstateLand-multipleApplicants',
                'applicantName',
                'applicantName-multipleApplicants',
                'applicantName-multipleApplicants-alias',
                'applicantName-multipleApplicants-codicils',
                'applicantName-multipleApplicants-alias-codicils',
                'applicantName-multipleApplicants-mainApplicant',
                'applicantName-multipleApplicants-mainApplicant-alias',
                'applicantName-multipleApplicants-mainApplicant-codicils',
                'applicantName-multipleApplicants-mainApplicant-alias-codicils',
                'applicantSend',
                'applicantSend-multipleApplicants',
                'applicantSend-multipleApplicants-codicils',
                'applicantSend-multipleApplicants-mainApplicant',
                'applicantSend-multipleApplicants-mainApplicant-codicils',
                'declarationConfirm-multipleApplicants',
                'declarationRequests-multipleApplicants',
                'declarationUnderstand-multipleApplicants',
                'declarationUnderstandItem1-multipleApplicants',
                'declarationUnderstandItem2-multipleApplicants',
                'submitWarning-multipleApplicants',
                'applicantName-alias',
                'applicantName-codicils',
                'codicil',
                'codicils',
                'intestacyHeader',
                'declarationConfirmItem3-intestacy',
                'declarationRequestsItem1-intestacy',
                'declarationRequestsItem2-intestacy',
                'declarationUnderstandItem1-intestacy',
                'intestacyLegalStatementDeceased',
                'intestacyDeceasedMaritalStatus',
                'intestacyDeceasedChildren',
                'intestacyDeceasedEstateOutside',
                'intestacyDeceasedEstateLand',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsAdopted',
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
                'intestacyLettersOfAdministration',
                'deceasedEstateValueExceptedEstateConfirmation'
            ];
            sessionData.will.codicils = 'optionYes';
            sessionData.will.codicilsNumber = 1;
            sessionData.applicant.nameAsOnTheWill = 'optionNo';
            sessionData.applicant.alias = 'Robert Bruce';
            sessionData.applicant.aliasReason = 'optionOther';
            sessionData.applicant.otherReason = 'Legal Name Change';
            sessionData.executors.list[0].alias = 'Robert Bruce';
            sessionData.executors.list[0].aliasReason = 'optionOther';
            sessionData.executors.list[0].otherReason = 'Legal Name Change';
            sessionData.deceased.otherNames = {
                name_0: {
                    firstName: 'James',
                    lastName: 'Miller'
                }
            };
            contentData.codicilsNumber = '';
            contentData.codicils = 'codicil';
            contentData.applicantWillName = 'Robert Bruce';
            contentData.applicantCurrentNameSign = 'Robert Bruce';
            contentData.deceasedOtherNames = 'James Miller';
            contentData.applicantCurrentName = 'Bob Smith';
            contentData.aliasReason = ': legal name change';

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page, applicant has an alias, deceased has one other names and there are no codicils', (done) => {
            const contentToExclude = [
                'deceasedOtherNames',
                'executorApplyingName',
                'executorNotApplyingHeader',
                'executorNotApplyingReason',
                'executorNotApplyingReason-codicils',
                'optionDiedBefore',
                'optionDiedAfter',
                'optionPowerReserved',
                'optionRenunciated',
                'optionMarried',
                'optionDivorced',
                'optionWidowed',
                'optionNotMarried',
                'optionSeparated',
                'additionalExecutorNotified',
                'intro-multipleApplicants',
                'legalStatementApplicant-multipleApplicants',
                'deceasedEstateLand-multipleApplicants',
                'applicantName',
                'applicantName-codicils',
                'applicantName-multipleApplicants',
                'applicantName-multipleApplicants-alias',
                'applicantName-multipleApplicants-codicils',
                'applicantName-multipleApplicants-alias-codicils',
                'applicantName-multipleApplicants-mainApplicant',
                'applicantName-multipleApplicants-mainApplicant-alias',
                'applicantName-multipleApplicants-mainApplicant-codicils',
                'applicantName-multipleApplicants-mainApplicant-alias-codicils',
                'applicantSend-codicils',
                'applicantSend-multipleApplicants',
                'applicantSend-multipleApplicants-codicils',
                'applicantSend-multipleApplicants-mainApplicant',
                'applicantSend-multipleApplicants-mainApplicant-codicils',
                'declarationConfirm-multipleApplicants',
                'declarationRequests-multipleApplicants',
                'declarationUnderstand-multipleApplicants',
                'declarationUnderstandItem1-multipleApplicants',
                'declarationUnderstandItem2-multipleApplicants',
                'submitWarning-multipleApplicants',
                'applicantName-alias-codicils',
                'codicil',
                'codicils',
                'intestacyHeader',
                'declarationConfirmItem3-intestacy',
                'declarationRequestsItem1-intestacy',
                'declarationRequestsItem2-intestacy',
                'declarationUnderstandItem1-intestacy',
                'intestacyLegalStatementDeceased',
                'intestacyDeceasedMaritalStatus',
                'intestacyDeceasedChildren',
                'intestacyDeceasedEstateOutside',
                'intestacyDeceasedEstateLand',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsNotAdopted',
                'intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsAdopted',
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
                'intestacyLettersOfAdministration',
                'deceasedEstateValueExceptedEstateConfirmation'
            ];
            sessionData.will.codicils = 'optionNo';
            sessionData.applicant.nameAsOnTheWill = 'optionNo';
            sessionData.applicant.alias = 'Robert Bruce';
            sessionData.applicant.aliasReason = 'optionOther';
            sessionData.applicant.otherReason = 'Legal Name Change';
            sessionData.executors.list[0].alias = 'Robert Bruce';
            sessionData.executors.list[0].aliasReason = 'optionOther';
            sessionData.executors.list[0].otherReason = 'Legal Name Change';
            sessionData.deceased.otherNames = {
                name_0: {
                    firstName: 'James',
                    lastName: 'Miller'
                }
            };
            contentData.applicantWillName = 'Robert Bruce';
            contentData.applicantCurrentNameSign = 'Robert Bruce';
            contentData.deceasedOtherNames = 'James Miller';
            contentData.applicantCurrentName = 'Bob Smith';
            contentData.aliasReason = ': legal name change';

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
            };

            testWrapper.agent.post('/prepare-session-field/serviceAuthorization/SERVICE_AUTH_123')
                .end(() => {
                    testWrapper.agent.post('/prepare-session/form')
                        .send(sessionData)
                        .end(() => {
                            const data = {
                                declarationCheckbox: 'true'
                            };
                            testWrapper.testRedirect(done, data, expectedNextUrlForExecInvite);
                        });
                });
        });
    });
});
