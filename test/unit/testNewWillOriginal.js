'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const content = require('app/resources/en/translation/will/neworiginal');
const rewire = require('rewire');
const sinon = require('sinon');
const schema = require('app/steps/ui/will/neworiginal/schema');
const newWillOriginal = rewire('app/steps/ui/will/neworiginal/index');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const NewWillOriginal = steps.NewWillOriginal;

describe('NewWillOriginal', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = NewWillOriginal.constructor.getUrl();
            expect(url).to.equal('/new-will-original');
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when Yes is given', (done) => {
            const ctx = {original: content.optionYes};
            const nextStepUrl = NewWillOriginal.nextStepUrl(ctx);
            expect(nextStepUrl).to.equal('/new-applicant-executor');
            done();
        });

        it('should return the correct url when No is given', (done) => {
            const ctx = {original: content.optionNo};
            const nextStepUrl = NewWillOriginal.nextStepUrl(ctx);
            expect(nextStepUrl).to.equal('/stop-page/notOriginal');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = NewWillOriginal.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'original',
                    value: content.optionYes,
                    choice: 'isOriginal'
                }]
            });
            done();
        });
    });

    describe('persistFormData()', () => {
        it('should return an empty object', () => {
            const result = NewWillOriginal.persistFormData();
            expect(result).to.deep.equal({});
        });
    });

    describe('setEligibilityCookie()', () => {
        it('should call eligibilityCookie.setCookie() with the correct params', (done) => {
            const revert = newWillOriginal.__set__('eligibilityCookie', {setCookie: sinon.spy()});
            const req = {reqParam: 'req value'};
            const res = {resParam: 'res value'};
            const nextStepUrl = '/stop-page/notOriginal';
            const steps = {};
            const section = null;
            const resourcePath = 'will/neworiginal';
            const i18next = {};
            const newWilOri = new newWillOriginal(steps, section, resourcePath, i18next, schema);

            newWilOri.setEligibilityCookie(req, res, nextStepUrl);

            expect(newWillOriginal.__get__('eligibilityCookie.setCookie').calledOnce).to.equal(true);
            expect(newWillOriginal.__get__('eligibilityCookie.setCookie').calledWith(
                {reqParam: 'req value'},
                {resParam: 'res value'},
                '/stop-page/notOriginal'
            )).to.equal(true);

            revert();
            done();
        });
    });
});
