'use strict';

const TestWrapper = require('test/util/TestWrapper');
const TaskList = require('app/steps/ui/tasklist');
const sessionData = require('test/data/documentupload');
const config = require('app/config');
const nock = require('nock');
const featureToggleUrl = config.featureToggles.url;
const intestacyQuestionsFeatureTogglePath = `${config.featureToggles.path}/${config.featureToggles.intestacy_questions}`;
const featureTogglesNockIntestacy = (status = 'true') => {
    nock(featureToggleUrl)
        .get(intestacyQuestionsFeatureTogglePath)
        .reply(200, status);
};

describe('summary', () => {
    let testWrapper;
    const expectedNextUrlForTaskList = TaskList.getUrl();
    const sessionDataIntestacy = {
        caseType: 'intestacy'
    };

    beforeEach(() => {
        testWrapper = new TestWrapper('Summary');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test content loaded on the page and documents uploaded', (done) => {
            const contentToExclude = [
                'executorsWhenDiedQuestion',
                'otherNamesLabel',
                'otherExecutors',
                'executorsWithOtherNames',
                'executorApplyingForProbate',
                'executorsNotApplyingForProbate',
                'nameOnWill',
                'currentName',
                'currentNameReason',
                'mobileNumber',
                'emailAddress',
                'uploadedDocumentsHeading',
                'uploadedDocumentsEmpty',
                'aboutPeopleApplyingHeading'
            ];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentToExclude);
                });
        });

        it('[INTESTACY] test content loaded on the page', (done) => {
            featureTogglesNockIntestacy('true');

            const contentToExclude = [
                'executorsWhenDiedQuestion',
                'otherNamesLabel',
                'otherExecutors',
                'executorsWithOtherNames',
                'executorApplyingForProbate',
                'executorsNotApplyingForProbate',
                'nameOnWill',
                'currentName',
                'currentNameReason',
                'mobileNumber',
                'emailAddress',
                'uploadedDocumentsHeading',
                'uploadedDocumentsEmpty',
                'applicantHeading'
            ];
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionDataIntestacy)
                .end(() => {
                    testWrapper.testContent(done, contentToExclude);
                });
        });

        it('test it redirects to submit', (done) => {
            const sessionData = {
                applicant: {nameAsOnTheWill: 'No'}
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const nextStepData = {softStop: true};
                    testWrapper.agent.get('/summary/redirect')
                        .expect('location', testWrapper.nextStep(nextStepData).constructor.getUrl())
                        .expect(302)
                        .end((err) => {
                            testWrapper.server.http.close();
                            if (err) {
                                done(err);
                            } else {
                                done();
                            }
                        });
                });
        });

        it(`test it redirects to Task List: ${expectedNextUrlForTaskList}`, (done) => {
            testWrapper.agent.get('/summary/redirect')
                .expect('location', expectedNextUrlForTaskList)
                .expect(302)
                .end((err) => {
                    testWrapper.server.http.close();
                    if (err) {
                        done(err);
                    } else {
                        done();
                    }
                });
        });
    });
});
