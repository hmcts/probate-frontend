const initSteps = require('app/core/initSteps');
const assert = require('chai').assert;
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
                main_applicant_alias: true,
                screening_questions: true
            };

            co(function* () {
                [ctx] = yield Summary.handleGet(ctx, formdata, featureToggles);
                assert.deepEqual(ctx.isMainApplicantAliasToggleEnabled, expectedResponse);
                assert.deepEqual(ctx.isScreeningQuestionToggleEnabled, expectedResponse);
                done();
            });
        });

        it('check feature toggles are set correctly to false', (done) => {
            const expectedResponse = false;
            validateFormDataStub.returns(when(expectedResponse));

            let ctx = {session: {form: {}}};
            const formdata = {executors: {list: []}};
            const featureToggles = {
                main_applicant_alias: false,
                screening_questions: false
            };

            co(function* () {
                [ctx] = yield Summary.handleGet(ctx, formdata, featureToggles);
                assert.deepEqual(ctx.isMainApplicantAliasToggleEnabled, expectedResponse);
                assert.deepEqual(ctx.isScreeningQuestionToggleEnabled, expectedResponse);
                done();
            });
        });
    });
});
