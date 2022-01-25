const UIStepRunner = require('app/core/runners/UIStepRunner');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const sinonChai = require('sinon-chai');
const DetectDataChange = require('app/wrappers/DetectDataChange');
chai.use(sinonChai);
const co = require('co');

describe('UIStepRunner', () => {
    const req = {
        session: {
            language: 'en',
            form: {
                declaration: {
                    declarationCheckbox: 'true'
                }
            },
            back: ['hello']
        }
    };
    it('declarationCheckbox should be false where hasDataChanged is true', (done) => {
        const stepName = 'test';
        const step = {
            name: stepName,
            validate: () => [false, []],
            getContextData: () => '',
            nextStepUrl: () => '',
            action: () => [{}, req.session.form],
            constructor: {
                getUrl: () => 'hello'
            }
        };

        const hasDataChangedStub = sinon.stub(DetectDataChange.prototype, 'hasDataChanged').returns(true);
        const expectedForm = {
            declarationCheckbox: 'false',
            hasDataChanged: true
        };
        const res = {
            redirect: (url) => url
        };

        const runner = new UIStepRunner();
        co(function* () {
            yield runner.handlePost(step, req, res);
            expect(req.session.form.declaration).to.deep.equal(expectedForm);
            expect(req.session.form.eventDescription).equal('Page completed: hello');
            hasDataChangedStub.restore();
            done();
        });

    });
});
