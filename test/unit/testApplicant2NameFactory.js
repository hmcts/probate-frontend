'use strict';

const contentMaritalStatus = require('app/resources/en/translation/deceased/maritalstatus');
const contentRelationshipToDeceased = require('app/resources/en/translation/applicant/relationshiptodeceased');
const contentAnyChildren = require('app/resources/en/translation/deceased/anychildren');
const contentAnyOtherChildren = require('app/resources/en/translation/deceased/anyotherchildren');
const content = require('app/resources/en/translation/declaration');
const expect = require('chai').expect;
const applicant2NameFactory = require('app/utils/Applicant2NameFactory');

describe('Applicant2NameFactory', () => {
    let formdata;

    beforeEach (() => {
        formdata = {};
        formdata.deceasedName = '{deceasedName}';
    });

    describe('getApplicant2Name()', () => {
        it('should return intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThan250k', (done) => {
            formdata.maritalStatus = contentMaritalStatus.optionMarried;
            formdata.relationshipToDeceased = contentRelationshipToDeceased.optionSpousePartner;
            formdata.anyChildren = contentAnyChildren.optionNo;
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content);
            expect(applicant2Name).to.equal(content.intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThan250k);
            done();
        });

        it('should return intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThan250k', (done) => {
            formdata.maritalStatus = contentMaritalStatus.optionMarried;
            formdata.relationshipToDeceased = contentRelationshipToDeceased.optionSpousePartner;
            formdata.ihtTotalNetValue = 0;
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content);
            expect(applicant2Name).to.equal(content.intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThan250k);
            done();
        });

        it('should return intestacyDeceasedMarriedSpouseApplyingHadChildren', (done) => {
            formdata.maritalStatus = contentMaritalStatus.optionMarried;
            formdata.relationshipToDeceased = contentRelationshipToDeceased.optionSpousePartner;
            formdata.hadChildren = contentAnyChildren.optionYes;
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content);
            expect(applicant2Name).to.equal(content.intestacyDeceasedMarriedSpouseApplyingHadChildren);
            done();
        });

        it('should return intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsAdopted', (done) => {
            formdata.maritalStatus = contentMaritalStatus.optionMarried;
            formdata.ihtTotalNetValue = 0;
            formdata.anyOtherChildren = contentAnyOtherChildren.optionYes;
            formdata.relationshipToDeceased = contentRelationshipToDeceased.optionAdoptedChild;
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content);
            expect(applicant2Name).to.equal(content.intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsAdopted);
            done();
        });

        it('should return intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsNotAdopted', (done) => {
            formdata.maritalStatus = contentMaritalStatus.optionMarried;
            formdata.ihtTotalNetValue = 0;
            formdata.anyOtherChildren = contentAnyOtherChildren.optionYes;
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content);
            expect(applicant2Name).to.equal(content.intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsNotAdopted);
            done();
        });

        it('should return intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsAdopted', (done) => {
            formdata.maritalStatus = contentMaritalStatus.optionMarried;
            formdata.ihtTotalNetValue = 0;
            formdata.anyOtherChildren = contentAnyOtherChildren.optionNo;
            formdata.relationshipToDeceased = contentRelationshipToDeceased.optionAdoptedChild;
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content);
            expect(applicant2Name).to.equal(content.intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsAdopted);
            done();
        });

        it('should return intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsNotAdopted', (done) => {
            formdata.maritalStatus = contentMaritalStatus.optionMarried;
            formdata.ihtTotalNetValue = 0;
            formdata.anyOtherChildren = contentAnyOtherChildren.optionNo;
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content);
            expect(applicant2Name).to.equal(content.intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsNotAdopted);
            done();
        });

        it('should return intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsAdopted', (done) => {
            formdata.maritalStatus = contentMaritalStatus.optionMarried;
            formdata.ihtTotalNetValue = 500000;
            formdata.anyOtherChildren = contentAnyOtherChildren.optionYes;
            formdata.relationshipToDeceased = contentRelationshipToDeceased.optionAdoptedChild;
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content);
            expect(applicant2Name).to.equal(content.intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsAdopted);
            done();
        });

        it('should return intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsNotAdopted', (done) => {
            formdata.maritalStatus = contentMaritalStatus.optionMarried;
            formdata.ihtTotalNetValue = 500000;
            formdata.anyOtherChildren = contentAnyOtherChildren.optionYes;
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content);
            expect(applicant2Name).to.equal(content.intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsNotAdopted);
            done();
        });

        it('should return intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsAdopted', (done) => {
            formdata.maritalStatus = contentMaritalStatus.optionMarried;
            formdata.ihtTotalNetValue = 500000;
            formdata.anyOtherChildren = contentAnyOtherChildren.optionNo;
            formdata.relationshipToDeceased = contentRelationshipToDeceased.optionAdoptedChild;
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content);
            expect(applicant2Name).to.equal(content.intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsAdopted);
            done();
        });

        it('should return intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsNotAdopted', (done) => {
            formdata.maritalStatus = contentMaritalStatus.optionMarried;
            formdata.ihtTotalNetValue = 500000;
            formdata.anyOtherChildren = contentAnyOtherChildren.optionNo;
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content);
            expect(applicant2Name).to.equal(content.intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsNotAdopted);
            done();
        });

        it('should return intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsAdopted', (done) => {
            formdata.maritalStatus = contentMaritalStatus.optionNotMarried;
            formdata.relationshipToDeceased = contentRelationshipToDeceased.optionAdoptedChild;
            formdata.anyOtherChildren = contentAnyOtherChildren.optionYes;
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content);
            expect(applicant2Name).to.equal(content.intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsAdopted);
            done();
        });

        it('should return intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsNotAdopted', (done) => {
            formdata.maritalStatus = contentMaritalStatus.optionNotMarried;
            formdata.anyOtherChildren = contentAnyOtherChildren.optionYes;
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content);
            expect(applicant2Name).to.equal(content.intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsNotAdopted);
            done();
        });

        it('should return intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsAdopted', (done) => {
            formdata.maritalStatus = contentMaritalStatus.optionNotMarried;
            formdata.anyOtherChildren = contentAnyOtherChildren.optionNo;
            formdata.relationshipToDeceased = contentRelationshipToDeceased.optionAdoptedChild;
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content);
            expect(applicant2Name).to.equal(content.intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsAdopted);
            done();
        });

        it('should return intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsNotAdopted', (done) => {
            formdata.maritalStatus = contentMaritalStatus.optionNotMarried;
            formdata.anyOtherChildren = contentAnyOtherChildren.optionNo;
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content);
            expect(applicant2Name).to.equal(content.intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsNotAdopted);
            done();
        });

        it('should replace {deceasedName} tag', (done) => {
            formdata.maritalStatus = contentMaritalStatus.optionMarried;
            formdata.relationshipToDeceased = contentRelationshipToDeceased.optionSpousePartner;
            formdata.anyChildren = contentAnyChildren.optionNo;
            formdata.deceasedName = 'Dee Ceased';
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content);
            expect(applicant2Name).to.equal(content.intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThan250k.replace(/{deceasedName}/g, formdata.deceasedName));
            done();
        });
    });
});
