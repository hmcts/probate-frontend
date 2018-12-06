'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const ExecutorNotified = steps.ExecutorNotified;
const ExecutorNotifiedPath = '/executor-notified/';

describe('ExecutorNotified', () => {
    describe('getUrl()', () => {
        it('returns the url with a * param when no index is given', (done) => {
            const url = ExecutorNotified.constructor.getUrl();

            expect(url).to.equal(`${ExecutorNotifiedPath}*`);
            done();
        });

        it('returns the url with the index as a param when an index is given', (done) => {
            const param = 1;
            const url = ExecutorNotified.constructor.getUrl(param);

            expect(url).to.equal(ExecutorNotifiedPath + param);
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

        it('should return the ctx with the executor notified and the screening_question feature toggle', (done) => {
            ctx = {
                index: 0,
                executorNotified: 'Yes'
            };
            formdata = {
                executors: {
                    list: [{}]
                }
            };
            errors = {};
            [ctx, errors] = ExecutorNotified.handlePost(ctx, errors, formdata, session, hostname, featureToggles);
            expect(ctx).to.deep.equal({
                index: -1,
                executorNotified: 'Yes',
                isToggleEnabled: false
            });
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options when the FT is off', (done) => {
            const ctx = {
                isToggleEnabled: false
            };
            const nextStepOptions = ExecutorNotified.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'nextExecutor', value: true, choice: 'roles'}
                ]
            });
            done();
        });

        it('should return the correct options when the FT is on', (done) => {
            const ctx = {
                isToggleEnabled: true
            };
            const nextStepOptions = ExecutorNotified.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'nextExecutor', value: true, choice: 'roles'},
                    {key: 'otherwise', value: true, choice: 'otherwiseToggleOn'}
                ]
            });
            done();
        });
    });

    describe('action', () => {
        it('test it cleans up context', () => {
            const ctx = {
                otherwise: 'something',
                isToggleEnabled: false,
                executorNotified: 'Yes',
                executorName: 'Some name',
                nextExecutor: 'whatever'
            };
            ExecutorNotified.action(ctx);
            assert.isUndefined(ctx.otherwise);
            assert.isUndefined(ctx.isToggleEnabled);
            assert.isUndefined(ctx.executorNotified);
            assert.isUndefined(ctx.executorName);
            assert.isUndefined(ctx.nextExecutor);
        });
    });
});
