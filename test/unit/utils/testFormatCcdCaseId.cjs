'use strict';

const expect = require('chai').expect;
const FormatCcdCaseId = require('app/utils/FormatCcdCaseId');

describe('FormatCcdCaseId', () => {
    describe('format()', () => {
        it('should return an empty string when a ccd case id is not given', (done) => {
            const ccdCase = {
                state: 'CasePrinted'
            };

            const ccdCaseId = FormatCcdCaseId.format(ccdCase);
            expect(ccdCaseId).to.equal('');
            done();
        });

        it('should return the correctly formatted ccd case id when the ccd case id is given with dashes', (done) => {
            const ccdCase = {
                id: '1234-5678-9012-3456',
                state: 'CasePrinted'
            };
            const ccdCaseId = FormatCcdCaseId.format(ccdCase);
            expect(ccdCaseId).to.equal('1234-5678-9012-3456');
            done();
        });

        it('should return the correctly formatted ccd case id when the ccd case id is given without dashes', (done) => {
            const ccdCase = {
                id: '1234567890123456',
                state: 'CasePrinted'
            };
            const ccdCaseId = FormatCcdCaseId.format(ccdCase);
            expect(ccdCaseId).to.equal('1234-5678-9012-3456');
            done();
        });

        it('should return the correctly formatted ccd case id when the ccd case id is given as an integer', (done) => {
            const ccdCase = {
                id: 1234567890123456,
                state: 'CasePrinted'
            };
            const ccdCaseId = FormatCcdCaseId.format(ccdCase);
            expect(ccdCaseId).to.equal('1234-5678-9012-3456');
            done();
        });
    });

    describe('formatAccessible()', () => {
        it('should return an empty string when a ccd case id is not given', (done) => {
            const ccdCase = {
                state: 'CasePrinted'
            };

            const ccdCaseId = FormatCcdCaseId.formatAccessible(ccdCase);
            expect(ccdCaseId).to.equal('');
            done();
        });

        it('should return the correctly formatted ccd case id when the ccd case id is given with dashes', (done) => {
            const ccdCase = {
                id: '1234-5678-9012-3456',
                state: 'CasePrinted'
            };
            const ccdCaseId = FormatCcdCaseId.formatAccessible(ccdCase);
            expect(ccdCaseId).to.equal('1 2 3 4, -, 5 6 7 8, -, 9 0 1 2, -, 3 4 5 6');
            done();
        });

        it('should return the correctly formatted ccd case id when the ccd case id is given without dashes', (done) => {
            const ccdCase = {
                id: '1234567890123456',
                state: 'CasePrinted'
            };
            const ccdCaseId = FormatCcdCaseId.formatAccessible(ccdCase);
            expect(ccdCaseId).to.equal('1 2 3 4, -, 5 6 7 8, -, 9 0 1 2, -, 3 4 5 6');
            done();
        });

        it('should return the correctly formatted ccd case id when the ccd case id is given as an integer', (done) => {
            const ccdCase = {
                id: 1234567890123456,
                state: 'CasePrinted'
            };
            const ccdCaseId = FormatCcdCaseId.formatAccessible(ccdCase);
            expect(ccdCaseId).to.equal('1 2 3 4, -, 5 6 7 8, -, 9 0 1 2, -, 3 4 5 6');
            done();
        });
    });
});
