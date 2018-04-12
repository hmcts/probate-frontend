const TestWrapper = require('test/util/TestWrapper'),
Taskist = require('app/steps/ui/tasklist/index'),
    declarationContent = require('app/resources/en/translation/declaration');

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
            applicantAddress: applicantData.address,
            deceasedName: `${deceasedData.firstName} ${deceasedData.lastName}`,
            deceasedAddress: deceasedData.address,
            deceasedDob: deceasedData.dob_formattedDate,
            deceasedDod: deceasedData.dod_formattedDate,
            ihtGrossValue: sessionData.iht.grossValue,
            ihtNetValue: sessionData.iht.netValue
        };
    });

    afterEach(() => {
        delete require.cache[require.resolve('test/data/complete-form-undeclared')];
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test right content loaded on the page when deceased has one other name, no codicils', (done) => {
            const contentToExclude = ['executorApplyingName-codicils', 'executorNotApplyingHeader', 'executorNotApplyingReason', 'executorNotApplyingReason-codicils', 'optionDiedBefore', 'optionDiedAfter', 'optionPowerReserved', 'optionRenunciated', 'additionalExecutorNotified', 'intro-multipleApplicants', 'legalStatementApplicant-multipleApplicants', 'deceasedEstateLand-multipleApplicants', 'applicantName-multipleApplicants', 'applicantName-multipleApplicants-codicils', 'applicantName-multipleApplicants-mainApplicant', 'applicantName-multipleApplicants-mainApplicant-codicils', 'applicantSign-multipleApplicants', 'applicantSign-multipleApplicants-mainApplicant', 'declarationConfirm-multipleApplicants', 'declarationRequests-multipleApplicants', 'declarationUnderstand-multipleApplicants', 'declarationUnderstandItem1-multipleApplicants', 'declarationUnderstandItem2-multipleApplicants', 'submitWarning-multipleApplicants', 'applicantName-codicils'];
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
                    testWrapper.testContent(done, contentToExclude, contentData);
                });
        });

        it('test right content loaded on the page when deceased has two other names, no codicils', (done) => {
            const contentToExclude = ['executorApplyingName-codicils', 'executorNotApplyingHeader', 'executorNotApplyingReason', 'executorNotApplyingReason-codicils', 'optionDiedBefore', 'optionDiedAfter', 'optionPowerReserved', 'optionRenunciated', 'additionalExecutorNotified', 'intro-multipleApplicants', 'legalStatementApplicant-multipleApplicants', 'deceasedEstateLand-multipleApplicants', 'applicantName-multipleApplicants', 'applicantName-multipleApplicants-codicils', 'applicantName-multipleApplicants-mainApplicant', 'applicantName-multipleApplicants-mainApplicant-codicils', 'applicantSign-multipleApplicants', 'applicantSign-multipleApplicants-mainApplicant', 'declarationConfirm-multipleApplicants', 'declarationRequests-multipleApplicants', 'declarationUnderstand-multipleApplicants', 'declarationUnderstandItem1-multipleApplicants', 'declarationUnderstandItem2-multipleApplicants', 'submitWarning-multipleApplicants', 'applicantName-codicils'];
            sessionData.deceased.otherNames = {
                name_0: {firstName: 'James', lastName: 'Miller'},
                name_1: {firstName: 'Joe', lastName: 'Smith'}
            };
            contentData.deceasedOtherNames = 'James Miller and Joe Smith';

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentToExclude, contentData);
                });
        });

        it('test right content loaded on the page when deceased has three other names, no codicils', (done) => {
            const contentToExclude = ['executorApplyingName-codicils', 'executorNotApplyingHeader', 'executorNotApplyingReason', 'executorNotApplyingReason-codicils', 'optionDiedBefore', 'optionDiedAfter', 'optionPowerReserved', 'optionRenunciated', 'additionalExecutorNotified', 'intro-multipleApplicants', 'legalStatementApplicant-multipleApplicants', 'deceasedEstateLand-multipleApplicants', 'applicantName-multipleApplicants', 'applicantName-multipleApplicants-codicils', 'applicantName-multipleApplicants-mainApplicant', 'applicantName-multipleApplicants-mainApplicant-codicils', 'applicantSign-multipleApplicants', 'applicantSign-multipleApplicants-mainApplicant', 'declarationConfirm-multipleApplicants', 'declarationRequests-multipleApplicants', 'declarationUnderstand-multipleApplicants', 'declarationUnderstandItem1-multipleApplicants', 'declarationUnderstandItem2-multipleApplicants', 'submitWarning-multipleApplicants', 'applicantName-codicils'];
            sessionData.deceased.otherNames = {
                name_0: {firstName: 'James', lastName: 'Miller'},
                name_1: {firstName: 'Joe', lastName: 'Smith'},
                name_2: {firstName: 'Ed', lastName: 'Brown'}
            };
            contentData.deceasedOtherNames = 'James Miller, Joe Smith and Ed Brown';

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentToExclude, contentData);
                });
        });

        it('test right content loaded on the page when deceased has no other names, no codicils', (done) => {
            const contentToExclude = ['deceasedOtherNames', 'executorApplyingName-codicils', 'executorNotApplyingHeader', 'executorNotApplyingReason', 'executorNotApplyingReason-codicils', 'optionDiedBefore', 'optionDiedAfter', 'optionPowerReserved', 'optionRenunciated', 'additionalExecutorNotified', 'intro-multipleApplicants', 'legalStatementApplicant-multipleApplicants', 'deceasedEstateLand-multipleApplicants', 'applicantName-multipleApplicants', 'applicantName-multipleApplicants-codicils', 'applicantName-multipleApplicants-mainApplicant', 'applicantName-multipleApplicants-mainApplicant-codicils', 'applicantSign-multipleApplicants', 'applicantSign-multipleApplicants-mainApplicant', 'declarationConfirm-multipleApplicants', 'declarationRequests-multipleApplicants', 'declarationUnderstand-multipleApplicants', 'declarationUnderstandItem1-multipleApplicants', 'declarationUnderstandItem2-multipleApplicants', 'submitWarning-multipleApplicants', 'applicantName-codicils'];
            delete contentData.deceasedOtherNames;

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentToExclude, contentData);
                });
        });

        it('test right content loaded on the page when deceased has no other names and there are codicils', (done) => {
            const contentToExclude = ['deceasedOtherNames', 'executorApplyingName', 'executorNotApplyingHeader', 'executorNotApplyingReason', 'executorNotApplyingReason-codicils', 'optionDiedBefore', 'optionDiedAfter', 'optionPowerReserved', 'optionRenunciated', 'additionalExecutorNotified', 'intro-multipleApplicants', 'legalStatementApplicant-multipleApplicants', 'deceasedEstateLand-multipleApplicants', 'applicantName-multipleApplicants', 'applicantName-multipleApplicants-codicils', 'applicantName-multipleApplicants-mainApplicant', 'applicantName-multipleApplicants-mainApplicant-codicils', 'applicantSign-multipleApplicants', 'applicantSign-multipleApplicants-mainApplicant', 'declarationConfirm-multipleApplicants', 'declarationRequests-multipleApplicants', 'declarationUnderstand-multipleApplicants', 'declarationUnderstandItem1-multipleApplicants', 'declarationUnderstandItem2-multipleApplicants', 'submitWarning-multipleApplicants', 'applicantName-codicils', 'applicantName'];
            sessionData.will.codicils = 'Yes';
            delete contentData.deceasedOtherNames;

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentToExclude, contentData);
                });
        });

        it('test right content loaded on the page when deceased has no other names, no codicils and multiple executors (optionPowerReserved and additionalExecutorNotified)', (done) => {
            const contentToExclude = ['executorApplyingName-codicils', 'deceasedOtherNames', 'executorApplyingName', 'executorNotApplyingReason-codicils', 'optionDiedBefore', 'optionDiedAfter', 'optionRenunciated', 'intro-multipleApplicants', 'legalStatementApplicant-multipleApplicants', 'deceasedEstateLand-multipleApplicants', 'applicantName-multipleApplicants', 'applicantName-multipleApplicants-codicils', 'applicantName-multipleApplicants-mainApplicant', 'applicantName-multipleApplicants-mainApplicant-codicils', 'applicantSign-multipleApplicants', 'applicantSign-multipleApplicants-mainApplicant', 'declarationConfirm-multipleApplicants', 'declarationRequests-multipleApplicants', 'declarationUnderstand-multipleApplicants', 'declarationUnderstandItem1-multipleApplicants', 'declarationUnderstandItem2-multipleApplicants', 'submitWarning-multipleApplicants', 'applicantName-codicils', 'applicantName'];
            const executor = {
                fullName: 'James Miller',
                isDead: false,
                isApplying: false,
                notApplyingKey: 'optionPowerReserved',
                executorNotified: 'Yes'
            };
            contentData.otherExecutorName = executor.fullName;
            contentData.otherExecutorApplying = declarationContent.optionPowerReserved;
            sessionData.executors.list.push(executor);

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentToExclude, contentData);
                });
        });

        it('test right content loaded on the page when deceased has no other names, there are codicils and multiple executors (optionDiedBefore)', (done) => {
            const contentToExclude = ['deceasedOtherNames', 'executorApplyingName', 'executorNotApplyingReason', 'optionDiedAfter', 'optionPowerReserved', 'optionRenunciated', 'additionalExecutorNotified', 'intro-multipleApplicants', 'legalStatementApplicant-multipleApplicants', 'deceasedEstateLand-multipleApplicants', 'applicantName-multipleApplicants', 'applicantName-multipleApplicants-codicils', 'applicantName-multipleApplicants-mainApplicant', 'applicantName-multipleApplicants-mainApplicant-codicils', 'applicantSign-multipleApplicants', 'applicantSign-multipleApplicants-mainApplicant', 'declarationConfirm-multipleApplicants', 'declarationRequests-multipleApplicants', 'declarationUnderstand-multipleApplicants', 'declarationUnderstandItem1-multipleApplicants', 'declarationUnderstandItem2-multipleApplicants', 'submitWarning-multipleApplicants', 'applicantName-codicils', 'applicantName'];
            const executor = {
                fullName: 'Joe Smith',
                isDead: true,
                diedBefore: 'Yes',
                notApplyingKey: 'optionDiedBefore'
            };
            sessionData.will.codicils = 'Yes';
            contentData.otherExecutorName = executor.fullName;
            contentData.otherExecutorApplying = declarationContent.optionDiedBefore.replace('{deceasedName}', sessionData.deceased.deceasedName);
            sessionData.executors.list.push(executor);

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentToExclude, contentData);
                });
        });

        it('test right content loaded on the page when deceased has no other names, there are codicils and multiple executors (optionDiedAfter)', (done) => {
            const contentToExclude = ['deceasedOtherNames', 'executorApplyingName', 'executorNotApplyingReason', 'optionDiedBefore', 'optionPowerReserved', 'optionRenunciated', 'additionalExecutorNotified', 'intro-multipleApplicants', 'legalStatementApplicant-multipleApplicants', 'deceasedEstateLand-multipleApplicants', 'applicantName-multipleApplicants', 'applicantName-multipleApplicants-codicils', 'applicantName-multipleApplicants-mainApplicant', 'applicantName-multipleApplicants-mainApplicant-codicils', 'applicantSign-multipleApplicants', 'applicantSign-multipleApplicants-mainApplicant', 'declarationConfirm-multipleApplicants', 'declarationRequests-multipleApplicants', 'declarationUnderstand-multipleApplicants', 'declarationUnderstandItem1-multipleApplicants', 'declarationUnderstandItem2-multipleApplicants', 'submitWarning-multipleApplicants', 'applicantName-codicils', 'applicantName'];
            const executor = {
                fullName: 'Ed Brown',
                isDead: true,
                diedBefore: 'No',
                notApplyingKey: 'optionDiedAfter'
            };
            sessionData.will.codicils = 'Yes';
            contentData.otherExecutorName = executor.fullName;
            contentData.otherExecutorApplying = declarationContent.optionDiedAfter.replace('{deceasedName}', sessionData.deceased.deceasedName);
            sessionData.executors.list.push(executor);

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentToExclude, contentData);
                });
        });

        it('test right content loaded on the page when deceased has no other names, there are codicils and multiple executors (optionRenunciated)', (done) => {
            const contentToExclude = ['deceasedOtherNames', 'executorApplyingName', 'executorNotApplyingReason', 'optionDiedBefore', 'optionDiedAfter', 'optionPowerReserved', 'additionalExecutorNotified', 'intro-multipleApplicants', 'legalStatementApplicant-multipleApplicants', 'deceasedEstateLand-multipleApplicants', 'applicantName-multipleApplicants', 'applicantName-multipleApplicants-codicils', 'applicantName-multipleApplicants-mainApplicant', 'applicantName-multipleApplicants-mainApplicant-codicils', 'applicantSign-multipleApplicants', 'applicantSign-multipleApplicants-mainApplicant', 'declarationConfirm-multipleApplicants', 'declarationRequests-multipleApplicants', 'declarationUnderstand-multipleApplicants', 'declarationUnderstandItem1-multipleApplicants', 'declarationUnderstandItem2-multipleApplicants', 'submitWarning-multipleApplicants', 'applicantName-codicils', 'applicantName'];
            const executor = {
                fullName: 'Fred Jones',
                isDead: false,
                isApplying: false,
                notApplyingKey: 'optionRenunciated'
            };
            sessionData.will.codicils = 'Yes';
            contentData.otherExecutorName = executor.fullName;
            contentData.otherExecutorApplying = declarationContent.optionRenunciated.replace('{deceasedName}', sessionData.deceased.deceasedName);
            sessionData.executors.list.push(executor);

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentToExclude, contentData);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {};
            testWrapper.testErrors(done, data, 'required', [
                'declarationCheckbox'
            ]);
        });

        it(`test it redirects to next page: ${expectedNextUrlForExecInvite}`, (done) => {
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
