const requireDir = require('require-directory');
const TestWrapper = require('test/util/TestWrapper');
const executorsData = require('test/data/summary-executors');
const applicantContent = requireDir(module, '../../../app/resources/en/translation/applicant');
const FormatName = require('app/utils/FormatName');

describe('summary-executor-section', () => {
    let testWrapper, sessionData;

    beforeEach(() => {
        testWrapper = new TestWrapper('Summary');
        sessionData = require('test/data/summary-executors');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test correct content loaded on the summary page executors section, when no data is entered', (done) => {

            const playbackData = {};
            playbackData.firstName = applicantContent.name.firstName;
            playbackData.lastName = applicantContent.name.lastName;
            playbackData.phoneNumber = applicantContent.phone.phoneNumber;
            playbackData.applicantAddress = applicantContent.address.question;
            playbackData.applicantNameAsOnWill = applicantContent.nameasonwill.questionWithoutName;

            testWrapper.testDataPlayback(done, playbackData);
        });

        it('test correct content loaded on the summary page executors section, when section is complete', (done) => {

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }

                    const playbackData = {};
                    playbackData.firstName = applicantContent.name.firstName;
                    playbackData.lastName = applicantContent.name.lastName;
                    playbackData.phoneNumber = applicantContent.phone.phoneNumber;
                    playbackData.applicantAddress = applicantContent.address.question;
                    playbackData.applicantNameAsOnWill = applicantContent.nameasonwill.question.replace('{applicantName}', FormatName.format(sessionData.applicant));

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

        // it('test correct content loaded on the summary page executors section including applicant alias (Option Divorce selected), when section is complete', (done) => {
        //     sessionData.applicant.nameAsOnTheWill = 'No';
        //     sessionData.applicant.alias = 'Dave Buster';
        //     sessionData.applicant.aliasReason = 'Divorce';
        //     testWrapper.agent.post('/prepare-session/form')
        //         .send(sessionData)
        //         .end((err) => {
        //             if (err) {
        //                 throw err;
        //             }

        //             const playbackData = {};
        //             playbackData.firstName = applicantContent.name.firstName;
        //             playbackData.lastName = applicantContent.name.lastName;
        //             playbackData.alias = applicantContent.alias.nameOnWill;
        //             playbackData.aliasReason = applicantContent.aliasreason.optionOtherHint;
        //             playbackData.phoneNumber = applicantContent.phone.phoneNumber;
        //             playbackData.applicantAddress = applicantContent.address.question;
        //             playbackData.applicantNameAsOnWill = applicantContent.nameasonwill.question.replace('{applicantName}', FormatName.format(sessionData.applicant));

        //             testWrapper.testDataPlayback(done, playbackData);
        //         });
        // });

        // it('test correct content loaded on the summary page executors section including applicant alias (Option Other selected), when section is complete', (done) => {
        //     sessionData.applicant.nameAsOnTheWill = 'No';
        //     sessionData.applicant.alias = 'Dave Buster';
        //     sessionData.applicant.aliasReason = 'other';
        //     sessionData.applicant.otherReason = 'Because';
        //     testWrapper.agent.post('/prepare-session/form')
        //         .send(sessionData)
        //         .end((err) => {
        //             if (err) {
        //                 throw err;
        //             }

        //             const playbackData = {};
        //             playbackData.firstName = applicantContent.name.firstName;
        //             playbackData.lastName = applicantContent.name.lastName;
        //             playbackData.alias = applicantContent.alias.nameOnWill;
        //             playbackData.aliasReason = applicantContent.aliasreason.optionOtherHint;
        //             playbackData.phoneNumber = applicantContent.phone.phoneNumber;
        //             playbackData.applicantAddress = applicantContent.address.question;
        //             playbackData.applicantNameAsOnWill = applicantContent.nameasonwill.question.replace('{applicantName}', FormatName.format(sessionData.applicant));

        //             testWrapper.testDataPlayback(done, playbackData);
        //         });
        // });

        it('test data is played back correctly on the summary page executors section', (done) => {

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }

                    const playbackData = {};
                    playbackData.firstName = applicantContent.name.firstName;
                    playbackData.lastName = applicantContent.name.lastName;
                    playbackData.phoneNumber = applicantContent.phone.phoneNumber;
                    playbackData.applicantAddress = applicantContent.address.question;

                    Object.assign(playbackData, executorsData.applicant);
                    playbackData.exec2fullName = executorsData.executors.list[1].fullName;
                    playbackData.exec2IsApplying = executorsData.executors.list[1].isApplying ? 'Yes' : 'No';
                    playbackData.exec3fullName = executorsData.executors.list[2].fullName;
                    playbackData.exec3IsApplying = executorsData.executors.list[2].isApplying ? 'Yes' : 'No';
                    playbackData.exec3NotApplyingReason = executorsData.executors.list[2].notApplyingReason;

                    testWrapper.testDataPlayback(done, playbackData);
                    });
        });
    });
});
