'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const ApplicantNameAsOnWill = steps.ApplicantNameAsOnWill;

describe('ApplicantNameAsOnWill', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ApplicantNameAsOnWill.constructor.getUrl();
            expect(url).to.equal('/applicant-name-as-on-will*');
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx;
        let errors;

        it('should return the ctx with the alias and alias reason included', (done) => {
            ctx = {
                nameAsOnTheWill: 'optionNo',
                alias: 'Bobby Alias',
                aliasReason: 'optionDivorce'
            };
            errors = [];
            [ctx, errors] = ApplicantNameAsOnWill.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                nameAsOnTheWill: 'optionNo',
                alias: 'Bobby Alias',
                aliasReason: 'optionDivorce'
            });
            done();
        });

        it('should return the ctx with the alias, alias reason and other reason included when reason is other', (done) => {
            ctx = {
                nameAsOnTheWill: 'optionNo',
                alias: 'Bobby Alias',
                aliasReason: 'optionOther',
                otherReason: 'Legally changed name'
            };
            errors = [];
            [ctx, errors] = ApplicantNameAsOnWill.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                nameAsOnTheWill: 'optionNo',
                alias: 'Bobby Alias',
                aliasReason: 'optionOther',
                otherReason: 'Legally changed name'
            });
            done();
        });

        it('should return the ctx with the alias and alias reason removed', (done) => {
            ctx = {
                nameAsOnTheWill: 'optionYes',
                alias: 'Bobby Alias',
                aliasReason: 'Divorce'
            };
            errors = [];
            [ctx, errors] = ApplicantNameAsOnWill.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({nameAsOnTheWill: 'optionYes'});
            done();
        });

        it('should return the ctx with the alias, alias reason and other reason removed when reason is other', (done) => {
            ctx = {
                nameAsOnTheWill: 'optionYes',
                alias: 'Bobby Alias',
                aliasReason: 'optionOther',
                otherReason: 'Legally changed name'
            };
            errors = [];
            [ctx, errors] = ApplicantNameAsOnWill.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({nameAsOnTheWill: 'optionYes'});
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct next step options', (done) => {
            const result = ApplicantNameAsOnWill.nextStepOptions();
            expect(result).to.deep.equal({
                options: [{
                    key: 'nameAsOnTheWill',
                    value: 'optionNo',
                    choice: 'hasAlias'
                }]
            });
            done();
        });
    });

    describe('action()', () => {
        it('test that the Value of Assets Outside England and Wales context variables are removed if No Assets Outside chosen', () => {
            let formdata = {};
            let ctx = {
                nameAsOnTheWill: 'optionYes',
                alias: 'Applicant Alias',
                aliasReason: 'optionMarriage'
            };
            [ctx, formdata] = ApplicantNameAsOnWill.action(ctx, formdata);
            expect(ctx).to.deep.equal({
                nameAsOnTheWill: 'optionYes'
            });
        });
    });
});
