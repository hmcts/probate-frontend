'use strict';

const initSteps = require('app/core/initSteps');
const assert = require('chai').assert;
const {isNil} = require('lodash');

describe('Co-Applicant', function () {

    const steps = initSteps([__dirname + '/../../app/steps/action/', __dirname + '/../../app/steps/ui']);

    it('test pin has been removed from the session', () => {
        const CoApp = steps.CoApplicantStartPage;
        const req = {
            session: {
                form: {},
                pin: '12345'
            }
        };

        CoApp.getContextData(req);
        assert.isTrue(isNil(req.session.pin));
    });

});
