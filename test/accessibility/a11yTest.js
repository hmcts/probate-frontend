'use strict';

const co = require('co');
const request = require('supertest');
const a11y = require('test/util/a11y');
const {expect} = require('chai');
const app = require('app');
const initSteps = require('app/core/initSteps');
const {endsWith} = require('lodash');
const sinon = require('sinon');
const commonContent = require('app/resources/en/translation/common');
const services = require('app/components/services');
const stepsToExclude = ['StartEligibility', 'StartApply', 'NewStartEligibility', 'NewStartApply', 'PinPage', 'PinSent', 'PinResend', 'AddressLookup', 'ExecutorAddress', 'ExecutorContactDetails', 'ExecutorName', 'ExecutorNotified', 'ExecutorNameAsOnWill', 'ExecutorApplying', 'DeleteExecutor', 'PaymentStatus', 'AddAlias', 'RemoveAlias', 'ExecutorRoles', 'ExecutorsWhenDied'];
const steps = initSteps.steps;
let checkAllAgreedStub;
let featureToggleStub;

Object.keys(steps)
    .filter(stepName => stepsToExclude.includes(stepName))
    .forEach(stepName => delete steps[stepName]);

for (const step in steps) {
    ((step) => {

        let results;

        describe(`Verify accessibility for the page ${step.name}`, () => {
            let server = null;
            let agent = null;
            const title = `${step.content.title} - ${commonContent.serviceName}`
                .replace(/&lsquo;/g, '‘')
                .replace(/&rsquo;/g, '’')
                .replace(/\(/g, '\\(')
                .replace(/\)/g, '\\)');

            before((done) => {
                checkAllAgreedStub = sinon.stub(services, 'checkAllAgreed')
                    .returns(Promise.resolve('false'));

                featureToggleStub = sinon.stub(services, 'featureToggle')
                    .returns(Promise.resolve('true'));

                server = app.init();
                agent = request.agent(server.app);
                co(function* () {
                    let urlSuffix = '';
                    if (endsWith(agent.get(step.constructor.getUrl()), '*')) {
                        urlSuffix = '/0';
                    }
                    results = yield a11y(agent.get(step.constructor.getUrl()).url + urlSuffix, title);
                })
                    .then(done, done)
                    .catch((error) => {
                        done(error);
                    });
            });

            after(function (done) {
                checkAllAgreedStub.restore();
                featureToggleStub.restore();
                server.http.close();
                done();
            });

            it('should not generate any errors', () => {
                const errors = results.filter((res) => res.type === 'error');
                expect(errors.length).to.equal(0, JSON.stringify(errors, null, 2));
            });

            it('should not generate any warnings', () => {
                const warnings = results.filter((res) => res.type === 'warning');
                expect(warnings.length).to.equal(0, JSON.stringify(warnings, null, 2));
            });
        });
    })(steps[step]);
}
