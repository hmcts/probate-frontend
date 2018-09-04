'use strict';

const TestWrapper = require('test/util/TestWrapper');
const TaskList = require('app/steps/ui/tasklist/index');
const ExecutorContactDetails = require('app/steps/ui/executors/contactdetails/index');
const ExecutorRoles = require('app/steps/ui/executors/roles/index');

describe('executors-address', () => {
    let testWrapper, sessionData;
    const expectedNextUrlForTaskList = TaskList.getUrl();
    const expectedNextUrlForExecRoles = ExecutorRoles.getUrl('*');
    const expectedNextUrlForExecContactDetails = ExecutorContactDetails.getUrl(2);

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorAddress');
        sessionData = {
            'applicant': {
                'firstName': 'Lead', 'lastName': 'Applicant'
            },
            'executors': {
                'executorsNumber': 3,
                'list': [
                    {'fullName': 'john', 'isApplying': true, 'isApplicant': true},
                    {'fullName': 'other applicant', 'isApplying': true, 'isApplicant': true},
                    {'fullName': 'harvey', 'isApplying': false, 'isApplicant': true}
                ]
            }
        };
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test correct content is loaded on the page', (done) => {
            const excludeKeys = ['selectAddress'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {

                    const contentData = {
                        executorName: 'other applicant'
                    };

                    testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
                    testWrapper.testContent(done, excludeKeys, contentData);
                });

        });

        it('test address schema validation when no address search has been done', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                const data = {addressFound: 'none'};
                    testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
                testWrapper.testErrors(done, data, 'required', ['postcodeLookup']);
            });

        });

        it('test address schema validation when address search is successful, but no address is selected/entered', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {addressFound: 'true'};
                    testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
                    testWrapper.testErrors(done, data, 'oneOf', ['crossField']);
                });
        });

        it('test address schema validation when address search is successful, and two addresses are provided', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        addressFound: 'true',
                        freeTextAddress: 'free text address',
                        postcodeAddress: 'postcode address'
                    };
                    testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
                    testWrapper.testErrors(done, data, 'oneOf', ['crossField']);
                });
        });

        it('test address schema validation when address search is unsuccessful', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        addressFound: 'false'
                    };
                    testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
                    testWrapper.testErrors(done, data, 'required', ['freeTextAddress']);
                });

        });

        it(`test it redirects to tasklist: ${expectedNextUrlForTaskList}`, (done) => {
            sessionData = {
                'applicant': {
                    'firstName': 'Lead', 'lastName': 'Applicant'
                },
                'executors': {
                    'executorsNumber': 3,
                    'list': [
                        {'fullName': 'john', 'isApplying': true, 'isApplicant': true},
                        {'fullName': 'other applicant', 'isApplying': true, 'isApplicant': true},
                        {'fullName': 'harvey', 'isApplying': true, 'isApplicant': true}
                    ]
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        index: 2,
                        postcode: 'ea1 eaf',
                        postcodeAddress: '102 Petty France'
                    };
                    testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(2);
                    testWrapper.testRedirect(done, data, expectedNextUrlForTaskList);
                });
        });

        it(`test it redirects to Executors Role step: ${expectedNextUrlForExecRoles}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        index: 2,
                        postcode: 'ea1 eaf',
                        postcodeAddress: '102 Petty France'
                    };
                    testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(2);
                    testWrapper.testRedirect(done, data, expectedNextUrlForExecRoles);
                });
        });

        it(`test it redirects to Executor Contact Details step: ${expectedNextUrlForExecContactDetails}`, (done) => {
            sessionData = {
                'applicant': {
                    'firstName': 'Lead', 'lastName': 'Applicant'
                },
                'executors': {
                    'executorsNumber': 3,
                    'list': [
                        {'fullName': 'john', 'isApplying': true, 'isApplicant': true},
                        {'fullName': 'other applicant', 'isApplying': true, 'isApplicant': true},
                        {'fullName': 'harvey', 'isApplying': true, 'isApplicant': true}
                    ]
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        index: 1,
                        postcode: 'ea1 eaf',
                        postcodeAddress: '102 Petty France'
                    };
                    testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
                    testWrapper.testRedirect(done, data, expectedNextUrlForExecContactDetails);
                });
        });

    });
});
