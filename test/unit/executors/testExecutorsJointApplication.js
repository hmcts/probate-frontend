'use strict';
const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const content = require('../../../app/resources/en/translation/executors/jointapplication.json');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const JointApplication = steps.JointApplication;

describe('JointApplication', () => {

    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = JointApplication.constructor.getUrl();
            expect(url).to.equal('/joint-application');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = JointApplication.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'hasCoApplicant', value: 'optionYes', choice: 'hasCoApplicant'},
                    {key: 'hasCoApplicant', value: 'optionNo', choice: 'hasNoCoApplicant'},
                ]
            });
            done();
        });
    });

    describe('createExecutorList()', () => {
        it('should create a list with the main applicant as the first applicant', () => {
            const ctx = {};
            const formdata = {
                applicant: {
                    'firstName': 'Dave',
                    'lastName': 'Bassett'
                },
                executors: []
            };
            JointApplication.createExecutorList(ctx, formdata);
            assert.lengthOf(ctx.list, 1);
            expect(ctx.list[0]).to.deep.equal({
                firstName: 'Dave',
                lastName: 'Bassett',
                isApplying: true,
                isApplicant: true,
                fullName: 'Dave Bassett'
            });
        });

        it('should handle an empty applicant list', () => {
            const ctx = {};
            const formdata = {
                applicant: {
                    'firstName': 'Dave',
                    'lastName': 'Bassett'
                },
                executors: []
            };
            JointApplication.createExecutorList(ctx, formdata);
            assert.lengthOf(ctx.list, 1);
        });

        it('should handle multiple co-applicants', () => {
            const ctx = {};
            const formdata = {
                applicant: {
                    'firstName': 'Dave',
                    'lastName': 'Bassett'
                },
                executors: {
                    list: [
                        {
                            'firstName': 'Dave',
                            'lastName': 'Bassett',
                            'isApplying': true,
                            'isApplicant': true
                        }, {
                            isApplying: true,
                            coApplicantRelationshipToDeceased: 'optionChild',
                            fullName: 'Ed Brown',
                            childAdoptedIn: 'optionYes',
                            childAdoptionInEnglandOrWales: 'optionYes',
                            email: 'abc@gmail.com',
                            address: '20 Green Street, London, L12 9LN'
                        }, {
                            isApplying: true,
                            coApplicantRelationshipToDeceased: 'optionGrandchild',
                            fullName: 'Dave Miller',
                            childAdoptedIn: 'optionYes',
                            childAdoptionInEnglandOrWales: 'optionYes',
                            grandchildAdoptedIn: 'optionYes',
                            grandchildAdoptionInEnglandOrWales: 'optionYes',
                            email: 'abc@gmail.com',
                            address: '20 Green Street, London, L12 9LN'
                        }
                    ]
                }
            };
            JointApplication.createExecutorList(ctx, formdata);
            assert.lengthOf(ctx.list, 3);
            expect(ctx.list[1]).to.deep.equal({
                isApplying: true,
                coApplicantRelationshipToDeceased: 'optionChild',
                fullName: 'Ed Brown',
                childAdoptedIn: 'optionYes',
                childAdoptionInEnglandOrWales: 'optionYes',
                email: 'abc@gmail.com',
                address: '20 Green Street, London, L12 9LN'
            });
            expect(ctx.list[2]).to.deep.equal({
                isApplying: true,
                coApplicantRelationshipToDeceased: 'optionGrandchild',
                fullName: 'Dave Miller',
                childAdoptedIn: 'optionYes',
                childAdoptionInEnglandOrWales: 'optionYes',
                grandchildAdoptedIn: 'optionYes',
                grandchildAdoptionInEnglandOrWales: 'optionYes',
                email: 'abc@gmail.com',
                address: '20 Green Street, London, L12 9LN'
            });
        });
    });
    describe('isComplete', () => {
        it('should return inProgress when hasCoApplicant is Yes', () => {
            const ctx = {hasCoApplicant: 'optionYes'};
            const result = JointApplication.isComplete(ctx);
            expect(result).to.deep.equal([true, 'inProgress']);
        });

        it('should return inProgress when hasCoApplicant is No', () => {
            const ctx = {hasCoApplicant: 'optionNo'};
            const result = JointApplication.isComplete(ctx);
            expect(result).to.deep.equal([true, 'inProgress']);
        });

        it('should not return inProgress when hasCoApplicant is undefined', () => {
            const ctx = {};
            const result = JointApplication.isComplete(ctx);
            expect(result).to.deep.equal([false, 'inProgress']);
        });
    });
    describe('JointApplication handlePost', () => {
        let ctx;
        let errors;
        let formdata;
        let session;

        beforeEach(() => {
            ctx = {
                hasCoApplicant: '',
                list: []
            };
            errors = [];
            formdata = {};
            session = {language: 'en'};
        });

        it('should add required error if hasCoApplicant is empty', () => {
            ctx.hasCoApplicantChecked = false;
            [ctx, errors] = JointApplication.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'hasCoApplicant',
                    href: '#hasCoApplicant',
                    msg: content.errors.hasCoApplicant.required
                }
            ]);
        });

        it('should add invalid error if list length is more than 4', () => {
            ctx.hasCoApplicant = 'optionYes';
            ctx.hasCoApplicantChecked = 'true';
            ctx.list = new Array(5).fill({});
            [ctx, errors] = JointApplication.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'hasCoApplicant',
                    href: '#hasCoApplicant',
                    msg: content.errors.hasCoApplicant.invalid
                }
            ]);
        });
    });
});
