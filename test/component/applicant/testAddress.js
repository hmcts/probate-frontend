'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ExecutorCheckWill = require('app/steps/ui/executors/checkwill');
const JointApplication = require('app/steps/ui/executors/jointapplication');
const Equality = require('app/steps/ui/equality');
const formatAddress = address => address.replace(/,/g, ', ');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('../../../app/utils/CaseTypes');

describe('applicant-address', () => {
    let testWrapper;
    let testAddressData;
    const expectedNextUrlForExecutorCheckWill = ExecutorCheckWill.getUrl();
    const expectedNextUrlForJointApplication = JointApplication.getUrl();
    const expectedNextUrlForEquality = Equality.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ApplicantAddress');
        testAddressData = require('test/data/find-address');
    });

    afterEach(async () => {
        delete require.cache[require.resolve('test/data/find-address')];
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ApplicantAddress');

        it('test right content loaded on the page', (done) => {
            const sessionData = {
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                }
            };
            const contentToExclude = ['selectAddress'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, {}, contentToExclude);
                });
        });

        it('test error messages displayed for missing data', (done) => {
            const data = {addressFound: 'none'};
            const errorsToTest = ['addressLine1'];

            testWrapper.testErrors(done, data, 'required', errorsToTest);
        });

        it(`test it redirects to number of executors page: ${expectedNextUrlForExecutorCheckWill}`, (done) => {
            const data = {
                addressLine1: 'value',
                postTown: 'value',
                newPostCode: 'value'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForExecutorCheckWill);
        });

        it(`test it redirects to  page: ${expectedNextUrlForJointApplication}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionMarried',
                    firstName: 'John',
                    lastName: 'Doe',
                    anyOtherChildren: 'optionYes',
                    anyPredeceasedChildren: 'optionYesSome',
                    childrenOver18: 'optionYes',
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        fullName: 'CoApplicant',
                        addressLine1: 'value',
                        postTown: 'value',
                        newPostCode: 'value',
                        relationshipToDeceased: 'optionChild',
                        list: [
                            {firstName: 'John', lastName: 'TheApplicant', isApplying: true, isApplicant: true},
                        ]};

                    testWrapper.testRedirect(done, data, expectedNextUrlForJointApplication);
                });
        });

        it(`test it redirects to  page: ${expectedNextUrlForEquality}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionMarried',
                    firstName: 'John',
                    lastName: 'Doe',
                    anyOtherChildren: 'optionNo',
                },
                applicant: {
                    relationshipToDeceased: 'optionChild'
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        fullName: 'CoApplicant',
                        addressLine1: 'value',
                        postTown: 'value',
                        newPostCode: 'value',
                        list: [
                            {firstName: 'John', lastName: 'TheApplicant', isApplying: true, isApplicant: true},
                        ]};

                    testWrapper.testRedirect(done, data, expectedNextUrlForEquality);
                });
        });

        it('test it redirects to  Equality page when Predeceased children and no surviving children', (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionMarried',
                    firstName: 'John',
                    lastName: 'Doe',
                    anyOtherChildren: 'optionYes',
                    anyPredeceasedChildren: 'optionYesAll',
                    anySurvivingGrandchildren: 'optionNo',
                },
                applicant: {
                    relationshipToDeceased: 'optionChild'
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        fullName: 'CoApplicant',
                        addressLine1: 'value',
                        postTown: 'value',
                        newPostCode: 'value',
                        list: [
                            {firstName: 'John', lastName: 'TheApplicant', isApplying: true, isApplicant: true},
                        ]};

                    testWrapper.testRedirect(done, data, expectedNextUrlForEquality);
                });
        });
        it('test it redirects to  Equality page when applicant is grandchild and has all Predeceased children and no surviving children', (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionMarried',
                    firstName: 'John',
                    lastName: 'Doe',
                    anyOtherChildren: 'optionYes',
                    anyPredeceasedChildren: 'optionYesAll',
                    anySurvivingGrandchildren: 'optionNo',
                    grandchildParentHasOtherChildren: 'optionNo'
                },
                applicant: {
                    relationshipToDeceased: 'optionGrandchild'
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        fullName: 'CoApplicant',
                        addressLine1: 'value',
                        postTown: 'value',
                        newPostCode: 'value',
                        relationshipToDeceased: 'optionGrandchild',
                        list: [
                            {firstName: 'John', lastName: 'TheApplicant', isApplying: true, isApplicant: true},
                        ]};
                    testWrapper.testRedirect(done, data, expectedNextUrlForEquality);
                });
        });

        it('test it redirects to  Equality page when applicant is parent and No any Other Parent Alive', (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionMarried',
                    firstName: 'John',
                    lastName: 'Doe',
                    anyOtherChildren: 'optionYes',
                    anyPredeceasedChildren: 'optionYesAll',
                    anySurvivingGrandchildren: 'optionNo',
                    grandchildParentHasOtherChildren: 'optionNo',
                    anyOtherParentAlive: 'optionNo'
                },
                applicant: {
                    relationshipToDeceased: 'optionParent'
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        addressLine1: 'value',
                        postTown: 'value',
                        newPostCode: 'value'
                    };
                    testWrapper.testRedirect(done, data, expectedNextUrlForEquality);
                });
        });

        it('test it redirects to  Joint application page when applicant is parent and has any Other Parent Alive', (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionMarried',
                    firstName: 'John',
                    lastName: 'Doe',
                    anyOtherChildren: 'optionYes',
                    anyPredeceasedChildren: 'optionYesAll',
                    anySurvivingGrandchildren: 'optionNo',
                    grandchildParentHasOtherChildren: 'optionNo',
                    anyOtherParentAlive: 'optionYes'
                },
                applicant: {
                    relationshipToDeceased: 'optionParent'
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        addressLine1: 'value',
                        postTown: 'value',
                        newPostCode: 'value'
                    };
                    testWrapper.testRedirect(done, data, expectedNextUrlForJointApplication);
                });
        });
        it('test the address dropdown box displays all addresses when the user returns to the page', (done) => {
            const sessionData = {
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const sessionData = {
                        postcode: testAddressData[1].postcode,
                        postcodeAddress: formatAddress(testAddressData[1].formattedAddress),
                        addresses: testAddressData,
                        addressLine1: 'value',
                        postTown: 'value',
                        newPostCode: 'value'
                    };

                    testWrapper.agent
                        .post(testWrapper.pageUrl)
                        .send(sessionData)
                        .end(() => {
                            const playbackData = testAddressData.map((address, index) => {
                                const formattedAddress = formatAddress(address.formattedAddress);
                                return `<option value="${index}" ${formattedAddress === sessionData.postcodeAddress ? 'selected' : ''}>${formattedAddress}</option>`;
                            });

                            testWrapper.testDataPlayback(done, playbackData);
                        });
                });
        });
    });
});
