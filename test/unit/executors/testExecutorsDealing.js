'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const executorRolesContent = require('app/resources/en/translation/executors/executorcontent');

describe('Executors-Applying', () => {
    let ctx;
    let ctxTest;
    let data;
    let errors;
    const ExecsDealing = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]).ExecutorsDealingWithEstate;

    describe('getContextData()', () => {
        let req;
        beforeEach(() => {
            req = {
                session: {
                    form: {
                        applicant: {
                            firstName: 'Robert',
                            lastName: 'Bruce',
                            nameAsOnTheWill: 'Yes',
                            phone: '075345435345',
                            address: '102 Petty France'
                        },
                        executors: {
                            list: [
                                {
                                    'lastName': 'Bruce',
                                    'firstName': 'Robert',
                                    'isApplying': 'Yes',
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
            ctx = ExecsDealing.getContextData(req);
            expect(ctx.options).to.deep.equal([
                {text: 'Robert Bruce', value: 'Robert Bruce', checked: true, disabled: true},
                {text: 'Ed Brown', value: 'Ed Brown', checked: true},
                {text: 'Dave Miller', value: 'Dave Miller', checked: true}
            ]);
            done();
        });

        it('should set the lead applicant alias as the option when the Applicant Alias is set', (done) => {
            req.session.form.applicant.alias = 'Bobby Alias';
            ctx = ExecsDealing.getContextData(req);
            expect(ctx.options).to.deep.equal([
                {text: 'Bobby Alias', value: 'Bobby Alias', checked: true, disabled: true},
                {text: 'Ed Brown', value: 'Ed Brown', checked: true},
                {text: 'Dave Miller', value: 'Dave Miller', checked: true}
            ]);
            done();
        });

        it('should set checked to false when isApplying is false for other executor', (done) => {
            req.session.form.executors.list[1].isApplying = false;
            ctx = ExecsDealing.getContextData(req);
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
            ExecsDealing.pruneExecutorData(data);
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
            ExecsDealing.pruneExecutorData(data);
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
                    'notApplyingReason': executorRolesContent.optionRenunciated,
                    'currentNameReason': 'Divorce',
                }
            ]
        };

        it('removes email from data if isApplying is false', () => {
            const data = ExecsDealing.pruneExecutorData(ctx.list[1]);
            assert.isUndefined(data.email);
        });

        it('removes mobile from data if isApplying is false', () => {
            const data = ExecsDealing.pruneExecutorData(ctx.list[1]);
            assert.isUndefined(data.mobile);
        });

        it('removes address from data if isApplying is false', () => {
            const data = ExecsDealing.pruneExecutorData(ctx.list[1]);
            assert.isUndefined(data.address);
        });

        it('removes postcode from data if isApplying is false', () => {
            const data = ExecsDealing.pruneExecutorData(ctx.list[1]);
            assert.isUndefined(data.postcode);
        });

        it('removes currentName from data if isApplying is false', () => {
            const data = ExecsDealing.pruneExecutorData(ctx.list[1]);
            assert.isUndefined(data.currentName);
        });

        it('removes hasOtherName from data if isApplying is false', () => {
            const data = ExecsDealing.pruneExecutorData(ctx.list[1]);
            assert.isUndefined(data.hasOtherName);
        });

        it('removes currentNameReason from data if isApplying is false', () => {
            const data = ExecsDealing.pruneExecutorData(ctx.list[1]);
            assert.isUndefined(data.currentNameReason);
        });
    });

    describe('handlePost', () => {
        beforeEach(() => {
            ctxTest = {
                list: [
                    {
                        'lastName': 'the',
                        'firstName': 'applicant',
                        'isApplying': 'Yes',
                        'isApplicant': true
                    },
                    {
                        fullName: 'Ed Brown',
                        address: '20 Green Street, London, L12 9LN'
                    },
                    {
                        fullName: 'Dave Miller',
                        address: '102 Petty Street, London, L12 9LN'
                    },
                    {
                        email: 'probate0@mailinator.com',
                        mobile: '07900123456',
                        address: 'cher address',
                        fullName: 'Cher',
                        isApplying: false,
                        notApplyingKey: 'optionRenunciated',
                        notApplyingReason: executorRolesContent.optionRenunciated
                    }
                ],
                executorsApplying: ['Dave Miller'],
                executorsNumber: 4
            };
        });

        it('test executors (with checkbox unchecked) isApplying flag is deleted', () => {
            [ctx, errors] = ExecsDealing.handlePost(ctxTest);
            assert.isUndefined(ctx.list[1].isApplying);
            assert.isUndefined(errors);
        });

        it('test executors (with checkbox checked) isApplying flag is set to true', () => {
            [ctx, errors] = ExecsDealing.handlePost(ctxTest);
            assert.isTrue(ctx.list[2].isApplying);
            assert.isUndefined(errors);
        });

        it('should prune executor 3 data', () => {
            [ctx, errors] = ExecsDealing.handlePost(ctxTest);
            assert.isUndefined(ctx.list[3].isApplying);
            assert.isUndefined(ctx.list[3].address);
            assert.isUndefined(errors);
        });

        it('should not prune executor 2 data', () => {
            [ctx, errors] = ExecsDealing.handlePost(ctxTest);
            expect(ctx.list[2].isApplying).to.equal(true);
            expect(ctx.list[2].address).to.equal('102 Petty Street, London, L12 9LN');
            assert.isUndefined(errors);
        });
    });
});
