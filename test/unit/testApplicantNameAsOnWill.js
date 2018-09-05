'use strict';
const initSteps = require('app/core/initSteps');
const chai = require('chai');
const expect = chai.expect;
const content = require('app/resources/en/translation/applicant/nameasonwill');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const ApplicantNameAsOnWill = steps.ApplicantNameAsOnWill;

describe('ApplicantNameAsOnWill', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ApplicantNameAsOnWill.constructor.getUrl();
            expect(url).to.equal('/applicant-name-as-on-will');
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx;
        let errors;

        it('should return the ctx with the alias and alias reason included', (done) => {
            ctx = {
                nameAsOnTheWill: 'No',
                alias: 'Bobby Alias',
                aliasReason: 'Divorce'
            };
            errors = {};
            [ctx, errors] = ApplicantNameAsOnWill.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                nameAsOnTheWill: 'No',
                alias: 'Bobby Alias',
                aliasReason: 'Divorce'
            });
            done();
        });

        it('should return the ctx with the alias, alias reason and other reason included when reason is other', (done) => {
            ctx = {
                nameAsOnTheWill: 'No',
                alias: 'Bobby Alias',
                aliasReason: 'other',
                otherReason: 'Legally changed name'
            };
            errors = {};
            [ctx, errors] = ApplicantNameAsOnWill.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                nameAsOnTheWill: 'No',
                alias: 'Bobby Alias',
                aliasReason: 'other',
                otherReason: 'Legally changed name'
            });
            done();
        });

        it('should return the ctx with the alias and alias reason removed', (done) => {
            ctx = {
                nameAsOnTheWill: 'Yes',
                alias: 'Bobby Alias',
                aliasReason: 'Divorce'
            };
            errors = {};
            [ctx, errors] = ApplicantNameAsOnWill.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({nameAsOnTheWill: 'Yes'});
            done();
        });

        it('should return the ctx with the alias, alias reason and other reason removed when reason is other', (done) => {
            ctx = {
                nameAsOnTheWill: 'Yes',
                alias: 'Bobby Alias',
                aliasReason: 'other',
                otherReason: 'Legally changed name'
            };
            errors = {};
            [ctx, errors] = ApplicantNameAsOnWill.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({nameAsOnTheWill: 'Yes'});
            done();
        });
    describe('nextStepOptions()', () => {
        it('should return the correct next step options', (done) => {
            const result = ApplicantNameAsOnWill.nextStepOptions();
            expect(result).to.deep.equal({
                options: [{
                    key: 'nameAsOnTheWill',
                    value: content.optionNo,
                    choice: 'hasAlias'
                }]
            });
            done();
        });
    describe('handlePost()', () => {
        let ctx;
        let errors;

        it('should return the ctx with the alias and alias reason included', (done) => {
            ctx = {
                nameAsOnTheWill: 'No',
                alias: 'Bobby Alias',
                aliasReason: 'Divorce'
            };
            errors = {};
            [ctx, errors] = ApplicantNameAsOnWill.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                nameAsOnTheWill: 'No',
                alias: 'Bobby Alias',
                aliasReason: 'Divorce'
            });
            done();
        });

        it('should return the ctx with the alias, alias reason and other reason included when reason is other', (done) => {
            ctx = {
                nameAsOnTheWill: 'No',
                alias: 'Bobby Alias',
                aliasReason: 'other',
                otherReason: 'Legally changed name'
            };
            errors = {};
            [ctx, errors] = ApplicantNameAsOnWill.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                nameAsOnTheWill: 'No',
                alias: 'Bobby Alias',
                aliasReason: 'other',
                otherReason: 'Legally changed name'
            });
            done();
        });

        it('should return the ctx with the alias and alias reason removed', (done) => {
            ctx = {
                nameAsOnTheWill: 'Yes',
                alias: 'Bobby Alias',
                aliasReason: 'Divorce'
            };
            errors = {};
            [ctx, errors] = ApplicantNameAsOnWill.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({nameAsOnTheWill: 'Yes'});
            done();
        });

        it('should return the ctx with the alias, alias reason and other reason removed when reason is other', (done) => {
            ctx = {
                nameAsOnTheWill: 'Yes',
                alias: 'Bobby Alias',
                aliasReason: 'other',
                otherReason: 'Legally changed name'
            };
            errors = {};
            [ctx, errors] = ApplicantNameAsOnWill.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({nameAsOnTheWill: 'Yes'});
            done();
        });
    });
});
