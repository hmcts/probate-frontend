'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const ExecutorRoles = steps.ExecutorRoles;
const executorRolesPath = '/executor-roles/';
const json = require('app/resources/en/translation/executors/roles');

describe('ExecutorRoles', () => {
    describe('getUrl()', () => {
        it('returns the url with a * param when no index is given', (done) => {
            const url = ExecutorRoles.constructor.getUrl();

            expect(url).to.equal(`${executorRolesPath}*`);
            done();
        });

        it('returns the url with the index as a param when an index is given', (done) => {
            const param = 1;
            const url = ExecutorRoles.constructor.getUrl(param);

            expect(url).to.equal(executorRolesPath + param);
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

        it('should return the ctx with the executor roles and the screening_question feature toggle', (done) => {
            ctx = {
                index: 0,
                list: [
                    {
                        isApplying: false,
                        notApplyingReason: json.optionPowerReserved,
                        notApplyingKey: 'optionPowerReserved'
                    }
                ],
                notApplyingReason: json.optionPowerReserved
            };
            errors = {};
            [ctx, errors] = ExecutorRoles.handlePost(ctx, errors, formdata, session, hostname, featureToggles);
            expect(ctx).to.deep.equal({
                index: 0,
                list: [
                    {
                        isApplying: false,
                        notApplyingReason: json.optionPowerReserved,
                        notApplyingKey: 'optionPowerReserved'
                    }
                ],
                notApplyingReason: json.optionPowerReserved,
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
            const nextStepOptions = ExecutorRoles.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'notApplyingReason', value: json.optionPowerReserved, choice: 'powerReserved'},
                    {key: 'continue', value: true, choice: 'continue'}
                ]
            });
            done();
        });

        it('should return the correct options when the FT is on', (done) => {
            const ctx = {
                isToggleEnabled: true
            };
            const nextStepOptions = ExecutorRoles.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'notApplyingReason', value: json.optionPowerReserved, choice: 'powerReserved'},
                    {key: 'continue', value: true, choice: 'continue'},
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
                executorName: 'executorName',
                isApplying: true,
                notApplyingReason: 'whatever',
                continue: true
            };
            ExecutorRoles.action(ctx);
            assert.isUndefined(ctx.otherwise);
            assert.isUndefined(ctx.isToggleEnabled);
            assert.isUndefined(ctx.executorName);
            assert.isUndefined(ctx.isApplying);
            assert.isUndefined(ctx.notApplyingReason);
            assert.isUndefined(ctx.continue);
        });
    });
});
