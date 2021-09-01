'use strict';
const initSteps = require('app/core/initSteps');
const {assert, expect} = require('chai');

describe('Executors-Who-Died', () => {
    const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
    const executorsWhoDied = steps.ExecutorsWhoDied;

    describe('getUrl()', () => {
        it('test correct url is returned from getUrl function', () => {
            assert.equal(executorsWhoDied.constructor.getUrl(), '/executors-who-died*');
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
