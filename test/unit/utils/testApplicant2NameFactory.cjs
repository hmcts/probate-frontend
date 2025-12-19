'use strict';

const content = require('app/resources/en/translation/declaration');
const expect = require('chai').expect;
const applicant2NameFactory = require('app/utils/Applicant2NameFactory.cjs');

describe('Applicant2NameFactory', () => {
    let formdata;

    beforeEach (() => {
        formdata = {};
        formdata.deceasedName = '{deceasedName}';
    });

    describe('getApplicant2Name()', () => {
        it('should return intestacyDeceasedMarriedSpouseApplyingHadNoChildren', (done) => {
            formdata.maritalStatus = 'optionMarried';
            formdata.relationshipToDeceased = 'optionSpousePartner';
            formdata.anyChildren = 'optionNo';
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content);
            expect(applicant2Name).to.equal(content.intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThanIhtThreshold);
            done();
        });

        it('should return intestacyDeceasedMarriedSpouseApplyingEstateLessThanIhtThreshold', (done) => {
            formdata.maritalStatus = 'optionMarried';
            formdata.relationshipToDeceased = 'optionSpousePartner';
            formdata.ihtTotalNetValue = 0;
            const threshold = 250000;
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content, threshold);
            expect(applicant2Name).to.equal(content.intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThanIhtThreshold);
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

        it('should return intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasSiblingsIsAdopted', (done) => {
            formdata.maritalStatus = 'optionMarried';
            formdata.ihtTotalNetValue = 0;
            formdata.anyOtherChildren = 'optionYes';
            formdata.relationshipToDeceased = 'optionAdoptedChild';
            const threshold = 250000;
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content, threshold);
            expect(applicant2Name).to.equal(content.intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasSiblingsIsAdopted);
            done();
        });

        it('should return intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasSiblingsIsNotAdopted', (done) => {
            formdata.maritalStatus = 'optionMarried';
            formdata.ihtTotalNetValue = 0;
            formdata.anyOtherChildren = 'optionYes';
            const threshold = 250000;
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content, threshold);
            expect(applicant2Name).to.equal(content.intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasSiblingsIsNotAdopted);
            done();
        });

        it('should return intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasNoSiblingsIsAdopted', (done) => {
            formdata.maritalStatus = 'optionMarried';
            formdata.ihtTotalNetValue = 0;
            formdata.anyOtherChildren = 'optionNo';
            formdata.relationshipToDeceased = 'optionAdoptedChild';
            const threshold = 250000;
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content, threshold);
            expect(applicant2Name).to.equal(content.intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasNoSiblingsIsAdopted);
            done();
        });

        it('should return intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasNoSiblingsIsNotAdopted', (done) => {
            formdata.maritalStatus = 'optionMarried';
            formdata.ihtTotalNetValue = 0;
            formdata.anyOtherChildren = 'optionNo';
            const threshold = 250000;
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content, threshold);
            expect(applicant2Name).to.equal(content.intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateLessThanIhtThresholdHasNoSiblingsIsNotAdopted);
            done();
        });

        it('should return intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasSiblingsIsAdopted', (done) => {
            formdata.maritalStatus = 'optionMarried';
            formdata.ihtTotalNetValue = 500000;
            formdata.anyOtherChildren = 'optionYes';
            formdata.relationshipToDeceased = 'optionAdoptedChild';
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content);
            expect(applicant2Name).to.equal(content.intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasSiblingsIsAdopted);
            done();
        });

        it('should return intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasSiblingsIsNotAdopted', (done) => {
            formdata.maritalStatus = 'optionMarried';
            formdata.ihtTotalNetValue = 500000;
            formdata.anyOtherChildren = 'optionYes';
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content);
            expect(applicant2Name).to.equal(content.intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasSiblingsIsNotAdopted);
            done();
        });

        it('should return intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasNoSiblingsIsAdopted', (done) => {
            formdata.maritalStatus = 'optionMarried';
            formdata.ihtTotalNetValue = 500000;
            formdata.anyOtherChildren = 'optionNo';
            formdata.relationshipToDeceased = 'optionAdoptedChild';
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content);
            expect(applicant2Name).to.equal(content.intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasNoSiblingsIsAdopted);
            done();
        });

        it('should return intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasNoSiblingsIsNotAdopted', (done) => {
            formdata.maritalStatus = 'optionMarried';
            formdata.ihtTotalNetValue = 500000;
            formdata.anyOtherChildren = 'optionNo';
            const applicant2Name = applicant2NameFactory.getApplicant2Name(formdata, content);
            expect(applicant2Name).to.equal(content.intestacyDeceasedMarriedSpouseRenouncingChildApplyingEstateMoreThanIhtThresholdHasNoSiblingsIsNotAdopted);
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
            expect(applicant2Name).to.equal(content.intestacyDeceasedMarriedSpouseApplyingHadNoChildrenOrEstateLessThanIhtThreshold.replace(/{deceasedName}/g, formdata.deceasedName));
            done();
        });
    });
});
