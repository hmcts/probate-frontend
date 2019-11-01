'use strict';

const TestWrapper = require('test/util/TestWrapper');
const applicantNameContent = require('app/resources/en/translation/applicant/name');
const applicantPhoneContent = require('app/resources/en/translation/applicant/phone');
const applicantAddressContent = require('app/resources/en/translation/applicant/address');
const applicantAliasContent = require('app/resources/en/translation/applicant/alias');
const applicantAliasReasonContent = require('app/resources/en/translation/applicant/aliasreason');
const applicantNameAsOnWillContent = require('app/resources/en/translation/applicant/nameasonwill');
const executorsAllAliveContent = require('app/resources/en/translation/executors/allalive');
const FormatName = require('app/utils/FormatName');

describe('summary-executor-section', () => {
    let testWrapper, sessionData;

    beforeEach(() => {
        testWrapper = new TestWrapper('Summary');
        sessionData = require('test/data/summary-executors');
        sessionData.ccdCase = {
            state: 'Pending',
            id: 1234567890123456
        };
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    after(() => {
        delete require.cache[require.resolve('app/resources/en/translation/applicant/name')];
        delete require.cache[require.resolve('app/resources/en/translation/applicant/phone')];
        delete require.cache[require.resolve('app/resources/en/translation/applicant/address')];
        delete require.cache[require.resolve('app/resources/en/translation/applicant/alias')];
        delete require.cache[require.resolve('app/resources/en/translation/applicant/aliasreason')];
        delete require.cache[require.resolve('app/resources/en/translation/executors/allalive')];
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test correct content loaded on the summary page executors section, when no data is entered', (done) => {
            const sessionData = {
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const playbackData = {
                        firstName: applicantNameContent.firstName,
                        lastName: applicantNameContent.lastName,
                        phoneNumber: applicantPhoneContent.phoneNumber,
                        applicantAddress: applicantAddressContent.question,
                        applicantNameAsOnWill: applicantNameAsOnWillContent.questionWithoutName
                    };

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

        it('test correct content loaded on the summary page executors section, when section is complete', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    const playbackData = {
                        firstName: applicantNameContent.firstName,
                        lastName: applicantNameContent.lastName,
                        phoneNumber: applicantPhoneContent.phoneNumber,
                        applicantAddress: applicantAddressContent.question,
                        applicantNameAsOnWill: applicantNameAsOnWillContent.question.replace('{applicantName}', FormatName.format(sessionData.applicant))
                    };

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

        it('test correct content loaded on the summary page executors section including applicant alias (Option Divorce selected), when section is complete', (done) => {
            sessionData.applicant.nameAsOnTheWill = 'No';
            sessionData.applicant.alias = 'Dave Buster';
            sessionData.applicant.aliasReason = 'Divorce';
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    const playbackData = {
                        firstName: applicantNameContent.firstName,
                        lastName: applicantNameContent.lastName,
                        alias: applicantAliasContent.nameOnWill,
                        aliasReason: applicantAliasReasonContent.optionOtherHint,
                        phoneNumber: applicantPhoneContent.phoneNumber,
                        applicantAddress: applicantAddressContent.question,
                        applicantNameAsOnWill: applicantNameAsOnWillContent.question.replace('{applicantName}', FormatName.format(sessionData.applicant))
                    };

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

        it('test correct content loaded on the summary page executors section including applicant alias (Option Other selected), when section is complete', (done) => {
            sessionData.applicant.nameAsOnTheWill = 'No';
            sessionData.applicant.alias = 'Dave Buster';
            sessionData.applicant.aliasReason = 'other';
            sessionData.applicant.otherReason = 'Because';
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    const playbackData = {
                        firstName: applicantNameContent.firstName,
                        lastName: applicantNameContent.lastName,
                        alias: applicantAliasContent.nameOnWill,
                        aliasReason: applicantAliasReasonContent.optionOtherHint,
                        phoneNumber: applicantPhoneContent.phoneNumber,
                        applicantAddress: applicantAddressContent.question,
                        applicantNameAsOnWill: applicantNameAsOnWillContent.question.replace('{applicantName}', FormatName.format(sessionData.applicant))
                    };

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

        it('test data is played back correctly on the summary page executors section', (done) => {
            const executorsData = require('test/data/summary-executors');
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    delete require.cache[require.resolve('test/data/summary-executors')];
                    const playbackData = {
                        questionFirstName: applicantNameContent.firstName,
                        questionLastName: applicantNameContent.lastName,
                        questionPhoneNumber: applicantPhoneContent.phoneNumber,
                        questionApplicantAddress: applicantAddressContent.question,
                        questionExecutorsAllAlive: executorsAllAliveContent.question,

                        allAlive: executorsData.executors.allAlive,

                        exec2fullName: executorsData.executors.list[1].fullName,
                        exec2IsApplying: executorsData.executors.list[1].isApplying ? 'Yes' : 'No',
                        exec2HasAlias: executorsData.executors.list[1].hasOtherName ? 'Yes': 'No',
                        exec2Alias: executorsData.executors.list[1].currentName,
                        exec2AliasReason: executorsData.executors.list[1].currentNameReason,

                        exec3fullName: executorsData.executors.list[2].fullName,
                        exec3IsApplying: executorsData.executors.list[2].isApplying ? 'Yes' : 'No',
                        exec3NotApplyingReason: executorsData.executors.list[2].notApplyingReason,

                        exec4fullName: executorsData.executors.list[3].fullName,
                        exec4IsApplying: executorsData.executors.list[3].isApplying ? 'Yes' : 'No',
                        exec4IsDead: executorsData.executors.list[3].isDead ? 'Yes' : 'No',
                        exec4DiedBefore: executorsData.executors.list[3].diedbefore
                    };
                    Object.assign(playbackData, executorsData.applicant);
                    playbackData.address = executorsData.applicant.address.formattedAddress;

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });
    });
});
