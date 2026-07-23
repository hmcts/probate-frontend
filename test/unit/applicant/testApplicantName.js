'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const ApplicantName = steps.ApplicantName;

describe('ApplicantName', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ApplicantName.constructor.getUrl();
            expect(url).to.equal('/applicant-name');
            done();
        });
    });
    describe('handlePost()', () => {
        let ctx;
        let errors;
        let formdata;
        const session = {};
        it('should return the error when first name is less than 2 characters', (done) => {
            ctx = {
                'firstName': 'a',
                'lastName': 'abc'
            };
            errors = [];
            [ctx, errors] = ApplicantName.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'firstName',
                    href: '#firstName',
                    msg: 'First name must be 2 characters or more',
                }
            ]);
            done();
        });
        it('should return the error when last name is less than 2 characters', (done) => {
            ctx = {
                'firstName': 'abc',
                'lastName': 'a'
            };
            errors = [];
            [ctx, errors] = ApplicantName.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'lastName',
                    href: '#lastName',
                    msg: 'Last name must be 2 characters or more',
                }
            ]);
            done();
        });
        it('should return the error when last name is more than 100 characters', (done) => {
            ctx = {
                'firstName': 'abc',
                'lastName': 'ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXY'
            };
            errors = [];
            [ctx, errors] = ApplicantName.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'lastName',
                    href: '#lastName',
                    msg: 'Last name must be 100 characters or less',
                }
            ]);
            done();
        });
        it('should return the error when first name is more than 100 characters', (done) => {
            ctx = {
                'firstName': 'ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXY',
                'lastName': 'abc'
            };
            errors = [];
            [ctx, errors] = ApplicantName.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'firstName',
                    href: '#firstName',
                    msg: 'First name must be 100 characters or less',
                }
            ]);
            done();
        });
    });
});
