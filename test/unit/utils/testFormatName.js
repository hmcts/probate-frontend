'use strict';

const FormatName = require('app/utils/FormatName');
const expect = require('chai').expect;

describe('FormatName.js', () => {
    describe('format()', () => {
        it('should return a correctly formatted name when a person is given', (done) => {
            const executor = {firstName: 'James', lastName: 'Miller'};
            expect(FormatName.format(executor)).to.equal('James Miller');
            done();
        });

        it('should return a first name without trailing spaces when only a first name is given', (done) => {
            const executor = {firstName: 'James'};
            expect(FormatName.format(executor)).to.equal('James');
            done();
        });

        it('should return a last name without leading spaces when only a last name is given', (done) => {
            const executor = {lastName: 'Miller'};
            expect(FormatName.format(executor)).to.equal('Miller');
            done();
        });

        it('should return an empty string when a person is not given', (done) => {
            expect(FormatName.format()).to.equal('');
            done();
        });
    });

    describe('applicantWillName()', () => {
        it('should not return applicant alias when the person does have an alias', (done) => {
            const executor = {firstName: 'James', lastName: 'Miller', alias: 'Bob Alias'};
            expect(FormatName.applicantWillName(executor)).to.equal('James Miller');
            done();
        });

        it('should return a correctly formatted name when the person does not have an alias', (done) => {
            const executor = {firstName: 'James', lastName: 'Miller'};
            expect(FormatName.applicantWillName(executor)).to.equal('James Miller');
            done();
        });

        it('should return an empty string when a person is not given', (done) => {
            expect(FormatName.applicantWillName()).to.equal('');
            done();
        });
    });

    describe('applicantWillName()', () => {
        it('should return applicant name when the person does have an alias', (done) => {
            const executor = {firstName: 'James', lastName: 'Miller', alias: 'Bob Alias'};
            expect(FormatName.applicantWillName(executor)).to.equal('James Miller');
            done();
        });

        it('should return a correctly formatted name when the person does not have an alias', (done) => {
            const executor = {firstName: 'James', lastName: 'Miller'};
            expect(FormatName.applicantWillName(executor)).to.equal('James Miller');
            done();
        });

        it('should return an empty string when a person is not given', (done) => {
            expect(FormatName.applicantWillName()).to.equal('');
            done();
        });
    });

    describe('formatName()', () => {
        it('should return executors currentName when true passed as a parameter', (done) => {
            const person = {fullName: 'ed brown', hasOtherName: true, currentName: 'eddie brunt'};
            expect(FormatName.formatName(person, true)).to.equal('eddie brunt');
            done();
        });

        it('should return executors fullName when true not passed as a parameter', (done) => {
            const person = {fullName: 'ed brown', hasOtherName: true, currentName: 'eddie brunt'};
            expect(FormatName.formatName(person)).to.equal('ed brown');
            done();
        });

        it('should return executors fullName', (done) => {
            const person = {fullName: 'ed brown', hasOtherName: false};
            expect(FormatName.formatName(person, true)).to.equal('ed brown');
            done();
        });

        it('should return an empty string', (done) => {
            const person = {};
            expect(FormatName.formatName(person)).to.equal('');
            done();
        });
    });

    describe('getNameAndAddress()', () => {
        it('should return executors fullName and applicantAddress when isApplicant is true', (done) => {
            const person = {fullName: 'ed brown', isApplicant: true};
            const contentOf = 'of';
            const applicantAddress = {formattedAddress: '10 downing street'
            };
            expect(FormatName.getNameAndAddress(person, contentOf, applicantAddress)).to.equal(
                'ed brown of 10 downing street'
            );
            done();
        });

        it('should return executors currentName and applicantAddress when isApplicant is true and currentName is set', (done) => {
            const person = {
                fullName: 'ed brown', isApplicant: true, currentName: 'eddie brunt', hasOtherName: true
            };
            const contentOf = 'of';
            const applicantAddress = {formattedAddress: '10 downing street'
            };
            expect(FormatName.getNameAndAddress(person, contentOf, applicantAddress, true)).to.equal(
                'eddie brunt of 10 downing street'
            );
            done();
        });

        it('should return executors fullName and applicant.address when isApplicant is false', (done) => {
            const person = {fullName: 'ed brown',
                isApplicant: false,
                address: {formattedAddress: '4 waterloo street'}};
            const contentOf = 'of';
            const applicantAddress = {formattedAddress: '10 downing street'
            };
            expect(FormatName.getNameAndAddress(person, contentOf, applicantAddress)).to.equal(
                'ed brown of 4 waterloo street'
            );
            done();
        });

        it('should return executors currentName and applicant.address when isApplicant is false and currentName is set', (done) => {
            const person = {
                fullName: 'ed brown',
                isApplicant: false,
                currentName: 'eddie brunt',
                hasOtherName: true,
                address: {
                    formattedAddress: '4 waterloo street'}
            };
            const contentOf = 'of';
            const applicantAddress = {formattedAddress: '10 downing street'
            };
            expect(FormatName.getNameAndAddress(person, contentOf, applicantAddress, true)).to.equal(
                'eddie brunt of 4 waterloo street'
            );
            done();
        });

        it('should return only executors fullName when no address is passed', (done) => {
            const person = {fullName: 'ed brown'};
            expect(FormatName.getNameAndAddress(person)).to.equal('ed brown');
            done();
        });
    });

    describe('formatExecutorNames()', () => {
        it('should return ExecutorNames separated with ", " along with "and"', (done) => {
            const executors = [{fullName: 'ed brown'}, {fullName: 'jake smith'}, {fullName: 'bob smith'}
            ];
            expect(FormatName.formatExecutorNames(executors)).to.equal(
                'ed brown, jake smith and bob smith'
            );
            done();
        });

        it('should return ExecutorNames separated by "and" only', (done) => {
            const executors = [{fullName: 'ed brown'}, {fullName: 'bob smith'}
            ];
            expect(FormatName.formatExecutorNames(executors)).to.equal(
                'ed brown and bob smith'
            );
            done();
        });

        it('should return only the executor name without ", " or "and"', (done) => {
            const executors = [
                {fullName: 'ed brown'}
            ];
            expect(FormatName.formatExecutorNames(executors)).to.equal(
                'ed brown'
            );
            done();
        });
    });

    describe('formatMultipleNamesAndAddress()', () => {
        it('should return ExecutorNames and Addresses separated with ", " along with "and"', (done) => {
            const persons = [
                {fullName: 'ed brown', isApplicant: true},
                {fullName: 'jake smith',
                    address: {formattedAddress: '80 holt street'},
                    currentName: 'jacob marley',
                    hasOtherName: true},
                {fullName: 'bob smith', address: {formattedAddress: '4 green street'}}
            ];
            const content = {of: 'of', and: 'and'};
            const applicantAddress = {formattedAddress: '10 downing street'
            };
            expect(FormatName.formatMultipleNamesAndAddress(persons, content, applicantAddress, true)).to.equal(
                'ed brown of 10 downing street, jacob marley of 80 holt street and bob smith of 4 green street'
            );
            done();
        });

        it('should return Main Applicant and other Executor Names and Addresses separated by "and" only', (done) => {
            const persons = [
                {fullName: 'ed brown', address: {formattedAddress: '80 holt street'}, isApplicant: true},
                {fullName: 'bob smith', address: {formattedAddress: '4 green street'}}];
            const content = {of: 'of', and: 'and'};
            const applicantAddress = {formattedAddress: '10 downing street'};
            expect(FormatName.formatMultipleNamesAndAddress(persons, content, applicantAddress)).to.equal(
                'ed brown of 10 downing street and bob smith of 4 green street'
            );
            done();
        });

        it('should return ExecutorNames and Addresses separated by "and" only when no main applicant', (done) => {
            const persons = [
                {fullName: 'ed brown', address: {formattedAddress: '80 holt street'}},
                {fullName: 'bob smith', address: {formattedAddress: '4 green street'}}
            ];
            const content = {of: 'of', and: 'and'};
            const applicantAddress = {formattesAddress: '10 downing street'};
            expect(FormatName.formatMultipleNamesAndAddress(persons, content, applicantAddress)).to.equal(
                'ed brown of 80 holt street and bob smith of 4 green street'
            );
            done();
        });

        it('should return ExecutorNames separated by "and" only when no address or main applicant', (done) => {
            const persons = [
                {fullName: 'ed brown'},
                {fullName: 'bob smith'}
            ];
            const content = {of: 'of', and: 'and'};
            const applicantAddress = '10 downing street';
            expect(FormatName.formatMultipleNamesAndAddress(persons, content, applicantAddress)).to.equal(
                'ed brown and bob smith'
            );
            done();
        });

        it('should return only single executor name without ", " or "and" when no address are passed', (done) => {
            const persons = [
                {fullName: 'ed brown'}
            ];
            const content = {of: 'of', and: 'and'};
            const applicantAddress = '10 downing street';
            expect(FormatName.formatMultipleNamesAndAddress(persons, content, applicantAddress)).to.equal('ed brown');
            done();
        });

        it('should return only the main applicant name and address without ", " or "and"', (done) => {
            const persons = [
                {fullName: 'ed brown', isApplicant: true}
            ];
            const content = {of: 'of', and: 'and'};
            const applicantAddress = {formattedAddress: '10 downing street'};
            expect(FormatName.formatMultipleNamesAndAddress(persons, content, applicantAddress)).to.equal(
                'ed brown of 10 downing street'
            );
            done();
        });
    });

    describe('delimitNames()', () => {
        const separator = ', ';
        const contentAnd = 'and';
        it('should return ExecutorNames separated with ", " along with "and"', (done) => {
            const formattedNames = 'ed brown, jake smith, bob smith';
            expect(FormatName.delimitNames(formattedNames, separator, contentAnd)).to.equal(
                'ed brown, jake smith and bob smith'
            );
            done();
        });

        it('should return ExecutorNames separated by "and" only', (done) => {
            const formattedNames = 'ed brown, bob smith';
            expect(FormatName.delimitNames(formattedNames, separator, contentAnd)).to.equal(
                'ed brown and bob smith'
            );
            done();
        });

        it('should return only the executor name without ", " or "and"', (done) => {
            const formattedNames = 'ed brown';
            expect(FormatName.delimitNames(formattedNames, separator, contentAnd)).to.equal(
                'ed brown'
            );
            done();
        });
    });
});
