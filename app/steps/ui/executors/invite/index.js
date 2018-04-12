const ValidationStep = require('app/core/steps/ValidationStep'),
    services = require('app/components/services'),
    {get} = require('lodash');

    module.exports = class ExecutorsInvite extends ValidationStep {

    static getUrl() {
        return '/executors-invite';
    }

    nextStepUrl(ctx) {
        return this.next(ctx).constructor.getUrl();
    }

    * handlePost(ctx, errors, formdata, session) {
        const mainExecutorName = get(formdata, 'applicant.firstName') + ' ' + get(formdata, 'applicant.lastName');

        yield ctx.list
            .filter(exec => exec.isApplying && !exec.isApplicant)
            .map(exec => {
                const data = {
                    invitation: {
                        executorName: exec.fullName,
                        firstName: formdata.deceased.firstName,
                        lastName: formdata.deceased.lastName,
                        email: exec.email,
                        phoneNumber: exec.mobile,
                        formdataId: session.regId,
                        leadExecutorName: mainExecutorName
                    }
                }
                return services.sendInvite(data, session.id, exec).then(result => {
                    if (result.name === 'Error') {
                        throw new ReferenceError('Error while sending co-applicant invitation email.');
                    } else {
                        exec.inviteId = result;
                        exec.emailSent = true;
                        return exec;
                    }
                })
            });
        ctx.invitesSent = 'true';
        return [ctx, errors];
    }

    isComplete(ctx) {
        return [ctx.invitesSent, 'inProgress'];
    }
};