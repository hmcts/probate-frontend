'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const content = require('app/resources/en/translation/executors/newmentalcapacity');
const rewire = require('rewire');
const sinon = require('sinon');
const schema = require('app/steps/ui/executors/newmentalcapacity/schema');
const newMentalCapacity = rewire('app/steps/ui/executors/newmentalcapacity/index');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const NewMentalCapacity = steps.NewMentalCapacity;

describe('NewMentalCapacity', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = NewMentalCapacity.constructor.getUrl();
            expect(url).to.equal('/new-mental-capacity');
            done();
        });
    });

    describe('handlePost()', () => {
        it('should remove the formdata from the session', (done) => {
            const ctx = {};
            const errors = {};
            const formdata = {};
            const session = {
                form: {}
            };
            NewMentalCapacity.handlePost(ctx, errors, formdata, session);
            expect(session).to.deep.equal({});
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when Yes is given', (done) => {
            const ctx = {mentalCapacity: content.optionYes};
            const nextStepUrl = NewMentalCapacity.nextStepUrl(ctx);
            expect(nextStepUrl).to.equal('/new-start-apply');
            done();
        });

        it('should return the correct url when No is given', (done) => {
            const ctx = {mentalCapacity: content.optionNo};
            const nextStepUrl = NewMentalCapacity.nextStepUrl(ctx);
            expect(nextStepUrl).to.equal('/stop-page/mentalCapacity');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = NewMentalCapacity.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'mentalCapacity',
                    value: content.optionYes,
                    choice: 'isCapable'
                }]
            });
            done();
        });
    });

    describe('persistFormData()', () => {
        it('should return an empty object', () => {
            const result = NewMentalCapacity.persistFormData();
            expect(result).to.deep.equal({});
        });
    });

    describe('setEligibilityCookie()', () => {
        it('should call eligibilityCookie.setCookie() with the correct params', (done) => {
            const revert = newMentalCapacity.__set__('eligibilityCookie', {setCookie: sinon.spy()});
            const req = {reqParam: 'req value'};
            const res = {resParam: 'res value'};
            const nextStepUrl = '/stop-page/mentalCapacity';
            const steps = {};
            const section = null;
            const resourcePath = 'executors/newmentalcapacity';
            const i18next = {};
            const newMenCap = new newMentalCapacity(steps, section, resourcePath, i18next, schema);

            newMenCap.setEligibilityCookie(req, res, nextStepUrl);

            expect(newMentalCapacity.__get__('eligibilityCookie.setCookie').calledOnce).to.equal(true);
            expect(newMentalCapacity.__get__('eligibilityCookie.setCookie').calledWith(
                {reqParam: 'req value'},
                {resParam: 'res value'},
                '/stop-page/mentalCapacity'
            )).to.equal(true);

            revert();
            done();
        });
    });
});
