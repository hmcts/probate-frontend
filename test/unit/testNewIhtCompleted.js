'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const content = require('app/resources/en/translation/iht/newcompleted');
const rewire = require('rewire');
const sinon = require('sinon');
const schema = require('app/steps/ui/iht/newcompleted/schema');
const newIhtCompleted = rewire('app/steps/ui/iht/newcompleted/index');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const NewIhtCompleted = steps.NewIhtCompleted;

describe('NewIhtCompleted', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = NewIhtCompleted.constructor.getUrl();
            expect(url).to.equal('/new-iht-completed');
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when Yes is given', (done) => {
            const ctx = {completed: content.optionYes};
            const nextStepUrl = NewIhtCompleted.nextStepUrl(ctx);
            expect(nextStepUrl).to.equal('/new-will-left');
            done();
        });

        it('should return the correct url when No is given', (done) => {
            const ctx = {completed: content.optionNo};
            const nextStepUrl = NewIhtCompleted.nextStepUrl(ctx);
            expect(nextStepUrl).to.equal('/stop-page/ihtNotCompleted');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = NewIhtCompleted.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'completed',
                    value: content.optionYes,
                    choice: 'completed'
                }]
            });
            done();
        });
    });

    describe('persistFormData()', () => {
        it('should return an empty object', () => {
            const result = NewIhtCompleted.persistFormData();
            expect(result).to.deep.equal({});
        });
    });

    describe('setEligibilityCookie()', () => {
        it('should call eligibilityCookie.setCookie() with the correct params', (done) => {
            const revert = newIhtCompleted.__set__('eligibilityCookie', {setCookie: sinon.spy()});
            const req = {reqParam: 'req value'};
            const res = {resParam: 'res value'};
            const nextStepUrl = '/stop-page/ihtNotCompleted';
            const steps = {};
            const section = null;
            const resourcePath = 'iht/newcompleted';
            const i18next = {};
            const newIhtCom = new newIhtCompleted(steps, section, resourcePath, i18next, schema);

            newIhtCom.setEligibilityCookie(req, res, nextStepUrl);

            expect(newIhtCompleted.__get__('eligibilityCookie.setCookie').calledOnce).to.equal(true);
            expect(newIhtCompleted.__get__('eligibilityCookie.setCookie').calledWith(
                {reqParam: 'req value'},
                {resParam: 'res value'},
                '/stop-page/ihtNotCompleted'
            )).to.equal(true);

            revert();
            done();
        });
    });
});
