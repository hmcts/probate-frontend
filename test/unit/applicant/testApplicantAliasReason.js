'use strict';
const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);

describe('ApplicantAliasReason', () => {
    const ApplicantAliasReason = steps.ApplicantAliasReason;

    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ApplicantAliasReason.constructor.getUrl();
            expect(url).to.equal('/applicant-alias-reason*');
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx;
        let errors;
        it('should delete otherReason when the aliasReason is not set to other', (done) => {
            ctx = {
                aliasReason: 'optionDivorce',
                otherReason: 'Because I wanted to'
            };
            errors = [];
            [ctx, errors] = ApplicantAliasReason.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({aliasReason: 'optionDivorce'});
            done();
        });

        it('should not remove otherReason from the ctx when the aliasReason is set to optionOther', (done) => {
            ctx = {
                aliasReason: 'optionOther',
                otherReason: 'Because I wanted to'
            };
            errors = [];
            [ctx, errors] = ApplicantAliasReason.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                aliasReason: 'optionOther',
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
                aliasReason: 'optionDivorce',
                otherReason: 'Because I wanted to'
            };
            errors = [];
            [ctx, errors] = ApplicantAliasReason.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({aliasReason: 'optionDivorce'});
            done();
        });

        it('should not remove otherReason from the ctx when the aliasReason is set to other', (done) => {
            ctx = {
                aliasReason: 'optionOther',
                otherReason: 'Because I wanted to'
            };
            errors = [];
            [ctx, errors] = ApplicantAliasReason.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                aliasReason: 'optionOther',
                otherReason: 'Because I wanted to'
            });
            done();
        });
    });
});
