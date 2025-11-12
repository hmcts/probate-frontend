'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const namePath = '/remove-coApplicant/';
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const RemoveCoApplicant = steps.RemoveCoApplicant;

describe('RemoveCoApplicant', () => {

    describe('RemoveCoApplicant getContextData', () => {
        it('Add executor name to the context', (done) => {
            const req = {
                params: [1],
                session: {
                    form: {}
                },
                body: {
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
                        }, {
                            isApplying: true,
                            coApplicantRelationshipToDeceased: 'optionGrandchild',
                            fullName: 'Dave Miller',
                        }
                    ]
                }
            };
            const ctx = RemoveCoApplicant.getContextData(req);
            expect(ctx.executorFullName).to.equal('Ed Brown');
            done();
        });
    });

    describe('RemoveCoApplicant handlePost', () => {
        it('Should remove co-applicant and update formdata if removeCoApplicant is Yes', (done) => {
            let ctx = {
                list: [
                    {
                        isApplying: true,
                        coApplicantRelationshipToDeceased: 'optionChild',
                        fullName: 'Ed Brown',
                    }, {
                        isApplying: true,
                        coApplicantRelationshipToDeceased: 'optionGrandchild',
                        fullName: 'Dave Miller',
                    }
                ],
                index: 1,
                removeCoApplicant: 'optionYes'
            };
            let errors = [];
            const formdata = {};
            [ctx, errors] = RemoveCoApplicant.handlePost(ctx, errors, formdata);

            const expected = {
                list: [
                    {
                        isApplying: true,
                        coApplicantRelationshipToDeceased: 'optionChild',
                        fullName: 'Ed Brown',
                    },
                ]
            };
            expect(formdata.executors).to.deep.equal(expected);
            done();
        });
        it('Should not remove co-applicant and update formdata if removeCoApplicant is No', (done) => {
            let ctx = {
                list: [
                    {
                        isApplying: true,
                        coApplicantRelationshipToDeceased: 'optionChild',
                        fullName: 'Ed Brown',
                    }, {
                        isApplying: true,
                        coApplicantRelationshipToDeceased: 'optionGrandchild',
                        fullName: 'Dave Miller',
                    }
                ],
                index: 1,
                removeCoApplicant: 'optionNo'
            };
            let errors = [];
            const formdata = {};
            [ctx, errors] = RemoveCoApplicant.handlePost(ctx, errors, formdata);
            expect(ctx.list).to.have.lengthOf(2);
            done();
        });
    });
    describe('RemoveCoApplicant getUrl()', () => {
        it('returns the url with the index as a param when an index is given', (done) => {
            const param = 1;
            const url = RemoveCoApplicant.constructor.getUrl(param);

            expect(url).to.equal(namePath + param);
            done();
        });
    });
    describe('RemoveCoApplicant generateFields', () => {
        let ctx;
        let errors;
        let language;

        beforeEach(() => {
            ctx = {
                list: [
                    {fullName: 'Applicant'},
                    {fullName: 'CoApplicant 1', coApplicantRelationshipToDeceased: 'optionChild'},
                    {fullName: 'CoApplicant 2', coApplicantRelationshipToDeceased: 'optionGrandchild'},
                ],
                executorFullName: 'John Doe',
            };
            errors = [{msg: 'Error message for {executorFullName}'}];
            language = 'en';
        });

        it('should replace {executorFullName} placeholder in error message with executor name', () => {
            RemoveCoApplicant.generateFields(language, ctx, errors);
            expect(errors[0].msg).to.equal('Error message for John Doe');
        });

        it('should not modify error message if otherExecName is not present in fields', () => {
            ctx.executorFullName = '';
            RemoveCoApplicant.generateFields(language, ctx, errors);
            expect(errors[0].msg).to.equal('Error message for ');
        });
    });
});
