'use strict';

const {expect} = require('chai');
const FormatCcdCaseId = require('app/utils/FormatCcdCaseId');

describe('FormatCcdCaseId', () => {
    describe('format()', () => {
        it('should return an empty string when a ccd case id is not given', (done) => {
            const ccdCase = {
                state: 'CaseCreated'
            };

            const ccdCaseId = FormatCcdCaseId.format(ccdCase);
            expect(ccdCaseId).to.equal('');
            done();
        });

        it('should return an empty string when a ccd case state is not given', (done) => {
            const ccdCase = {
                id: '1234-5678-9012-3456'
            };
            const ccdCaseId = FormatCcdCaseId.format(ccdCase);
            expect(ccdCaseId).to.equal('');
            done();
        });

        it('should return the correctly formatted ccd case id when the ccd case id is given with dashes', (done) => {
            const ccdCase = {
                id: '1234-5678-9012-3456',
                state: 'CaseCreated'
            };
            const ccdCaseId = FormatCcdCaseId.format(ccdCase);
            expect(ccdCaseId).to.equal('1234-5678-9012-3456');
            done();
        });

        it('should return the correctly formatted ccd case id when the ccd case id is given without dashes', (done) => {
            const ccdCase = {
                id: '1234567890123456',
                state: 'CaseCreated'
            };
            const ccdCaseId = FormatCcdCaseId.format(ccdCase);
            expect(ccdCaseId).to.equal('1234-5678-9012-3456');
            done();
        });

        it('should return the correctly formatted ccd case id when the ccd case id is given as an integer', (done) => {
            const ccdCase = {
                id: 1234567890123456,
                state: 'CaseCreated'
            };
            const ccdCaseId = FormatCcdCaseId.format(ccdCase);
            expect(ccdCaseId).to.equal('1234-5678-9012-3456');
            done();
        });
    });
});
