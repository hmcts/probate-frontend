const initSteps = require('app/core/initSteps'),
    assert = require('chai').assert;

describe('AddAlias', function () {

    const steps = initSteps([__dirname + '/../../app/steps/action/', __dirname + '/../../app/steps/ui']);

    describe('handlePost', function () {

        it('Adds other names to formdata', function (done) {
            let ctx = {
                otherNames: {
                    name_0: {
                        firstName: 'alias1',
                        lastName: 'one'
                    },
                    name_1: {
                        firstName: 'alias2',
                        lastName: 'two'
                    }
                }
            };

            let errors = {};

            const formdata = {};

            const AddAlias = steps.AddAlias;
            [ctx, errors] = AddAlias.handlePost(ctx, errors, formdata).next().value;
            assert.exists(formdata.deceased.otherNames);
            done();
        });

    });

});
