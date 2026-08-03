'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ParentAdoptedOut = require('app/steps/ui/executors/parentadoptedout');
const CoApplicantName = require('app/steps/ui/executors/coapplicantname');
const StopPage = require('../../../app/steps/ui/stoppage');
const caseTypes= require('app/utils/CaseTypes');

describe('parent-adopted-out', () => {
    let testWrapper;
    const expectedNextUrlForCoApplicantName = CoApplicantName.getUrl(1);
    const expectedNextUrlForWholeBloodNoNameStopPage = StopPage.getUrl('coApplicantParentAdoptedOutWholeBloodNoNameStop');
    const expectedNextUrlForHalfBloodNoNameStopPage = StopPage.getUrl('coApplicantParentAdoptedOutHalfBloodNoNameStop');

    beforeEach(() => {
        testWrapper = new TestWrapper('CoApplicantParentAdoptedOut');
    });

    afterEach(async () => {
        await testWrapper.destroy();
    });

    const buildSession = relationship => ({
        caseType: caseTypes.INTESTACY,
        applicantName: 'First coApplicant',
        deceased: {
            firstName: 'John',
            lastName: 'Doe'
        },
        applicant: {
            'firstName': 'Bobby',
            'lastName': 'Applicant',
            'isApplying': true,
            'isApplicant': true,
            'fullName': 'Bobby Applicant'
        },
        executors: {
            list: [
                {fullName: 'Main Applicant', isApplicant: true},
                {fullName: 'First coApplicant', coApplicantRelationshipToDeceased: relationship, isApplicant: true}
            ]
        }
    });

    const prepareSession = (sessionData, done) => {
        testWrapper.agent.post('/prepare-session/form')
            .send(sessionData)
            .end(done);
    };

    const assertRedirect = (sessionData, done, payload, expectedUrl) => {
        prepareSession(sessionData, () => testWrapper.testRedirect(done, payload, expectedUrl));
    };

    describe('Verify Content, Errors and Redirection', () => {
        it(`redirects half-blood no to co-applicant name: /intestacy${expectedNextUrlForCoApplicantName}`, (done) => {
            testWrapper.pageUrl = ParentAdoptedOut.getUrl(1);
            assertRedirect(buildSession('optionHalfBloodNieceOrNephew'), done, {applicantParentAdoptedOut: 'optionNo'}, `/intestacy${expectedNextUrlForCoApplicantName}`);
        });

        [
            {
                label: `redirects whole-blood yes to no-name stop page: /intestacy${expectedNextUrlForWholeBloodNoNameStopPage}`,
                relationship: 'optionWholeBloodNieceOrNephew',
                payload: {applicantParentAdoptedOut: 'optionYes'},
                expected: `/intestacy${expectedNextUrlForWholeBloodNoNameStopPage}`
            },
            {
                label: `redirects half-blood yes to no-name stop page: /intestacy${expectedNextUrlForHalfBloodNoNameStopPage}`,
                relationship: 'optionHalfBloodNieceOrNephew',
                payload: {applicantParentAdoptedOut: 'optionYes'},
                expected: `/intestacy${expectedNextUrlForHalfBloodNoNameStopPage}`
            }
        ].forEach(testCase => it(testCase.label, (done) => {
            testWrapper.pageUrl = ParentAdoptedOut.getUrl(1);
            assertRedirect(buildSession(testCase.relationship), done, testCase.payload, testCase.expected);
        }));
    });
});
