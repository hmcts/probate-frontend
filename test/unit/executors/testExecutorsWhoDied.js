'use strict';
const initSteps = require('app/core/initSteps');
const {assert, expect} = require('chai');

describe('Executors-Who-Died', () => {
    const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
    const executorsWhoDied = steps.ExecutorsWhoDied;

    describe('getUrl()', () => {
        it('test correct url is returned from getUrl function', () => {
            assert.equal(executorsWhoDied.constructor.getUrl(), '/executors-who-died');
        });
    });

    describe('pruneFormData()', () => {
        let data;

        it('test isApplying flag is correctly removed', (done) => {
            data = {fullname: 'bob smith', isApplying: true, isDead: true};
            expect(executorsWhoDied.pruneFormData(data)).to.deep.equal({
                fullname: 'bob smith', isDead: true
            });
            done();
        });

        it('test isApplying flag is not removed', (done) => {
            data = {fullname: 'bob smith', isApplying: true, isDead: false};
            expect(executorsWhoDied.pruneFormData(data)).to.deep.equal({
                fullname: 'bob smith', isApplying: true, isDead: false
            });
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx;
        let errors = {};

        it('converts executorWhoDied string into array', (done) => {
            ctx = {
                executorsWhoDied: 'Executor'
            };
            [ctx, errors] = executorsWhoDied.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({executorsWhoDied: ['Executor']});
            done();
        });

        it('does not alter executorWhoDied if supplied as array', (done) => {
            ctx = {
                executorsWhoDied: ['Executor']
            };
            [ctx, errors] = executorsWhoDied.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({executorsWhoDied: ['Executor']});
            done();
        })

        it('updates correct executor if executorWhoDied contains substring of another executor', (done) => {
            ctx = {
                list: [
                    {fullName: 'Applicant'},
                    {fullName: 'ExecutorA'},
                    {fullName: 'ExecutorAB'},
                    {fullName: 'ExecutorABC'},
                ],
                executorsNumber: 4,
                executorsWhoDied: 'ExecutorABC'
            };

            const expected = [
                {fullName: 'Applicant'},
                {fullName: 'ExecutorA', isDead: false},
                {fullName: 'ExecutorAB', isDead: false},
                {fullName: 'ExecutorABC', isDead: true}
            ];

            [ctx, errors] = executorsWhoDied.handlePost(ctx,errors)
            expect(ctx.list).to.deep.equal(expected);
            done()
        })

        it('updates list if single executor died', (done) => {
            ctx = {
                list: [
                    {fullName: 'Applicant', isApplying: true},
                    {fullName: 'Executor1', isApplying: false},
                    {fullName: 'Executor2', isApplying: false},
                ],
                executorsNumber: 3,
                executorsWhoDied: 'Executor2'
            };

            const expected = [
                {fullName:'Applicant', isApplying: true},
                {fullName:'Executor1', isApplying: false, isDead: false},
                {fullName:'Executor2', isDead: true}
            ];

            [ctx, errors] = executorsWhoDied.handlePost(ctx, errors)
            expect(ctx.list).to.deep.equal(expected);
            done();
        })

        it('updates list if multiple executors died', (done) => {
            ctx = {
                list: [
                    {fullName: 'Applicant', isApplying: true},
                    {fullName: 'Executor1', isApplying: false},
                    {fullName: 'Executor2', isApplying: false},
                    {fullName: 'Executor3', isApplying: false},
                ],
                executorsNumber: 4,
                executorsWhoDied: ['Executor1','Executor3']
            };

            const expected = [
                {fullName:'Applicant', isApplying: true},
                {fullName:'Executor1', isDead: true},
                {fullName:'Executor2', isApplying: false, isDead: false},
                {fullName:'Executor3', isDead: true}
            ];

            [ctx, errors] = executorsWhoDied.handlePost(ctx, errors)
            expect(ctx.list).to.deep.equal(expected);
            done();
        })
    })

    describe('action()', () => {
        let ctx;
        let formdata;

        it('test action removes all ctx data and only data not removed is returned', (done) => {
            ctx = {
                options: [
                    {option: 'number 2', checked: true},
                    {option: 'number 3', checked: false}
                ],
                executorsWhoDied: [
                    {fullname: 'number 2'},
                    {fullname: 'number 3'}
                ],
                invitesSent: 'true'
            };
            formdata = {};
            [ctx, formdata] = executorsWhoDied.action(ctx, formdata);
            expect(ctx).to.deep.equal({invitesSent: 'true'});
            done();
        });

        it('test action removes all ctx data and returns an empty object', (done) => {
            ctx = {
                options: [
                    {option: 'number 2', checked: true},
                    {option: 'number 3', checked: false}
                ],
                executorsWhoDied: [
                    {fullname: 'number 2'},
                    {fullname: 'number 3'}
                ]
            };
            formdata = {};
            [ctx, formdata] = executorsWhoDied.action(ctx, formdata);
            expect(ctx).to.deep.equal({});
            done();
        });
    });
});
