'use strict';
const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const content = require('app/resources/en/translation/applicant/aliasreason');

describe('ApplicantAliasReason', () => {
    const ApplicantAliasReason = steps.ApplicantAliasReason;

    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ApplicantAliasReason.constructor.getUrl();
            expect(url).to.equal('/applicant-alias-reason');
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx;
        let errors;
        it('should delete otherReason when the aliasReason is not set to other', (done) => {
            ctx = {
                aliasReason: content.optionDivorce,
                otherReason: 'Because I wanted to'
            };
            errors = [];
            [ctx, errors] = ApplicantAliasReason.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({aliasReason: 'Divorce'});
            done();
        });

        it('should not remove otherReason from the ctx when the aliasReason is set to other', (done) => {
            ctx = {
                aliasReason: content.optionOther.toLowerCase(),
                otherReason: 'Because I wanted to'
            };
            errors = [];
            [ctx, errors] = ApplicantAliasReason.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                aliasReason: content.optionOther.toLowerCase(),
                otherReason: 'Because I wanted to'
            });
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx;
        let errors;
        it('should delete otherReason when the aliasReason is not set to other', (done) => {
            ctx = {
                aliasReason: content.optionDivorce,
                otherReason: 'Because I wanted to'
            };
            errors = [];
            [ctx, errors] = ApplicantAliasReason.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({aliasReason: 'Divorce'});
            done();
        });

        it('should not remove otherReason from the ctx when the aliasReason is set to other', (done) => {
            ctx = {
                aliasReason: content.optionOther.toLowerCase(),
                otherReason: 'Because I wanted to'
            };
            errors = [];
            [ctx, errors] = ApplicantAliasReason.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                aliasReason: content.optionOther.toLowerCase(),
                otherReason: 'Because I wanted to'
            });
            done();
        });
    });
});
