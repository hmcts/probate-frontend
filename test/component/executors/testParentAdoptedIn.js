'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ParentAdoptionPlace = require('app/steps/ui/executors/parentadoptionplace');
const ParentAdoptedOut = require('app/steps/ui/executors/parentadoptedout');
const ParentAdoptedIn = require('app/steps/ui/executors/parentadoptedin');
const caseTypes= require('app/utils/CaseTypes');

describe('parent-adopted-in', () => {
    let testWrapper;
    const expectedNextUrlForParentAdoptionPlace = ParentAdoptionPlace.getUrl(1);
    const expectedNextUrlForParentAdoptedOut = ParentAdoptedOut.getUrl(1);

    beforeEach(() => {
        testWrapper = new TestWrapper('CoApplicantParentAdoptedIn');
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

    const assertRedirect = (sessionData, done, data, expectedUrl) => {
        prepareSession(sessionData, () => testWrapper.testRedirect(done, data, expectedUrl));
    };

    describe('Verify Content, Errors and Redirection', () => {
        [
            {
                label: 'whole-blood',
                relationship: 'optionWholeBloodNieceOrNephew'
            },
            {
                label: 'half-blood',
                relationship: 'optionHalfBloodNieceOrNephew'
            }
        ].forEach(testCase => it(`redirects ${testCase.label} parent adopted in to adoption place: /intestacy${expectedNextUrlForParentAdoptionPlace}`, (done) => {
            testWrapper.pageUrl = ParentAdoptedIn.getUrl(1);
            assertRedirect(buildSession(testCase.relationship), done, {applicantParentAdoptedIn: 'optionYes'}, `/intestacy${expectedNextUrlForParentAdoptionPlace}`);
        }));

        it(`redirects half-blood parent not adopted in to adopted-out step: /intestacy${expectedNextUrlForParentAdoptedOut}`, (done) => {
            testWrapper.pageUrl = ParentAdoptedIn.getUrl(1);
            assertRedirect(buildSession('optionHalfBloodNieceOrNephew'), done, {applicantParentAdoptedIn: 'optionNo'}, `/intestacy${expectedNextUrlForParentAdoptedOut}`);
        });

    });
});
