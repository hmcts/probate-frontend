'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const DeceasedName = steps.DeceasedName;
describe('DeceasedName', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedName.constructor.getUrl();
            expect(url).to.equal('/deceased-name');
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx;
        let errors;
        let formdata;
        const session = {};
        it('should return the error when first name is missing', (done) => {
            ctx = {
                'firstName': 'a',
                'lastName': 'abc'
            };
            errors = [];
            [ctx, errors] = DeceasedName.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'firstName',
                    href: '#firstName',
                    msg: 'First name must be 2 characters or more',
                }
            ]);
            done();
        });
        it('should return the error when last name is missing', (done) => {
            ctx = {
                'firstName': 'abc',
                'lastName': 'a'
            };
            errors = [];
            [ctx, errors] = DeceasedName.handlePost(ctx, errors, formdata, session);
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
            [ctx, errors] = DeceasedName.handlePost(ctx, errors, formdata, session);
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
            [ctx, errors] = DeceasedName.handlePost(ctx, errors, formdata, session);
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

    describe('action()', () => {
        it('test it cleans up context', () => {
            const ctx = {
                index: 3683
            };
            DeceasedName.action(ctx);
            assert.isUndefined(ctx.index);
        });
    });

    describe('shouldHaveBackLink()', () => {
        it('should have a back link', (done) => {
            const actual = DeceasedName.shouldHaveBackLink();
            expect(actual).to.equal(true);
            done();
        });
    });

});
