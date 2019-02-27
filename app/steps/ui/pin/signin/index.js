'use strict';

const WithLinkStepRunner = require('app/core/runners/WithLinkStepRunner');
const ValidationStep = require('app/core/steps/ValidationStep');
const FieldError = require('app/components/error');
const config = require('app/config');
const ServiceMapper = require('app/utils/ServiceMapper');

class PinPage extends ValidationStep {

    static getUrl () {
        return '/sign-in';
    }

    runner() {
        return new WithLinkStepRunner();
    }

    * handlePost(ctx, errors, formdata, session) {
        if (parseInt(session.pin) !== parseInt(ctx.pin)) {
            errors.push(FieldError('pin', 'incorrect', this.resourcePath, this.generateContent()));
        } else {
            const formData = ServiceMapper.map(
                'FormData',
                [config.services.persistence.url, ctx.sessionID],
                ctx.journeyType
            );
            yield formData.get(session.formdataId)
                .then(result => {
                    if (result.name === 'Error') {
                        throw new ReferenceError('Error getting data for the co-applicant');
                    } else {
                        delete result.formdata.declaration.declarationCheckbox;
                        session.form = result.formdata;
                    }
                });
        }
        return [ctx, errors];
    }
}

module.exports = PinPage;
