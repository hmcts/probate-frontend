'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const DeceasedAddress = steps.DeceasedAddress;

describe('DeceasedAddress', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedAddress.constructor.getUrl();
            expect(url).to.equal('/deceased-address');
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx;
        let errors;
        let formdata;
        let session;
        let hostname;
        let featureToggles;

        it('should return the ctx with the deceased address and the screening_question feature toggle', (done) => {
            ctx = {
                freeTextAddress: '143 Caerfai Bay Road',
                postcode: 'L23 6WW'
            };
            errors = {};
            [ctx, errors] = DeceasedAddress.handlePost(ctx, errors, formdata, session, hostname, featureToggles);
            expect(ctx).to.deep.equal({
                freeTextAddress: '143 Caerfai Bay Road',
                address: '143 Caerfai Bay Road',
                postcode: 'L23 6WW',
                isScreeningQuestionsToggleEnabled: false,
                isDocumentUploadToggleEnabled: false
            });
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = DeceasedAddress.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'isDocumentUploadToggleEnabled', value: true, choice: 'documentUploadToggleOn'},
                    {key: 'isScreeningQuestionsToggleEnabled', value: true, choice: 'toggleOn'},
                ]
            });
            done();
        });
    });

    describe('action', () => {
        it('test isToggleEnabled is removed from the context', () => {
            const ctxToTest = {
                isScreeningQuestionsToggleEnabled: false,
                isDocumentUploadToggleEnabled: false
            };
            const [ctx] = DeceasedAddress.action(ctxToTest);
            expect(ctx).to.not.include.key('isScreeningQuestionsToggleEnabled');
            expect(ctx).to.not.include.key('isDocumentUploadToggleEnabled');
        });
    });
});
