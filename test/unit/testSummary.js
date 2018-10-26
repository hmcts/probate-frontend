const initSteps = require('app/core/initSteps');
const {assert ,expect} = require('chai');
const sinon = require('sinon');
const when = require('when');
const services = require('app/components/services');
const co = require('co');

describe('Summary', () => {
    const steps = initSteps([__dirname + '/../../app/steps/action/', __dirname + '/../../app/steps/ui']);

    describe('handleGet()', () => {

        let validateFormDataStub;

        beforeEach(() => {
            validateFormDataStub = sinon.stub(services, 'validateFormData');
        });

        afterEach(() => {
            validateFormDataStub.restore();
        });

        it('ctx.executorsWithOtherNames returns array of execs with other names', (done) => {
            const expectedResponse = ['Prince', 'Cher'];
            validateFormDataStub.returns(when(expectedResponse));

            let ctx = {session: {form: {}}};
            const formdata = {executors: {list: [{fullName: 'Prince', hasOtherName: true}, {fullName: 'Cher', hasOtherName: true}]}};
            const Summary = steps.Summary;

            co(function* () {
                [ctx] = yield Summary.handleGet(ctx, formdata);
                assert.deepEqual(ctx.executorsWithOtherNames, expectedResponse);
                done();
            });
        });

        it('executorsWithOtherNames returns empty when hasOtherName is false', (done) => {
            const expectedResponse = [];
            validateFormDataStub.returns(when(expectedResponse));

            let ctx = {session: {form: {}}};
            const formdata = {executors: {list: [{fullName: 'Prince', hasOtherName: false}, {fullName: 'Cher', hasOtherName: false}]}};
            const Summary = steps.Summary;

            co(function* () {
                [ctx] = yield Summary.handleGet(ctx, formdata);
                assert.deepEqual(ctx.executorsWithOtherNames, expectedResponse);
                done();
            });
        });

        it('executorsWithOtherNames returns empty when list is empty', (done) => {
            const expectedResponse = [];
            validateFormDataStub.returns(when(expectedResponse));

            let ctx = {session: {form: {}}};
            const formdata = {executors: {list: []}};
            const Summary = steps.Summary;

            co(function* () {
                [ctx] = yield Summary.handleGet(ctx, formdata);
                assert.deepEqual(ctx.executorsWithOtherNames, expectedResponse);
                done();
            });
        });
    });

    describe('getContextData()', () => {

        it('ctx.uploadedDocuments returns an array of uploaded documents when there uploaded documents', (done) => {
            const req = {
                session: {
                    form: {
                        documents: {
                            uploads: [{filename: 'screenshot1.png'}, {filename: 'screenshot2.png'}]
                        }
                    }
                },
            };
            const Summary = steps.Summary;
            const ctx = Summary.getContextData(req);
            expect(ctx.uploadedDocuments).to.deep.equal(['screenshot1.png', 'screenshot2.png']);
            done();
        });

        it('ctx.uploadedDocuments returns an empty array of uploaded documents when there no uploaded documents', (done) => {
            const req = {
                session: {
                    form: {
                        documents: {
                            uploads: []
                        }
                    }
                },
            };
            const Summary = steps.Summary;
            const ctx = Summary.getContextData(req);
            expect(ctx.uploadedDocuments).to.deep.equal([]);
            done();

        });
    });
});
