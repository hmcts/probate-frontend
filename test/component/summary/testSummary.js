'use strict';

const TestWrapper = require('test/util/TestWrapper');
const TaskList = require('app/steps/ui/tasklist/index');

describe('summary', () => {
    let testWrapper;
    const expectedNextUrlForTaskList = TaskList.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('Summary');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test content loaded on the page', (done) => {
            const contentToExclude = [
                'executorsWhenDiedQuestion',
                'otherNamesLabel',
                'willWithCodicilHeading',
                'otherExecutors',
                'executorsWithOtherNames',
                'executorApplyingForProbate',
                'executorsNotApplyingForProbate',
                'nameOnWill',
                'currentName',
                'currentNameReason',
                'mobileNumber',
                'emailAddress'
            ];
            testWrapper.testContent(done, contentToExclude);
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
