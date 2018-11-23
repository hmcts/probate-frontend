'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const content = require('app/resources/en/translation/deceased/newdomicile');
const rewire = require('rewire');
const sinon = require('sinon');
const schema = require('app/steps/ui/deceased/newdomicile/schema');
const newDeceasedDomicile = rewire('app/steps/ui/deceased/newdomicile/index');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const NewDeceasedDomicile = steps.NewDeceasedDomicile;

describe('NewDeceasedDomicile', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = NewDeceasedDomicile.constructor.getUrl();
            expect(url).to.equal('/new-deceased-domicile');
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when Yes is given', (done) => {
            const ctx = {domicile: content.optionYes};
            const nextStepUrl = NewDeceasedDomicile.nextStepUrl(ctx);
            expect(nextStepUrl).to.equal('/new-iht-completed');
            done();
        });

        it('should return the correct url when No is given', (done) => {
            const ctx = {domicile: content.optionNo};
            const nextStepUrl = NewDeceasedDomicile.nextStepUrl(ctx);
            expect(nextStepUrl).to.equal('/stop-page/notInEnglandOrWales');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = NewDeceasedDomicile.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'domicile',
                    value: content.optionYes,
                    choice: 'inEnglandOrWales'
                }]
            });
            done();
        });
    });

    describe('setEligibilityCookie()', () => {
        it('should call eligibilityCookie.setCookie() with the correct params', (done) => {
            const revert = newDeceasedDomicile.__set__('eligibilityCookie', {setCookie: sinon.spy()});
            const req = {reqParam: 'req value'};
            const res = {resParam: 'res value'};
            const nextStepUrl = '/stop-page/notInEnglandOrWales';
            const steps = {};
            const section = null;
            const resourcePath = 'deceased/newdomicile';
            const i18next = {};
            const newDecDom = new newDeceasedDomicile(steps, section, resourcePath, i18next, schema);

            newDecDom.setEligibilityCookie(req, res, nextStepUrl);

            expect(newDeceasedDomicile.__get__('eligibilityCookie.setCookie').calledOnce).to.equal(true);
            expect(newDeceasedDomicile.__get__('eligibilityCookie.setCookie').calledWith(
                {reqParam: 'req value'},
                {resParam: 'res value'},
                '/stop-page/notInEnglandOrWales'
            )).to.equal(true);

            revert();
            done();
        });
    });
});
