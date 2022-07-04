'use strict';

const DocumentsWrapper = require('app/wrappers/Documents');
const expect = require('chai').expect;
const caseTypes = require('app/utils/CaseTypes');

describe('Documents.js', () => {
    describe('intestacyDocScreeningConditionsMet()', () => {
        it('should return true when deceased is married and applicant is partner', (done) => {
            const data = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionMarried'
                },
                applicant: {
                    relationshipToDeceased: 'optionSpousePartner'
                }
            };
            const documentsWrapper = new DocumentsWrapper(data);
            expect(documentsWrapper.intestacyDocScreeningConditionsMet(true, false)).to.equal(true);
            done();
        });

        it('should return true when deceased is divorced, widowed, never married or separated and applicant is child, deceased had other children, all children over 18, some children deceased, no grandchildren under 18', (done) => {
            const data = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    anyOtherChildren: 'optionYes',
                    allChildrenOver18: 'optionYes',
                    anyDeceasedChildren: 'optionYes',
                    anyGrandchildrenUnder18: 'optionNo'
                },
                applicant: {
                    relationshipToDeceased: 'optionChild'
                }
            };
            const maritalStatusOptions = ['optionDivorced', 'optionWidowed', 'optionNotMarried', 'optionSeparated'];
            maritalStatusOptions.forEach(option => {
                data.deceased.maritalStatus = option;
                const documentsWrapper = new DocumentsWrapper(data);
                expect(documentsWrapper.intestacyDocScreeningConditionsMet(false, true)).to.equal(true);
            });
            done();
        });

        it('should return true when deceased is divorced, widowed, never married or separated and applicant is child, deceased had other children, all children over 18, no children deceased', (done) => {
            const data = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    anyOtherChildren: 'optionYes',
                    allChildrenOver18: 'optionYes',
                    anyDeceasedChildren: 'optionNo',
                },
                applicant: {
                    relationshipToDeceased: 'optionChild'
                }
            };
            const maritalStatusOptions = ['optionDivorced', 'optionWidowed', 'optionNotMarried', 'optionSeparated'];
            maritalStatusOptions.forEach(option => {
                data.deceased.maritalStatus = option;
                const documentsWrapper = new DocumentsWrapper(data);
                expect(documentsWrapper.intestacyDocScreeningConditionsMet(false, true)).to.equal(true);
            });
            done();
        });

        it('should return true when deceased is divorced, widowed, never married or separated and applicant is child, no other children', (done) => {
            const data = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    anyOtherChildren: 'optionNo',
                },
                applicant: {
                    relationshipToDeceased: 'optionChild'
                }
            };
            const maritalStatusOptions = ['optionDivorced', 'optionWidowed', 'optionNotMarried', 'optionSeparated'];
            maritalStatusOptions.forEach(option => {
                data.deceased.maritalStatus = option;
                const documentsWrapper = new DocumentsWrapper(data);
                expect(documentsWrapper.intestacyDocScreeningConditionsMet(false, true)).to.equal(true);
            });
            done();
        });

        it('should return true when deceased is divorced, widowed, never married or separated and applicant is ADOPTED child, deceased had other children, all children over 18, some children deceased, no grandchildren under 18', (done) => {
            const data = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    anyOtherChildren: 'optionYes',
                    allChildrenOver18: 'optionYes',
                    anyDeceasedChildren: 'optionYes',
                    anyGrandchildrenUnder18: 'optionNo'
                },
                applicant: {
                    relationshipToDeceased: 'optionAdoptedChild'
                }
            };
            const maritalStatusOptions = ['optionDivorced', 'optionWidowed', 'optionNotMarried', 'optionSeparated'];
            maritalStatusOptions.forEach(option => {
                data.deceased.maritalStatus = option;
                const documentsWrapper = new DocumentsWrapper(data);
                expect(documentsWrapper.intestacyDocScreeningConditionsMet(false, true)).to.equal(true);
            });
            done();
        });

        it('should return true when deceased is divorced, widowed, never married or separated and applicant is ADOPTED child, deceased had other children, all children over 18, no children deceased', (done) => {
            const data = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    anyOtherChildren: 'optionYes',
                    allChildrenOver18: 'optionYes',
                    anyDeceasedChildren: 'optionNo',
                },
                applicant: {
                    relationshipToDeceased: 'optionAdoptedChild'
                }
            };
            const maritalStatusOptions = ['optionDivorced', 'optionWidowed', 'optionNotMarried', 'optionSeparated'];
            maritalStatusOptions.forEach(option => {
                data.deceased.maritalStatus = option;
                const documentsWrapper = new DocumentsWrapper(data);
                expect(documentsWrapper.intestacyDocScreeningConditionsMet(false, true)).to.equal(true);
            });
            done();
        });

        it('should return true when deceased is divorced, widowed, never married or separated and applicant is ADOPTED child, no other children, adopted in england or wales', (done) => {
            const data = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    anyOtherChildren: 'optionNo',
                },
                applicant: {
                    relationshipToDeceased: 'optionAdoptedChild',
                    adoptionPlace: 'optionYes'
                }
            };
            const maritalStatusOptions = ['optionDivorced', 'optionWidowed', 'optionNotMarried', 'optionSeparated'];
            maritalStatusOptions.forEach(option => {
                data.deceased.maritalStatus = option;
                const documentsWrapper = new DocumentsWrapper(data);
                expect(documentsWrapper.intestacyDocScreeningConditionsMet(false, true)).to.equal(true);
            });
            done();
        });

        it('should return true when deceased is divorced, widowed, never married or separated and applicant is ADOPTED child, no other children', (done) => {
            const data = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    anyOtherChildren: 'optionNo',
                },
                applicant: {
                    relationshipToDeceased: 'optionAdoptedChild'
                }
            };
            const maritalStatusOptions = ['optionDivorced', 'optionWidowed', 'optionNotMarried', 'optionSeparated'];
            maritalStatusOptions.forEach(option => {
                data.deceased.maritalStatus = option;
                const documentsWrapper = new DocumentsWrapper(data);
                expect(documentsWrapper.intestacyDocScreeningConditionsMet(false, true)).to.equal(true);
            });
            done();
        });
    });

});
