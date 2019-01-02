'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const InviteData = require('app/services/InviteData');
const config = require('app/config');

class CoApplicantDeclaration extends ValidationStep {

    static getUrl() {
        return '/co-applicant-declaration';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.inviteId = req.session.inviteId;
        ctx.formdataId = req.session.formdataId;
        ctx.applicant = formdata.applicant;

        Object.assign(ctx, formdata.declaration);
        return ctx;
    }

    nextStepOptions() {
        const nextStepOptions = {
            options: [
                {key: 'agreement', value: this.content.optionYes, choice: 'agreed'}
            ]
        };
        return nextStepOptions;
    }

    * handlePost(ctx, errors) {
        const data = {
            agreed: this.content.optionYes === ctx.agreement
        };
        const inviteData = new InviteData(config.services.persistence.url, ctx.journeyType, ctx.sessionID);

        yield inviteData.patch(ctx.inviteId, data)
            .then(result => {
                if (result.name === 'Error') {
                    throw new ReferenceError('Error updating co-applicant\'s data');
                }
            });

        return [ctx, errors];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.inviteId;
        delete ctx.formdataId;
        delete ctx.applicant;
        delete ctx.declaration;
        return [ctx, formdata];
    }
}

module.exports = CoApplicantDeclaration;
