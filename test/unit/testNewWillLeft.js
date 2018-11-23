'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const content = require('app/resources/en/translation/will/newleft');
const rewire = require('rewire');
const sinon = require('sinon');
const schema = require('app/steps/ui/will/newleft/schema');
const newWillLeft = rewire('app/steps/ui/will/newleft/index');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const NewWillLeft = steps.NewWillLeft;

describe('NewWillLeft', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = NewWillLeft.constructor.getUrl();
            expect(url).to.equal('/new-will-left');
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when Yes is given', (done) => {
            const ctx = {left: content.optionYes};
            const nextStepUrl = NewWillLeft.nextStepUrl(ctx);
            expect(nextStepUrl).to.equal('/new-will-original');
            done();
        });

        it('should return the correct url when No is given', (done) => {
            const ctx = {left: content.optionNo};
            const nextStepUrl = NewWillLeft.nextStepUrl(ctx);
            expect(nextStepUrl).to.equal('/stop-page/noWill');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = NewWillLeft.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'left',
                    value: content.optionYes,
                    choice: 'withWill'
                }]
            });
            done();
        });
    });

    describe('setEligibilityCookie()', () => {
        it('should call eligibilityCookie.setCookie() with the correct params', (done) => {
            const revert = newWillLeft.__set__('eligibilityCookie', {setCookie: sinon.spy()});
            const req = {reqParam: 'req value'};
            const res = {resParam: 'res value'};
            const nextStepUrl = '/stop-page/noWill';
            const steps = {};
            const section = null;
            const resourcePath = 'will/newleft';
            const i18next = {};
            const newWilLef = new newWillLeft(steps, section, resourcePath, i18next, schema);

            newWilLef.setEligibilityCookie(req, res, nextStepUrl);

            expect(newWillLeft.__get__('eligibilityCookie.setCookie').calledOnce).to.equal(true);
            expect(newWillLeft.__get__('eligibilityCookie.setCookie').calledWith(
                {reqParam: 'req value'},
                {resParam: 'res value'},
                '/stop-page/noWill'
            )).to.equal(true);

            revert();
            done();
        });
    });
});
