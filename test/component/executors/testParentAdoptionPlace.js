'use strict';

const TestWrapper = require('test/util/TestWrapper');
const CoApplicantName = require('app/steps/ui/executors/coapplicantname');
const ParentAdoptionPlace = require('app/steps/ui/executors/parentadoptionplace');
const caseTypes= require('app/utils/CaseTypes');
const StopPage = require('../../../app/steps/ui/stoppage');

describe('parent-adoption-place', () => {
    let testWrapper;
    const expectedNextUrlForCoApplicantName = CoApplicantName.getUrl(1);
    const expectedNextUrlForNoNameStopPage = StopPage.getUrl('coApplicantParentAdoptionPlaceNoNameStop');

    beforeEach(() => {
        testWrapper = new TestWrapper('CoApplicantParentAdoptionPlace');
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
        [
            {
                label: `redirects whole-blood yes to co-applicant name: /intestacy${expectedNextUrlForCoApplicantName}`,
                relationship: 'optionWholeBloodNieceOrNephew',
                payload: {applicantParentAdoptionPlace: 'optionYes'},
                expected: `/intestacy${expectedNextUrlForCoApplicantName}`
            },
            {
                label: `redirects half-blood no to no-name stop page: /intestacy${expectedNextUrlForNoNameStopPage}`,
                relationship: 'optionHalfBloodNieceOrNephew',
                payload: {applicantParentAdoptionPlace: 'optionNo'},
                expected: `/intestacy${expectedNextUrlForNoNameStopPage}`
            }
        ].forEach(testCase => it(testCase.label, (done) => {
            testWrapper.pageUrl = ParentAdoptionPlace.getUrl(1);
            assertRedirect(buildSession(testCase.relationship), done, testCase.payload, testCase.expected);
        }));
    });
});
