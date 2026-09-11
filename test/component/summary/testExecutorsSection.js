'use strict';

const TestWrapper = require('test/util/TestWrapper');
const applicantNameContent = require('app/resources/en/translation/applicant/name');
const applicantPhoneContent = require('app/resources/en/translation/applicant/phone');
const applicantAddressContent = require('app/resources/en/translation/applicant/address');
const applicantAliasContent = require('app/resources/en/translation/applicant/alias');
const applicantAliasReasonContent = require('app/resources/en/translation/applicant/aliasreason');
const applicantNameAsOnWillContent = require('app/resources/en/translation/applicant/nameasonwill');
const executorsApplyingContent = require('app/resources/en/translation/executors/applying');
const anyExecutorsDiedContent = require('app/resources/en/translation/executors/anyexecutorsdied');
const executorsRoles = require('app/resources/en/translation/executors/roles');
const executorsAliasReason = require('app/resources/en/translation/executors/currentnamereason');
const executorsDiedBefore = require('app/resources/en/translation/executors/whendied');
const relationshipToDeceasedContent = require('app/resources/en/translation/executors/relationshiptodeceased');
const parentAdoptedInContent = require('app/resources/en/translation/executors/parentadoptedin');
const parentAdoptionPlaceContent = require('app/resources/en/translation/executors/parentadoptionplace');
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
        delete require.cache[require.resolve('app/resources/en/translation/executors/anyexecutorsdied')];
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
            sessionData.applicant.nameAsOnTheWill = 'optionNo';
            sessionData.applicant.alias = 'Dave Buster';
            sessionData.applicant.aliasReason = 'optionDivorce';

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
                        aliasReason: applicantAliasReasonContent.reasonForNameChangeQuestionSummary,
                        phoneNumber: applicantPhoneContent.phoneNumber,
                        applicantAddress: applicantAddressContent.question,
                        applicantNameAsOnWill: applicantNameAsOnWillContent.question.replace('{applicantName}', FormatName.format(sessionData.applicant))
                    };

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

        it('test correct content loaded on the summary page executors section including applicant alias (Option Other selected), when section is complete', (done) => {
            sessionData.applicant.nameAsOnTheWill = 'optionNo';
            sessionData.applicant.alias = 'Dave Buster';
            sessionData.applicant.aliasReason = 'optionOther';
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
                        aliasReason: applicantAliasReasonContent.reasonForNameChangeQuestionSummary,
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
                        questionAnyExecutorsDied: anyExecutorsDiedContent.multipleExecutorQuestion,

                        anyExecutorsDied: anyExecutorsDiedContent[executorsData.executors.anyExecutorsDied],

                        exec2fullName: executorsData.executors.list[1].fullName,
                        exec2IsApplying: executorsData.executors.list[1].isApplying ? executorsApplyingContent.optionYes : executorsApplyingContent.optionNo,
                        exec2HasAlias: executorsData.executors.list[1].hasOtherName ? executorsApplyingContent.optionYes : executorsApplyingContent.optionNo,
                        exec2Alias: executorsData.executors.list[1].currentName,
                        exec2AliasReason: executorsAliasReason[executorsData.executors.list[1].currentNameReason],

                        exec3fullName: executorsData.executors.list[2].fullName,
                        exec3IsApplying: executorsData.executors.list[2].isApplying ? executorsApplyingContent.optionYes : executorsApplyingContent.optionNo,
                        exec3NotApplyingReason: executorsRoles[executorsData.executors.list[2].notApplyingReason].replace('{executorName}', executorsData.executors.list[2].fullName),

                        exec4fullName: executorsData.executors.list[3].fullName,
                        exec4IsApplying: executorsData.executors.list[3].isApplying ? executorsApplyingContent.optionYes : executorsApplyingContent.optionNo,
                        exec4IsDead: executorsData.executors.list[3].isDead ? executorsApplyingContent.optionYes : executorsApplyingContent.optionNo,
                        exec4DiedBefore: executorsDiedBefore[executorsData.executors.list[3].diedbefore]
                    };
                    Object.assign(playbackData, executorsData.applicant);
                    playbackData.address = executorsData.applicant.address.formattedAddress;
                    playbackData.nameAsOnTheWill = applicantNameAsOnWillContent[playbackData.nameAsOnTheWill];
                    playbackData.aliasReason = applicantAliasReasonContent[playbackData.aliasReason];
                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

        [
            {
                label: 'whole-blood',
                relationship: 'optionWholeBloodNieceOrNephew',
                setupApplicant: applicant => {
                    applicant.sameParents = 'optionBothParentsSame';
                    applicant.anyOtherWholeSiblings = 'optionYes';
                    applicant.anyPredeceasedWholeSiblings = 'optionYesSome';
                    applicant.anySurvivingWholeNiecesAndWholeNephews = 'optionYes';
                }
            },
            {
                label: 'half-blood',
                relationship: 'optionHalfBloodNieceOrNephew',
                setupApplicant: applicant => {
                    applicant.sameParents = 'optionOneParentsSame';
                    applicant.anyOtherHalfSiblings = 'optionYes';
                    applicant.anyPredeceasedHalfSiblings = 'optionYesSome';
                    applicant.anySurvivingHalfNiecesAndHalfNephews = 'optionYes';
                }
            }
        ].forEach(({label, relationship, setupApplicant}) => {
            it(`shows ${label} parent adoption answers for co-applicants on intestacy check your answers`, (done) => {
                sessionData.caseType = 'intestacy';
                sessionData.deceased = sessionData.deceased || {};
                sessionData.applicant = sessionData.applicant || {};
                sessionData.deceased.firstName = 'John';
                sessionData.deceased.lastName = 'Doe';
                sessionData.applicant.relationshipToDeceased = 'optionSibling';
                setupApplicant(sessionData.applicant);

                sessionData.executors.list[1].coApplicantRelationshipToDeceased = relationship;
                delete sessionData.executors.list[1].wholeNieceOrNephewParentAdoptedIn;
                delete sessionData.executors.list[1].wholeNieceOrNephewParentAdoptionInEnglandOrWales;
                delete sessionData.executors.list[1].halfNieceOrNephewParentAdoptedIn;
                delete sessionData.executors.list[1].halfNieceOrNephewParentAdoptionInEnglandOrWales;
                if (relationship === 'optionWholeBloodNieceOrNephew') {
                    sessionData.executors.list[1].wholeNieceOrNephewParentAdoptedIn = 'optionYes';
                    sessionData.executors.list[1].wholeNieceOrNephewParentAdoptionInEnglandOrWales = 'optionYes';
                } else {
                    sessionData.executors.list[1].halfNieceOrNephewParentAdoptedIn = 'optionYes';
                    sessionData.executors.list[1].halfNieceOrNephewParentAdoptionInEnglandOrWales = 'optionYes';
                }

                testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end((err) => {
                        if (err) {
                            throw err;
                        }

                        const playbackData = {
                            coApplicantRelationshipAnswer: relationshipToDeceasedContent[relationship],
                            parentAdoptedInAnswer: parentAdoptedInContent.optionYes,
                            parentAdoptionPlaceQuestion: parentAdoptionPlaceContent.question,
                            parentAdoptionPlaceAnswer: parentAdoptionPlaceContent.optionYes
                        };

                        testWrapper.testDataPlayback(done, playbackData);
                    });
            });
        });
    });
});
