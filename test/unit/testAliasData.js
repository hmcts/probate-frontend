'use strict';
const AliasData = require('app/utils/AliasData.js');
const expect = require('chai').expect;

describe('AliasData.js', () => {

    describe('aliasDataRequiredAfterDeclaration()', () => {
        let formdata;
        let ctx;
        it('should return formdata with declarationCheckbox removed and hasDataChanged flag updated when declared and alias section updated after declaration', (done) => {
            formdata = {
                declaration: {
                    declarationCheckbox: true
                },
                applicant: {
                    nameAsOnTheWill: 'No',
                    alias: 'Bob Builder',
                },
                executors: {
                    alias: 'Yes',
                    hasOtherName: true,
                    currentNameReason: 'Marriage'
                }
            };
            ctx = {
                aliasReason: 'Divorce'
            };
            const result = AliasData.aliasDataRequiredAfterDeclaration(ctx, formdata);
            expect(result).to.deep.equal({
                declaration: {
                    hasDataChanged: true
                },
                applicant: {
                    nameAsOnTheWill: 'No',
                    alias: 'Bob Builder',
                },
                executors: {
                    alias: 'Yes',
                    hasOtherName: true,
                    currentNameReason: 'Marriage'
                }
            });
            done();
        });

        it('should return formdata with declarationCheckbox removed and hasDataChanged flag updated when declared and executors currentNameReason section updated after declaration', (done) => {
            formdata = {
                declaration: {
                    declarationCheckbox: true
                },
                applicant: {
                    nameAsOnTheWill: 'No',
                    alias: 'Bob Builder',
                },
                executors: {
                    list: [
                        {currentName: 'dave'}
                    ],
                    alias: 'Yes',
                    hasOtherName: true,
                }
            };
            ctx = {
                index: 1,
                currentNameReason: 'Divorce'
            };
            const result = AliasData.aliasDataRequiredAfterDeclaration(ctx, formdata);
            expect(result).to.deep.equal({
                applicant: {
                    alias: 'Bob Builder',
                    nameAsOnTheWill: 'No'
                },
                declaration: {
                    hasDataChanged: true
                },
                executors: {
                    alias: 'Yes',
                    hasOtherName: true,
                    list: [
                        {
                            currentName: 'dave'
                        }
                    ]
                }
            });
            done();
        });

        it('should return formdata unchanged when declared but neither alias or otherReason sections updated after declaration', (done) => {
            formdata = {
                declaration: {
                    declarationCheckbox: true
                },
                applicant: {
                    nameAsOnTheWill: 'No',
                }
            };
            ctx = {};
            formdata = AliasData.aliasDataRequiredAfterDeclaration(ctx, formdata);
            expect(formdata).to.deep.equal({
                declaration: {
                    declarationCheckbox: true
                },
                applicant: {
                    nameAsOnTheWill: 'No',
                }
            });
            done();
        });
    });

    describe('applicantAliasUpdated()', () => {
        let formdata;
        let ctx;
        it('should return true', (done) => {
            formdata = {
                applicant: {
                    nameAsOnTheWill: 'No',
                }
            };
            ctx = {
                alias: 'Bob Builder'
            };
            const result = AliasData.applicantAliasUpdated(ctx, formdata);
            expect(result).to.equal(true);
            done();
        });

        it('should return false', (done) => {
            formdata = {
                applicant: {
                    nameAsOnTheWill: 'No',
                    alias: 'Bob Builder'
                }
            };
            ctx = {
                alias: 'Bob Builder'
            };
            const result = AliasData.applicantAliasUpdated(ctx, formdata);
            expect(result).to.equal(false);
            done();
        });
    });

    describe('applicantAliasReasonUpdated()', () => {
        let formdata;
        let ctx;
        it('should return true', (done) => {
            formdata = {
                applicant: {
                    nameAsOnTheWill: 'No',
                    alias: 'Bob Builder'
                }
            };
            ctx = {
                aliasReason: 'Divorce'
            };
            const result = AliasData.applicantAliasReasonUpdated(ctx, formdata);
            expect(result).to.equal(true);
            done();
        });

        it('should return false', (done) => {
            formdata = {
                applicant: {
                    nameAsOnTheWill: 'No',
                    alias: 'Bob Builder',
                    aliasReason: 'Marriage'
                }
            };
            ctx = {
                aliasReason: 'Marriage'
            };
            const result = AliasData.applicantAliasReasonUpdated(ctx, formdata);
            expect(result).to.equal(false);
            done();
        });
    });

    describe('resetDelcaration()', () => {
        let formdata;
        it('delete the declarationCheckbox and set hasDataChanged to true', (done) => {
            formdata = {
                declaration: {
                    declarationCheckbox: true,
                    hasDataChanged: false
                }
            };
            formdata = AliasData.resetDeclaration(formdata);
            expect(formdata).to.deep.equal({
                declaration: {
                    hasDataChanged: true
                }
            });
            done();
        });
    });
});
