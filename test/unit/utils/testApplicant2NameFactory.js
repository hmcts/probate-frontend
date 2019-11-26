'use strict';

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
            formdata.maritalStatus = 'optionMarried';
            formdata.relationshipToDeceased = 'optionSpousePartner';
            formdata.anyChildren = 'optionNo';
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content);
            expect(applicant2Name).to.equal(content.intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThan250k);
            done();
        });

        it('should return intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThan250k', (done) => {
            formdata.maritalStatus = 'optionMarried';
            formdata.relationshipToDeceased = 'optionSpousePartner';
            formdata.ihtTotalNetValue = 0;
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content);
            expect(applicant2Name).to.equal(content.intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThan250k);
            done();
        });

        it('should return intestacyDeceasedMarriedSpouseApplyingHadChildren', (done) => {
            formdata.maritalStatus = 'optionMarried';
            formdata.relationshipToDeceased = 'optionSpousePartner';
            formdata.hadChildren = 'optionYes';
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content);
            expect(applicant2Name).to.equal(content.intestacyDeceasedMarriedSpouseApplyingHadChildren);
            done();
        });

        it('should return intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsAdopted', (done) => {
            formdata.maritalStatus = 'optionMarried';
            formdata.ihtTotalNetValue = 0;
            formdata.anyOtherChildren = 'optionYes';
            formdata.relationshipToDeceased = 'optionAdoptedChild';
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content);
            expect(applicant2Name).to.equal(content.intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsAdopted);
            done();
        });

        it('should return intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsNotAdopted', (done) => {
            formdata.maritalStatus = 'optionMarried';
            formdata.ihtTotalNetValue = 0;
            formdata.anyOtherChildren = 'optionYes';
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content);
            expect(applicant2Name).to.equal(content.intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasSiblingsIsNotAdopted);
            done();
        });

        it('should return intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsAdopted', (done) => {
            formdata.maritalStatus = 'optionMarried';
            formdata.ihtTotalNetValue = 0;
            formdata.anyOtherChildren = 'optionNo';
            formdata.relationshipToDeceased = 'optionAdoptedChild';
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content);
            expect(applicant2Name).to.equal(content.intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsAdopted);
            done();
        });

        it('should return intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsNotAdopted', (done) => {
            formdata.maritalStatus = 'optionMarried';
            formdata.ihtTotalNetValue = 0;
            formdata.anyOtherChildren = 'optionNo';
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content);
            expect(applicant2Name).to.equal(content.intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThan250kHasNoSiblingsIsNotAdopted);
            done();
        });

        it('should return intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsAdopted', (done) => {
            formdata.maritalStatus = 'optionMarried';
            formdata.ihtTotalNetValue = 500000;
            formdata.anyOtherChildren = 'optionYes';
            formdata.relationshipToDeceased = 'optionAdoptedChild';
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content);
            expect(applicant2Name).to.equal(content.intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsAdopted);
            done();
        });

        it('should return intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsNotAdopted', (done) => {
            formdata.maritalStatus = 'optionMarried';
            formdata.ihtTotalNetValue = 500000;
            formdata.anyOtherChildren = 'optionYes';
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content);
            expect(applicant2Name).to.equal(content.intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasSiblingsIsNotAdopted);
            done();
        });

        it('should return intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsAdopted', (done) => {
            formdata.maritalStatus = 'optionMarried';
            formdata.ihtTotalNetValue = 500000;
            formdata.anyOtherChildren = 'optionNo';
            formdata.relationshipToDeceased = 'optionAdoptedChild';
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content);
            expect(applicant2Name).to.equal(content.intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsAdopted);
            done();
        });

        it('should return intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsNotAdopted', (done) => {
            formdata.maritalStatus = 'optionMarried';
            formdata.ihtTotalNetValue = 500000;
            formdata.anyOtherChildren = 'optionNo';
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content);
            expect(applicant2Name).to.equal(content.intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThan250kHasNoSiblingsIsNotAdopted);
            done();
        });

        it('should return intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsAdopted', (done) => {
            formdata.maritalStatus = 'optionNotMarried';
            formdata.relationshipToDeceased = 'optionAdoptedChild';
            formdata.anyOtherChildren = 'optionYes';
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content);
            expect(applicant2Name).to.equal(content.intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsAdopted);
            done();
        });

        it('should return intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsNotAdopted', (done) => {
            formdata.maritalStatus = 'optionNotMarried';
            formdata.anyOtherChildren = 'optionYes';
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content);
            expect(applicant2Name).to.equal(content.intestacyDeceasedNotMarriedChildApplyingHasSiblingsIsNotAdopted);
            done();
        });

        it('should return intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsAdopted', (done) => {
            formdata.maritalStatus = 'optionNotMarried';
            formdata.anyOtherChildren = 'optionNo';
            formdata.relationshipToDeceased = 'optionAdoptedChild';
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content);
            expect(applicant2Name).to.equal(content.intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsAdopted);
            done();
        });

        it('should return intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsNotAdopted', (done) => {
            formdata.maritalStatus = 'optionNotMarried';
            formdata.anyOtherChildren = 'optionNo';
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content);
            expect(applicant2Name).to.equal(content.intestacyDeceasedNotMarriedChildApplyingHasNoSiblingsIsNotAdopted);
            done();
        });

        it('should replace {deceasedName} tag', (done) => {
            formdata.maritalStatus = 'optionMarried';
            formdata.relationshipToDeceased = 'optionSpousePartner';
            formdata.anyChildren = 'optionNo';
            formdata.deceasedName = 'Dee Ceased';
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content);
            expect(applicant2Name).to.equal(content.intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThan250k.replace(/{deceasedName}/g, formdata.deceasedName));
            done();
        });
    });
});
