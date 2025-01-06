'use strict';
const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const assert = require('chai').assert;

describe('Executors-Applying', () => {
    let ctx;
    let errors;
    let data;
    const ExecsApplying = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]).ExecutorsApplying;

    describe('handlePost', () => {
        beforeEach(() => {
            ctx = {
                list: [
                    {
                        lastName: 'the',
                        firstName: 'applicant',
                        isApplying: true,
                        isApplicant: true
                    }, {
                        isApplying: true,
                        fullName: 'Ed Brown',
                        address: '20 Green Street, London, L12 9LN'
                    }, {
                        isApplying: true,
                        fullName: 'Dave Miller',
                        address: '102 Petty Street, London, L12 9LN'
                    }
                ],
            };
        });

        it('test executor isApplying flag is deleted when no executor is applying', () => {
            ctx.executorsApplying = [];
            ExecsApplying.handlePost(ctx);
            assert.isUndefined(ctx.list[1].isApplying);
            assert.isUndefined(ctx.list[2].isApplying);
        });

        it('test executor isApplying flag is true when multiple executors are applying', () => {
            ctx.executorsApplying = ['Ed Brown', 'Dave Miller'];
            ExecsApplying.handlePost(ctx);
            assert.isTrue(ctx.list[1].isApplying);
            assert.isTrue(ctx.list[2].isApplying);
        });
        it('test executor isApplying flag is true when single executor is applying', () => {
            ctx.list= [
                {
                    lastName: 'the',
                    firstName: 'applicant',
                    isApplying: true,
                    isApplicant: true
                }, {
                    isApplying: true,
                    fullName: 'Ed Brown',
                    address: '20 Green Street, London, L12 9LN'
                }
            ];
            ctx.otherExecutorsApplying = 'optionYes';
            ExecsApplying.handlePost(ctx);
            assert.isTrue(ctx.list[1].isApplying);
        });
        it('test executor isApplying flag is false when single executor is not applying', () => {
            ctx.list= [
                {
                    lastName: 'the',
                    firstName: 'applicant',
                    isApplying: true,
                    isApplicant: true
                }, {
                    isApplying: true,
                    fullName: 'Ed Brown',
                    address: '20 Green Street, London, L12 9LN'
                }
            ];
            ctx.otherExecutorsApplying = 'optionNo';
            [ctx, errors] = ExecsApplying.handlePost(ctx);
            assert.isUndefined(ctx.list[1].isApplying);
            assert.isEmpty(errors);
        });
    });

    describe('getContextData()', () => {
        let req;
        beforeEach(() => {
            req = {
                session: {
                    form: {
                        applicant: {
                            firstName: 'Robert',
                            lastName: 'Bruce',
                            nameAsOnTheWill: 'optionYes',
                            phone: '075345435345',
                            address: '102 Petty France'
                        },
                        executors: {
                            list: [
                                {
                                    'lastName': 'Bruce',
                                    'firstName': 'Robert',
                                    'isApplying': 'optionYes',
                                    'isApplicant': true
                                }, {
                                    isApplying: true,
                                    fullName: 'Ed Brown',
                                    address: '20 Green Street, London, L12 9LN'
                                }, {
                                    isApplying: true,
                                    fullName: 'Dave Miller',
                                    address: '102 Petty Street, London, L12 9LN'
                                }
                            ]
                        }
                    }
                }
            };
        });

        it('should set the formatted lead applicant name as the option when there is no Applicant Alias', (done) => {
            ctx = ExecsApplying.getContextData(req);
            expect(ctx.options).to.deep.equal([
                {text: 'Robert Bruce', value: 'Robert Bruce', checked: true, disabled: true},
                {text: 'Ed Brown', value: 'Ed Brown', checked: true},
                {text: 'Dave Miller', value: 'Dave Miller', checked: true}
            ]);
            done();
        });

        it('should set the lead applicant alias as the option when the Applicant Alias is set', (done) => {
            req.session.form.applicant.alias = 'Bobby Alias';
            ctx = ExecsApplying.getContextData(req);
            expect(ctx.options).to.deep.equal([
                {text: 'Bobby Alias', value: 'Bobby Alias', checked: true, disabled: true},
                {text: 'Ed Brown', value: 'Ed Brown', checked: true},
                {text: 'Dave Miller', value: 'Dave Miller', checked: true}
            ]);
            done();
        });

        it('should set checked to false when isApplying is false for other executor', (done) => {
            req.session.form.executors.list[1].isApplying = false;
            ctx = ExecsApplying.getContextData(req);
            expect(ctx.options).to.deep.equal([
                {text: 'Robert Bruce', value: 'Robert Bruce', checked: true, disabled: true},
                {text: 'Ed Brown', value: 'Ed Brown', checked: false},
                {text: 'Dave Miller', value: 'Dave Miller', checked: true}
            ]);
            done();
        });
    });

    describe('pruneExecutorData', () => {
        it('test that isApplying flag is deleted when executor is not applying', () => {
            data = {
                fullName: 'Ed Brown',
                isApplying: false
            };
            ExecsApplying.pruneExecutorData(data);
            assert.isUndefined(data.isApplying);
            expect(data).to.deep.equal({fullName: 'Ed Brown'});
        });

        it('test that notApplying data is pruned when executor is applying', () => {
            data = {
                fullName: 'Ed Brown',
                isApplying: true,
                isDead: 'not sure',
                diedBefore: 'not sure',
                notApplyingReason: 'not sure',
                notApplyingKey: 'not sure'
            };
            ExecsApplying.pruneExecutorData(data);
            expect(data).to.deep.equal({
                fullName: 'Ed Brown',
                isApplying: true
            });
        });

        const ctx = {
            'list': [
                {
                    'lastName': 'Applicant',
                    'firstName': 'Main',
                    'isApplying': true,
                    'isApplicant': true
                },
                {
                    'email': 'probate0@mailinator.com',
                    'mobile': '07900123456',
                    'address': 'Princes house address',
                    'postcode': 'NW1 8SS',
                    'fullName': 'Prince Rogers Nelson',
                    'hasOtherName': true,
                    'currentName': 'Prince',
                    'isApplying': false,
                    'notApplyingKey': 'optionRenunciated',
                    'notApplyingReason': 'optionRenunciated',
                    'currentNameReason': 'Divorce',
                }
            ]
        };

        it('removes email from data if isApplying is false', () => {
            const data = ExecsApplying.pruneExecutorData(ctx.list[1]);
            assert.isUndefined(data.email);
        });

        it('removes mobile from data if isApplying is false', () => {
            const data = ExecsApplying.pruneExecutorData(ctx.list[1]);
            assert.isUndefined(data.mobile);
        });

        it('removes address from data if isApplying is false', () => {
            const data = ExecsApplying.pruneExecutorData(ctx.list[1]);
            assert.isUndefined(data.address);
        });

        it('removes postcode from data if isApplying is false', () => {
            const data = ExecsApplying.pruneExecutorData(ctx.list[1]);
            assert.isUndefined(data.postcode);
        });

        it('removes currentName from data if isApplying is false', () => {
            const data = ExecsApplying.pruneExecutorData(ctx.list[1]);
            assert.isUndefined(data.currentName);
        });

        it('removes hasOtherName from data if isApplying is false', () => {
            const data = ExecsApplying.pruneExecutorData(ctx.list[1]);
            assert.isUndefined(data.hasOtherName);
        });

        it('removes currentNameReason from data if isApplying is false', () => {
            const data = ExecsApplying.pruneExecutorData(ctx.list[1]);
            assert.isUndefined(data.currentNameReason);
        });
    });
});
