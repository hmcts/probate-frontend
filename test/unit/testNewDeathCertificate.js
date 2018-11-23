'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const content = require('app/resources/en/translation/deceased/newdeathcertificate');
const rewire = require('rewire');
const sinon = require('sinon');
const schema = require('app/steps/ui/deceased/newdeathcertificate/schema');
const newDeathCertificate = rewire('app/steps/ui/deceased/newdeathcertificate/index');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const NewDeathCertificate = steps.NewDeathCertificate;

describe('NewDeathCertificate', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = NewDeathCertificate.constructor.getUrl();
            expect(url).to.equal('/new-death-certificate');
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when Yes is given', (done) => {
            const ctx = {deathCertificate: content.optionYes};
            const nextStepUrl = NewDeathCertificate.nextStepUrl(ctx);
            expect(nextStepUrl).to.equal('/new-deceased-domicile');
            done();
        });

        it('should return the correct url when No is given', (done) => {
            const ctx = {deathCertificate: content.optionNo};
            const nextStepUrl = NewDeathCertificate.nextStepUrl(ctx);
            expect(nextStepUrl).to.equal('/stop-page/deathCertificate');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = NewDeathCertificate.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'deathCertificate',
                    value: content.optionYes,
                    choice: 'hasCertificate'
                }]
            });
            done();
        });
    });

    describe('setEligibilityCookie()', () => {
        it('should call eligibilityCookie.setCookie() with the correct params', (done) => {
            const revert = newDeathCertificate.__set__('eligibilityCookie', {setCookie: sinon.spy()});
            const req = {reqParam: 'req value'};
            const res = {resParam: 'res value'};
            const nextStepUrl = '/stop-page/deathCertificate';
            const steps = {};
            const section = null;
            const resourcePath = 'deceased/newdeathcertificate';
            const i18next = {};
            const newAppExec = new newDeathCertificate(steps, section, resourcePath, i18next, schema);

            newAppExec.setEligibilityCookie(req, res, nextStepUrl);

            expect(newDeathCertificate.__get__('eligibilityCookie.setCookie').calledOnce).to.equal(true);
            expect(newDeathCertificate.__get__('eligibilityCookie.setCookie').calledWith(
                {reqParam: 'req value'},
                {resParam: 'res value'},
                '/stop-page/deathCertificate'
            )).to.equal(true);

            revert();
            done();
        });
    });
});
