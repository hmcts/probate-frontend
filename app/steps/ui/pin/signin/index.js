const WithLinkStepRunner = require('app/core/runners/WithLinkStepRunner'),
    ValidationStep = require('app/core/steps/ValidationStep'),
    FieldError = require('app/components/error'),
    services = require('app/components/services');

module.exports = class PinPage extends ValidationStep {

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
            yield services.loadFormData(session.formdataId)
            .then(result => {
                if (result.name === 'Error') {
                    throw new ReferenceError('Error getting the co-applicant\'s data');
                } else {
                    delete result.formdata.declaration.declarationCheckbox
                    session.form = result.formdata;
            }
});
        }
        return [ctx, errors];
    }
};
