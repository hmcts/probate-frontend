// eslint-disable-line max-lines

'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ExecutorsInvite = require('app/steps/ui/executors/invite');
const ExecutorsUpdateInvite = require('app/steps/ui/executors/updateinvite');
const ExecutorsAdditionalInvite = require('app/steps/ui/executors/additionalinvite');
const ExecutorsChangeMade = require('app/steps/ui/executors/changemade');
const Tasklist = require('app/steps/ui/tasklist');
const testCommonContent = require('test/component/common/testCommonContent.js');
const {assert} = require('chai');
const nock = require('nock');
const config = require('config');

describe('declaration, multiple applicants', () => {
    let testWrapper, contentData, sessionData;
    const expectedNextUrlForExecInvite = ExecutorsInvite.getUrl();
    const expectedNextUrlForExecChangeMade = ExecutorsChangeMade.getUrl();
    const expectedNextUrlForChangeToSingleApplicant = Tasklist.getUrl();
    const expectedNextUrlForUpdateExecInvite = ExecutorsUpdateInvite.getUrl();
    const expectedNextUrlForAdditionalExecInvite = ExecutorsAdditionalInvite.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('Declaration');

        sessionData = require('test/data/complete-form-undeclared').formdata;
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
            ihtNetValue: sessionData.iht.netValueField,
            detailsOfApplicants: 'Bob Smith of flat 1, somewhere rd, nowhere., fname1other sname1other of 1 qwe\r\n1 asd\r\n1 zxc and fname4 sname4 of 4 qwe\r\n4 asd\r\n4 zxc',
            applicantCurrentName: 'fname1other sname1other',
            applicantCurrentNameSign: 'fname1other sname1other',
            applicantNameOnWill: ' as fname1 sname1'
        };

        sessionData.executors.list = [
            {firstName: 'Bob', lastName: 'Smith', isApplying: true, isApplicant: true},
            {fullName: 'fname1 sname1', isDead: false, isApplying: true, hasOtherName: true, currentName: 'fname1other sname1other', email: 'fname1@example.com', mobile: '07900123456', address: {formattedAddress: '1 qwe\r\n1 asd\r\n1 zxc'}, addressFlag: true},
            {fullName: 'fname4 sname4', isDead: false, isApplying: true, hasOtherName: false, email: 'fname4@example.com', mobile: '07900123457', address: {formattedAddress: '4 qwe\r\n4 asd\r\n4 zxc'}, addressFlag: true}
        ];

        nock(config.services.idam.s2s_url)
            .post('/lease')
            .reply(
                200,
                'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJSRUZFUkVOQ0UifQ.Z_YYn0go02ApdSMfbehsLXXbxJxLugPG8v_3kt' +
                'CpQurK8tHkOy1qGyTo02bTdilX4fq4M5glFh80edDuhDJXPA'
            );

        nock(config.services.orchestrator.url)
            .post(uri => uri.includes('forms'))
            .reply(200, {});

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

        it('test right content loaded on the page with multiple applicants, deceased has three other names, no codicils', (done) => {
            const contentToExclude = [
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
                'intro',
                'legalStatementApplicant',
                'deceasedEstateLand',
                'applicantName',
                'applicantName-codicils',
                'applicantName-multipleApplicants-codicils',
                'applicantName-multipleApplicants-mainApplicant-alias',
                'applicantName-multipleApplicants-mainApplicant-alias-codicils',
                'applicantName-multipleApplicants-mainApplicant-codicils',
                'applicantName-multipleApplicants-alias',
                'applicantName-multipleApplicants-alias-codicils',
                'applicantSend',
                'applicantSend-codicils',
                'applicantSend-multipleApplicants-mainApplicant-codicils',
                'declarationConfirm',
                'declarationRequests',
                'declarationUnderstand',
                'declarationUnderstandItem1',
                'declarationUnderstandItem2',
                'submitWarning',
                'applicantName-alias',
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
            sessionData.executors.list[1].hasOtherName = false;
            delete sessionData.executors.list[1].currentName;
            sessionData.deceased.otherNames = {
                name_0: {firstName: 'James', lastName: 'Miller'},
                name_1: {firstName: 'Joe', lastName: 'Smith'},
                name_2: {firstName: 'Ed', lastName: 'Brown'}
            };
            contentData.applicantWillName = 'Bob Smith';
            contentData.deceasedOtherNames = 'James Miller, Joe Smith and Ed Brown';
            contentData.detailsOfApplicants = 'Bob Smith of flat 1, somewhere rd, nowhere., fname1 sname1 of 1 qwe\r\n1 asd\r\n1 zxc and fname4 sname4 of 4 qwe\r\n4 asd\r\n4 zxc';
            contentData.applicantCurrentName = 'fname1 sname1';
            contentData.applicantNameOnWill = '';
            contentData.applicantCurrentNameSign = 'fname1 sname1';

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page with multiple applicants, deceased has no other names and there are codicils', (done) => {
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
                'intro',
                'legalStatementApplicant',
                'deceasedEstateLand',
                'applicantName',
                'applicantName-codicils',
                'applicantName-multipleApplicants',
                'applicantName-multipleApplicants-mainApplicant-alias',
                'applicantName-multipleApplicants-mainApplicant-alias-codicils',
                'applicantName-multipleApplicants-mainApplicant',
                'applicantName-multipleApplicants-alias',
                'applicantName-multipleApplicants-alias-codicils',
                'applicantSend',
                'applicantSend-codicils',
                'applicantSend-multipleApplicants-mainApplicant',
                'declarationConfirm',
                'declarationRequests',
                'declarationUnderstand',
                'declarationUnderstandItem1',
                'declarationUnderstandItem2',
                'submitWarning',
                'applicantName-alias',
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
            sessionData.will.codicils = 'optionYes';
            sessionData.will.codicilsNumber = 3;
            sessionData.executors.list[1].hasOtherName = false;
            delete sessionData.executors.list[1].currentName;
            contentData.codicilsNumber = 3;
            contentData.codicils = 'codicils';
            contentData.applicantWillName = 'Bob Smith';
            contentData.detailsOfApplicants = 'Bob Smith of flat 1, somewhere rd, nowhere., fname1 sname1 of 1 qwe\r\n1 asd\r\n1 zxc and fname4 sname4 of 4 qwe\r\n4 asd\r\n4 zxc';
            contentData.applicantCurrentName = 'fname1 sname1';
            contentData.applicantNameOnWill = '';
            contentData.applicantCurrentNameSign = 'fname1 sname1';

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page, applicant has an alias, no executors have a different name, deceased has no other names and there are codicils', (done) => {
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
                'intro',
                'legalStatementApplicant',
                'deceasedEstateLand',
                'applicantName',
                'applicantName-codicils',
                'applicantName-multipleApplicants',
                'applicantName-multipleApplicants-mainApplicant-alias',
                'applicantName-multipleApplicants-mainApplicant-codicils',
                'applicantName-multipleApplicants-mainApplicant',
                'applicantName-multipleApplicants-alias',
                'applicantName-multipleApplicants-codicils',
                'applicantName-multipleApplicants-alias-codicils',
                'applicantSend',
                'applicantSend-codicils',
                'applicantSend-multipleApplicants-mainApplicant',
                'declarationConfirm',
                'declarationRequests',
                'declarationUnderstand',
                'declarationUnderstandItem1',
                'declarationUnderstandItem2',
                'submitWarning',
                'applicantName-alias',
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
            sessionData.will.codicils = 'optionYes';
            sessionData.will.codicilsNumber = 1;
            sessionData.executors.list[0].alias = 'larry bird';
            sessionData.executors.list[0].aliasReason = 'optionDivorce';
            sessionData.executors.list[0].nameAsOnTheWill = 'optionNo';
            sessionData.executors.list[1].hasOtherName = false;
            delete sessionData.executors.list[1].currentName;

            contentData.codicilsNumber = '';
            contentData.codicils = 'codicil';
            contentData.applicantCurrentNameSign = 'fname1 sname1';
            contentData.applicantCurrentName = 'Bob Smith';
            contentData.applicantWillName = 'larry bird';
            contentData.aliasReason = ' got divorced';
            contentData.detailsOfApplicants = 'Bob Smith of flat 1, somewhere rd, nowhere., fname1 sname1 of 1 qwe\r\n1 asd\r\n1 zxc and fname4 sname4 of 4 qwe\r\n4 asd\r\n4 zxc';

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page, applicant has an alias, no executors have a different name, deceased has no other names and there are no codicils', (done) => {
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
                'intro',
                'legalStatementApplicant',
                'deceasedEstateLand',
                'applicantName',
                'applicantName-codicils',
                'applicantName-multipleApplicants',
                'applicantName-multipleApplicants-mainApplicant-codicils',
                'applicantName-multipleApplicants-mainApplicant-alias-codicils',
                'applicantName-multipleApplicants-mainApplicant',
                'applicantName-multipleApplicants-alias',
                'applicantName-multipleApplicants-codicils',
                'applicantName-multipleApplicants-alias-codicils',
                'applicantSend',
                'applicantSend-codicils',
                'applicantSend-multipleApplicants-mainApplicant-codicils',
                'declarationConfirm',
                'declarationRequests',
                'declarationUnderstand',
                'declarationUnderstandItem1',
                'declarationUnderstandItem2',
                'submitWarning',
                'applicantName-alias',
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
            sessionData.will.codicils = 'optiono';
            sessionData.executors.list[0].alias = 'larry bird';
            sessionData.executors.list[0].aliasReason = 'optionDivorce';
            sessionData.executors.list[0].nameAsOnTheWill = 'optionNo';
            sessionData.executors.list[1].hasOtherName = false;
            delete sessionData.executors.list[1].currentName;

            contentData.applicantCurrentNameSign = 'fname1 sname1';
            contentData.applicantCurrentName = 'Bob Smith';
            contentData.applicantWillName = 'larry bird';
            contentData.aliasReason = ' got divorced';
            contentData.detailsOfApplicants = 'Bob Smith of flat 1, somewhere rd, nowhere., fname1 sname1 of 1 qwe\r\n1 asd\r\n1 zxc and fname4 sname4 of 4 qwe\r\n4 asd\r\n4 zxc';

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page, applicant has an alias, one other executor has a different name (reason given as: Divorce), deceased has no other names and there are codicils', (done) => {
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
                'intro',
                'legalStatementApplicant',
                'deceasedEstateLand',
                'applicantName',
                'applicantName-codicils',
                'applicantName-multipleApplicants',
                'applicantName-multipleApplicants-alias',
                'applicantName-multipleApplicants-mainApplicant',
                'applicantName-multipleApplicants-mainApplicant-alias',
                'applicantName-multipleApplicants-mainApplicant-codicils',
                'applicantSend',
                'applicantSend-codicils',
                'applicantSend-multipleApplicants-mainApplicant',
                'declarationConfirm',
                'declarationRequests',
                'declarationUnderstand',
                'declarationUnderstandItem1',
                'declarationUnderstandItem2',
                'submitWarning',
                'applicantName-alias',
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
            sessionData.will.codicils = 'optionYes';
            sessionData.will.codicilsNumber = 2;
            sessionData.executors.list[0].alias = 'larry bird';
            sessionData.executors.list[0].aliasReason = 'optionDivorce';
            sessionData.executors.list[0].nameAsOnTheWill = 'optionNo';
            sessionData.executors.list[1].currentNameReason = 'optionDivorce';
            contentData.codicilsNumber = 2;
            contentData.codicils = 'codicils';
            contentData.aliasReason = ' got divorced';
            contentData.applicantWillName = 'fname1 sname1';

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page, applicant has an alias, two other executors have a different name (reason given as: Deed Poll and other), deceased has no other names and there are codicils', (done) => {
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
                'intro',
                'legalStatementApplicant',
                'deceasedEstateLand',
                'applicantName',
                'applicantName-codicils',
                'applicantName-multipleApplicants',
                'applicantName-multipleApplicants-mainApplicant-codicils',
                'applicantName-multipleApplicants-mainApplicant-alias',
                'applicantName-multipleApplicants-mainApplicant',
                'applicantName-multipleApplicants-codicils',
                'applicantName-multipleApplicants-alias',
                'applicantSend',
                'applicantSend-codicils',
                'applicantSend-multipleApplicants-mainApplicant',
                'declarationConfirm',
                'declarationRequests',
                'declarationUnderstand',
                'declarationUnderstandItem1',
                'declarationUnderstandItem2',
                'submitWarning',
                'applicantName-alias',
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
            sessionData.will.codicils = 'optionYes';
            sessionData.will.codicilsNumber = 1;
            sessionData.executors.list[0].alias = 'larry bird';
            sessionData.executors.list[0].aliasReason = 'optionDivorce';
            sessionData.executors.list[0].nameAsOnTheWill = 'optionNo';
            sessionData.executors.list[1].currentNameReason = 'optionDeedPoll';
            sessionData.executors.list[2].hasOtherName = true;
            sessionData.executors.list[2].currentName = 'fname4other sname4other';
            sessionData.executors.list[2].currentNameReason = 'optionOther';
            sessionData.executors.list[2].otherReason = 'because they wanted to';

            contentData.codicilsNumber = '';
            contentData.codicils = 'codicil';
            contentData.aliasReason = ' got divorced';
            contentData.applicantWillName = 'fname1 sname1';
            contentData.aliasReason = ' changed their name by deed poll';
            contentData.detailsOfApplicants = 'Bob Smith of flat 1, somewhere rd, nowhere., fname1other sname1other of 1 qwe\r\n1 asd\r\n1 zxc and fname4other sname4other of 4 qwe\r\n4 asd\r\n4 zxc';

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page, applicant has an alias, one other executor has a different name (reason given as: Marriage), deceased has no other names and there are no codicils', (done) => {
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
                'intro',
                'legalStatementApplicant',
                'deceasedEstateLand',
                'applicantName',
                'applicantName-codicils',
                'applicantName-multipleApplicants',
                'applicantName-multipleApplicants-mainApplicant-codicils',
                'applicantName-multipleApplicants-mainApplicant-alias-codicils',
                'applicantName-multipleApplicants-mainApplicant',
                'applicantName-multipleApplicants-codicils',
                'applicantName-multipleApplicants-alias-codicils',
                'applicantSend',
                'applicantSend-codicils',
                'applicantSend-multipleApplicants-mainApplicant-codicils',
                'declarationConfirm',
                'declarationRequests',
                'declarationUnderstand',
                'declarationUnderstandItem1',
                'declarationUnderstandItem2',
                'submitWarning',
                'applicantName-alias',
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
            sessionData.executors.list[0].alias = 'larry bird';
            sessionData.executors.list[0].aliasReason = 'optionDivorce';
            sessionData.executors.list[0].nameAsOnTheWill = 'optionNo';
            sessionData.executors.list[1].currentNameReason = 'optionMarriage';

            contentData.applicantWillName = 'fname1 sname1';
            contentData.applicantNameOnWill = ' as fname1 sname1';
            contentData.aliasReason = ' got married';
            contentData.detailsOfApplicants = 'Bob Smith of flat 1, somewhere rd, nowhere., fname1other sname1other of 1 qwe\r\n1 asd\r\n1 zxc and fname4 sname4 of 4 qwe\r\n4 asd\r\n4 zxc';

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page, applicant has an alias, two other executors have a different name (reason given as: Deed Poll and other), deceased has no other names and there are no codicils', (done) => {
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
                'intro',
                'legalStatementApplicant',
                'deceasedEstateLand',
                'applicantName',
                'applicantName-codicils',
                'applicantName-multipleApplicants',
                'applicantName-multipleApplicants-mainApplicant-codicils',
                'applicantName-multipleApplicants-mainApplicant-alias-codicils',
                'applicantName-multipleApplicants-mainApplicant',
                'applicantName-multipleApplicants-codicils',
                'applicantName-multipleApplicants-alias-codicils',
                'applicantSend',
                'applicantSend-codicils',
                'applicantSend-multipleApplicants-mainApplicant-codicils',
                'declarationConfirm',
                'declarationRequests',
                'declarationUnderstand',
                'declarationUnderstandItem1',
                'declarationUnderstandItem2',
                'submitWarning',
                'applicantName-alias',
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
            sessionData.executors.list[0].alias = 'larry bird';
            sessionData.executors.list[0].aliasReason = 'optionDivorce';
            sessionData.executors.list[0].nameAsOnTheWill = 'optionNo';
            sessionData.executors.list[1].currentNameReason = 'optionDeedPoll';
            sessionData.executors.list[2].hasOtherName = true;
            sessionData.executors.list[2].currentName = 'fname4other sname4other';
            sessionData.executors.list[2].currentNameReason = 'optionOther';
            sessionData.executors.list[2].otherReason = 'because they wanted to';

            contentData.aliasReason = ' changed their name by deed poll';
            contentData.applicantWillName = 'fname1 sname1';
            contentData.detailsOfApplicants = 'Bob Smith of flat 1, somewhere rd, nowhere., fname1other sname1other of 1 qwe\r\n1 asd\r\n1 zxc and fname4other sname4other of 4 qwe\r\n4 asd\r\n4 zxc';

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test correct executor content loaded on the page, applicant has an alias, no executors have a different name, deceased has no other names and there are codicils', (done) => {
            sessionData.will.codicils = 'optionYes';
            sessionData.will.codicilsNumber = 3;
            sessionData.executors.list[0].nameAsOnTheWill = 'optionNo';
            sessionData.executors.list[0].alias = 'Bob Alias';
            sessionData.executors.list[0].aliasReason = 'optionDivorce';
            sessionData.executors.list[1].hasOtherName = false;
            delete sessionData.executors.list[1].currentName;

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.agent.get(testWrapper.pageUrl)
                        .then(response => {
                            assert(response.text.includes('Bob Smith, an executor named in the will or codicils as Bob Alias, is applying for probate. Their name is different because Bob Smith got divorced.'));
                            assert(response.text.includes('Bob Smith will send to the probate registry what we have seen and believe to be the true and original last will and testament, and 3 codicils of Dee Ceased.'));
                            assert(response.text.includes('fname1 sname1, an executor named in the will or codicils, is applying for probate.'));
                            assert(response.text.includes('fname4 sname4, an executor named in the will or codicils, is applying for probate.'));
                            done();
                        })
                        .catch(err => {
                            done(err);
                        });
                });
        });

        it('test correct executor content loaded on the page, applicant has an alias, no executors have a different name, deceased has no other names and there are no codicils', (done) => {
            sessionData.will.codicils = 'optionNo';
            sessionData.executors.list[0].nameAsOnTheWill = 'optionNo';
            sessionData.executors.list[0].alias = 'Bob Alias';
            sessionData.executors.list[0].aliasReason = 'optionDivorce';
            sessionData.executors.list[1].hasOtherName = false;
            delete sessionData.executors.list[1].currentName;

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.agent.get(testWrapper.pageUrl)
                        .then(response => {
                            assert(response.text.includes('Bob Smith, an executor named in the will as Bob Alias, is applying for probate. Their name is different because Bob Smith got divorced.'));
                            assert(response.text.includes('Bob Smith will send to the probate registry what we have seen and believe to be the true and original last will and testament of Dee Ceased.'));
                            assert(response.text.includes('fname1 sname1, an executor named in the will, is applying for probate.'));
                            assert(response.text.includes('fname4 sname4, an executor named in the will, is applying for probate.'));
                            done();
                        })
                        .catch(err => {
                            done(err);
                        });
                });
        });

        it('test correct executor content loaded on the page, applicant has an alias, one other executor has a different name (reason given as: Divorce), deceased has no other names and there are codicils', (done) => {
            sessionData.will.codicils = 'optionYes';
            sessionData.will.codicilsNumber = 2;
            sessionData.executors.list[0].nameAsOnTheWill = 'optionNo';
            sessionData.executors.list[0].alias = 'Bob Alias';
            sessionData.executors.list[0].aliasReason = 'optionDivorce';
            sessionData.executors.list[1].currentNameReason = 'optionDivorce';

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.agent.get(testWrapper.pageUrl)
                        .then(response => {
                            assert(response.text.includes('Bob Smith, an executor named in the will or codicils as Bob Alias, is applying for probate. Their name is different because Bob Smith got divorced.'));
                            assert(response.text.includes('Bob Smith will send to the probate registry what we have seen and believe to be the true and original last will and testament, and 2 codicils of Dee Ceased.'));
                            assert(response.text.includes('fname1other sname1other, an executor named in the will or codicils as fname1 sname1, is applying for probate. Their name is different because fname1other sname1other got divorced.'));
                            assert(response.text.includes('fname4 sname4, an executor named in the will or codicils, is applying for probate.'));
                            done();
                        })
                        .catch(err => {
                            done(err);
                        });
                });
        });

        it('test correct executor content loaded on the page, applicant has an alias, two other executors have a different name (reason given as: Deed Poll and other), deceased has no other names and there are codicils', (done) => {
            sessionData.will.codicils = 'optionYes';
            sessionData.will.codicilsNumber = 1;
            sessionData.executors.list[0].nameAsOnTheWill = 'optionNo';
            sessionData.executors.list[0].alias = 'Bob Alias';
            sessionData.executors.list[0].aliasReason = 'optionDivorce';
            sessionData.executors.list[1].currentNameReason = 'optionDivorce';
            sessionData.executors.list[2].hasOtherName = true;
            sessionData.executors.list[2].currentName = 'dave buster';
            sessionData.executors.list[2].currentNameReason = 'optionOther';
            sessionData.executors.list[2].otherReason = 'they felt like it';

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.agent.get(testWrapper.pageUrl)
                        .then(response => {
                            assert(response.text.includes('Bob Smith, an executor named in the will or codicils as Bob Alias, is applying for probate. Their name is different because Bob Smith got divorced.'));
                            assert(response.text.includes('Bob Smith will send to the probate registry what we have seen and believe to be the true and original last will and testament, and  codicil of Dee Ceased.'));
                            assert(response.text.includes('fname1other sname1other, an executor named in the will or codicils as fname1 sname1, is applying for probate. Their name is different because fname1other sname1other got divorced.'));
                            assert(response.text.includes('dave buster, an executor named in the will or codicils as fname4 sname4, is applying for probate. Their name is different because dave buster: they felt like it.'));
                            done();
                        })
                        .catch(err => {
                            done(err);
                        });
                });
        });

        it('test correct executor content loaded on the page, applicant has an alias, one other executor has a different name (reason given as: Marriage), deceased has no other names and there are no codicils', (done) => {
            sessionData.will.codicils = 'optionNo';
            sessionData.executors.list[0].nameAsOnTheWill = 'optionNo';
            sessionData.executors.list[0].alias = 'Bob Alias';
            sessionData.executors.list[0].aliasReason = 'optionDivorce';
            sessionData.executors.list[1].currentNameReason = 'optionMarriage';

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.agent.get(testWrapper.pageUrl)
                        .then(response => {
                            assert(response.text.includes('Bob Smith, an executor named in the will as Bob Alias, is applying for probate. Their name is different because Bob Smith got divorced.'));
                            assert(response.text.includes('Bob Smith will send to the probate registry what we have seen and believe to be the true and original last will and testament of Dee Ceased.'));
                            assert(response.text.includes('fname1other sname1other, an executor named in the will as fname1 sname1, is applying for probate. Their name is different because fname1other sname1other got married.'));
                            assert(response.text.includes('fname4 sname4, an executor named in the will, is applying for probate.'));
                            done();
                        })
                        .catch(err => {
                            done(err);
                        });
                });
        });

        it('test correct executor content loaded on the page, applicant has an alias, two other executors have a different name (reason given as: Deed Poll and other), deceased has no other names and there are no codicils', (done) => {
            sessionData.will.codicils = 'optionNo';
            sessionData.executors.list[0].nameAsOnTheWill = 'optionNo';
            sessionData.executors.list[0].alias = 'Bob Alias';
            sessionData.executors.list[0].aliasReason = 'optionDivorce';
            sessionData.executors.list[1].currentNameReason = 'optionDivorce';
            sessionData.executors.list[2].hasOtherName = true;
            sessionData.executors.list[2].currentName = 'dave buster';
            sessionData.executors.list[2].currentNameReason = 'optionOther';
            sessionData.executors.list[2].otherReason = 'they felt like it';

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.agent.get(testWrapper.pageUrl)
                        .then(response => {
                            assert(response.text.includes('Bob Smith, an executor named in the will as Bob Alias, is applying for probate. Their name is different because Bob Smith got divorced.'));
                            assert(response.text.includes('Bob Smith will send to the probate registry what we have seen and believe to be the true and original last will and testament of Dee Ceased.'));
                            assert(response.text.includes('fname1other sname1other, an executor named in the will as fname1 sname1, is applying for probate. Their name is different because fname1other sname1other got divorced.'));
                            assert(response.text.includes('dave buster, an executor named in the will as fname4 sname4, is applying for probate. Their name is different because dave buster: they felt like it.'));
                            done();
                        })
                        .catch(err => {
                            done(err);
                        });
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
                        {firstName: 'Bob', lastName: 'Smith', isApplying: true, isApplicant: true},
                        {fullName: 'fname1 sname1', isDead: false, isApplying: true, hasOtherName: true, currentName: 'fname1other sname1other', email: 'fname1@example.com', mobile: '07900123456', address: '1 qwe\r\n1 asd\r\n1 zxc', addressFlag: true},
                        {fullName: 'fname4 sname4', isDead: false, isApplying: true, hasOtherName: false, email: 'fname4@example.com', mobile: '07900123457', address: '4 qwe\r\n4 asd\r\n4 zxc', addressFlag: true}
                    ]
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

        it(`test it redirects to next page when the applicant has made a change: ${expectedNextUrlForExecChangeMade}`, (done) => {
            sessionData = {
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
                declaration: {hasDataChanged: true},
                executors: {invitesSent: 'true'},
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
                            testWrapper.testRedirect(done, data, expectedNextUrlForExecChangeMade);
                        });
                });

        });

        it(`test it redirects to next page when executor has been added: ${expectedNextUrlForAdditionalExecInvite}`, (done) => {
            sessionData = {
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
                executors: {
                    list: [
                        {firstName: 'Bob', lastName: 'Smith', isApplying: true, isApplicant: true},
                        {fullName: 'fname1 sname1', isDead: false, isApplying: true, hasOtherName: true, currentName: 'fname1other sname1other', email: 'fname1@example.com', mobile: '07900123456', address: '1 qwe\r\n1 asd\r\n1 zxc', addressFlag: true},
                        {fullName: 'fname4 sname4', isDead: false, isApplying: true, hasOtherName: false, email: 'fname4@example.com', mobile: '07900123457', address: '4 qwe\r\n4 asd\r\n4 zxc', addressFlag: true, emailSent: false}
                    ],
                    invitesSent: 'true'
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
                            testWrapper.testRedirect(done, data, expectedNextUrlForAdditionalExecInvite);
                        });
                });
        });

        it(`test it redirects to next page when executor email has been changed: ${expectedNextUrlForUpdateExecInvite}`, (done) => {
            sessionData = {
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
                executors: {
                    list: [
                        {firstName: 'Bob', lastName: 'Smith', isApplying: true, isApplicant: true},
                        {fullName: 'fname1 sname1', isDead: false, isApplying: true, hasOtherName: true, currentName: 'fname1other sname1other', email: 'fname1@example.com', mobile: '07900123456', address: '1 qwe\r\n1 asd\r\n1 zxc', addressFlag: true, emailSent: true},
                        {fullName: 'fname4 sname4', isDead: false, isApplying: true, hasOtherName: false, email: 'fname4@example.com', mobile: '07900123457', address: '4 qwe\r\n4 asd\r\n4 zxc', addressFlag: true, emailChanged: true, emailSent: true}
                    ],
                    invitesSent: 'true'
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
                            testWrapper.testRedirect(done, data, expectedNextUrlForUpdateExecInvite);
                        });
                });
        });

        it(`test it redirects to next page when the applicant has changed to a single applicant: ${expectedNextUrlForChangeToSingleApplicant}`, (done) => {
            sessionData = {
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
                executors: {
                    list: [
                        {firstName: 'Bob', lastName: 'Smith', isApplying: true, isApplicant: true}
                    ]
                },
                declaration: {
                    hasDataChanged: true
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
                            testWrapper.testRedirect(done, data, expectedNextUrlForChangeToSingleApplicant);
                        });
                });
        });
    });
});
