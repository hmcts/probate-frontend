'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const sinon = require('sinon');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const NewSubmittedToHmrc = steps.NewSubmittedToHmrc;

describe('NewSubmittedToHmrc', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            // Create a spy for the getUrl() method
            const getUrlSpy = sinon.spy(NewSubmittedToHmrc.constructor, 'getUrl');
            const url = NewSubmittedToHmrc.constructor.getUrl();
            // Assert that the method was called
            expect(getUrlSpy.called).to.equal(true);
            expect(url).to.equal('/new-submitted-to-hmrc');
            // Restore the spy
            getUrlSpy.restore();
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx;
        let formdata;
        let errors;

        it('should update ctx with optionIHT400 for optionYes', () => {
            ctx = {
                ihtFormEstateId: 'initialValue',
                estateValueCompleted: 'optionYes',
            };
            formdata = {
                iht: {
                    ihtFormEstateId: 'initialValue',
                    estateValueCompleted: 'initialOption',
                },
            };
            errors = [];

            NewSubmittedToHmrc.handlePost(ctx, errors, formdata, {language: 'en'});

            // Assert the expected changes in ctx
            expect(ctx).to.deep.equal({
                ihtFormEstateId: 'optionIHT400',
                estateValueCompleted: 'optionYes', // Expected change
            });

            // Assert other expectations (e.g., errors array, no string replacement)

            // You may not need done() for synchronous tests
        });

        it('should update ctx with excepted estate for optionNo', () => {
            ctx = {
                ihtFormEstateId: 'initialValue',
                estateValueCompleted: 'optionNo',
            };
            formdata = {
                iht: {
                    ihtFormEstateId: 'initialValue',
                    estateValueCompleted: 'initialOption',
                },
            };
            errors = [];

            NewSubmittedToHmrc.handlePost(ctx, errors, formdata, {language: 'en'});

            // Assert the expected changes in ctx
            expect(ctx).to.deep.equal({
                ihtFormEstateId: 'initialValue',
                estateValueCompleted: 'optionNo', // Expected change
            });
        });
    });
    describe('nextStepOptions()', () => {
        it('should return the correct next step options', (done) => {
            const result = NewSubmittedToHmrc.nextStepOptions();
            expect(result).to.deep.equal({
                options: [{
                    key: 'estateValueCompleted',
                    value: 'optionYes',
                    choice: 'optionIHT400'
                }]
            });
            done();
        });
    });
    describe('isComplete()', () => {
        it('should return the complete when have estateValueCompleted', (done) => {
            const ctx = {
                estateValueCompleted: 'optionYes'
            };
            const result = NewSubmittedToHmrc.isComplete(ctx);
            const expectedTrue = [true, 'inProgress'];
            expect(result).to.deep.equal(expectedTrue);
            done();
        });
        it('should return complete false when no estateValueCompleted', (done) => {
            const ctx = {
            };
            const result = NewSubmittedToHmrc.isComplete(ctx);
            const expectedFalse = [false, 'inProgress'];
            expect(result).to.deep.equal(expectedFalse);
            done();
        });
    });
});
