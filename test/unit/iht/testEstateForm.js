'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const IhtEstateForm = steps.IhtEstateForm;

describe('EstateForm', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = IhtEstateForm.constructor.getUrl();
            expect(url).to.equal('/estate-form');
            done();
        });
    });
    describe('nextStepOptions()', () => {
        it('should return the correct next step options', (done) => {
            const result = IhtEstateForm.nextStepOptions();
            expect(result).to.deep.equal({
                options: [{
                    key: 'ihtFormId',
                    value: 'optionIHT400',
                    choice: 'optionIHT400'
                },
                {
                    key: 'ihtFormId',
                    value: 'optionIHT205',
                    choice: 'optionIHT205'

                }]
            });
            done();
        });
    });

    describe('isComplete()', () => {
        it('should return incomplete for pre-threshold deaths when IHT400 is selected and HMRC letter is not yes', (done) => {
            const ctx = {
                ihtFormId: 'optionIHT400',
                hmrcLetterId: 'optionNo'
            };
            const formdata = {
                deceased: {
                    'dod-date': '2021-12-31'
                }
            };

            const result = IhtEstateForm.isComplete(ctx, formdata);
            expect(result).to.deep.equal([false, 'inProgress']);
            done();
        });

        it('should return complete for pre-threshold deaths when IHT400 is selected and HMRC letter is yes', (done) => {
            const ctx = {
                ihtFormId: 'optionIHT400',
                hmrcLetterId: 'optionYes'
            };
            const formdata = {
                deceased: {
                    'dod-date': '2021-12-31'
                }
            };

            const result = IhtEstateForm.isComplete(ctx, formdata);
            expect(result).to.deep.equal([true, 'inProgress']);
            done();
        });

        it('should return complete for pre-threshold deaths when IHT205 is selected', (done) => {
            const ctx = {
                ihtFormId: 'optionIHT205',
                hmrcLetterId: 'optionNo'
            };
            const formdata = {
                deceased: {
                    'dod-date': '2021-12-31'
                }
            };

            const result = IhtEstateForm.isComplete(ctx, formdata);
            expect(result).to.deep.equal([true, 'inProgress']);
            done();
        });
    });

});
