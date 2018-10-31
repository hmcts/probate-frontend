'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const ExecutorsAlias = steps.ExecutorsAlias;

describe('Executors-Alias', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ExecutorsAlias.constructor.getUrl();
            expect(url).to.equal('/executors-alias');
            done();
        });
    });

    describe('pruneFormData()', () => {
        let ctx;

        it('should return the pruned executor list if option No is chosen', (done) => {
            ctx = {
                alias: 'No',
                list: [
                    {fullName: 'Ronnie D', hasOtherName: true, currentName: 'Steve', currentNameReason: 'Marriage'},
                    {fullName: 'Aggie D', hasOtherName: true, currentName: 'Danny', currentNameReason: 'other', otherReason: 'Yolo'}
                ]
            };
            ctx = ExecutorsAlias.pruneFormData(ctx);
            expect(ctx).to.deep.equal({
                alias: 'No',
                list: [
                    {fullName: 'Ronnie D', hasOtherName: false},
                    {fullName: 'Aggie D', hasOtherName: false}
                ]
            });
            done();
        });

        it('should return the executor list untouched if option Yes is chosen', (done) => {
            ctx = {
                alias: 'Yes',
                list: [
                    {currentName: 'Steve', hasOtherName: true, currentNameReason: 'Marriage'},
                    {currentName: 'Danny', hasOtherName: true, currentNameReason: 'other', otherReason: 'Yolo'}
                ]
            };
            ctx = ExecutorsAlias.pruneFormData(ctx);
            expect(ctx).to.deep.equal({
                alias: 'Yes',
                list: [
                    {currentName: 'Steve', hasOtherName: true, currentNameReason: 'Marriage'},
                    {currentName: 'Danny', hasOtherName: true, currentNameReason: 'other', otherReason: 'Yolo'}
                ]
            });
            done();
        });
    });
});
