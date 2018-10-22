const initSteps = require('app/core/initSteps');
const {assert, expect} = require('chai');
const sinon = require('sinon');
const when = require('when');
const services = require('app/components/services');
const co = require('co');

describe('Summary', () => {
    const steps = initSteps([__dirname + '/../../app/steps/action/', __dirname + '/../../app/steps/ui']);
    const Summary = steps.Summary;

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

            co(function* () {
                [ctx] = yield Summary.handleGet(ctx, formdata);
                assert.deepEqual(ctx.executorsWithOtherNames, expectedResponse);
                done();
            });
        });

        it('check feature toggles are set correctly to true', (done) => {
            const expectedResponse = true;
            validateFormDataStub.returns(when(expectedResponse));

            let ctx = {session: {form: {}}};
            const formdata = {executors: {list: []}};
            const featureToggles = {
                screening_questions: true,
                document_upload: true
            };

            co(function* () {
                [ctx] = yield Summary.handleGet(ctx, formdata, featureToggles);
                assert.equal(ctx.isScreeningQuestionToggleEnabled, expectedResponse);
                assert.equal(ctx.isDocumentUploadToggleEnabled, expectedResponse);
                done();
            });
        });

        it('check feature toggles are set correctly to false', (done) => {
            const expectedResponse = false;
            validateFormDataStub.returns(when(expectedResponse));

            let ctx = {session: {form: {}}};
            const formdata = {executors: {list: []}};
            const featureToggles = {
                screening_questions: false,
                document_upload: false
            };

            co(function* () {
                [ctx] = yield Summary.handleGet(ctx, formdata, featureToggles);
                assert.equal(ctx.isScreeningQuestionToggleEnabled, expectedResponse);
                assert.equal(ctx.isDocumentUploadToggleEnabled, expectedResponse);
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

const {expect} = require('chai');

describe('Summary', () => {
    const summary = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]).Summary;

    describe('getUrl()', () => {
        it('should return correct url', (done) => {
            const url = summary.constructor.getUrl();
            expect(url).to.include('/summary');
            done();
        });

        it('should end with * when no index supplied', (done) => {
            const url = summary.constructor.getUrl();
            expect(url).to.equal('/summary/*');
            done();
        });

        it('should end with supplied index ', (done) => {
            const url = summary.constructor.getUrl(1);
            expect(url).to.equal('/summary/1');
            done();
        });
    });

});
