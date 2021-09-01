'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class DivorcePlace extends ValidationStep {

    static getUrl() {
        return '/deceased-divorce-or-separation-place*';
    }

    getContextData(req) {
        const contentMaritalStatus = require(`app/resources/${req.session.language}/translation/deceased/maritalstatus`);
        const ctx = super.getContextData(req);
        const formdata = req.session.form;

        if (formdata.deceased && formdata.deceased.maritalStatus) {
            ctx.legalProcess = formdata.deceased.maritalStatus === 'optionDivorced' ? contentMaritalStatus.divorce : contentMaritalStatus.separation;
        }

        return ctx;
    }

    generateFields(language, ctx, errors) {
        const commonContent = require(`app/resources/${language}/translation/common`);
        const content = require(`app/resources/${language}/translation/deceased/divorceplace`);
        const fields = super.generateFields(language, ctx, errors);

        fields.title = `${content.title} - ${commonContent.serviceName}`;

        if (ctx && ctx.legalProcess) {
            fields.title = fields.title.replace('{legalProcess}', ctx.legalProcess);

            if (fields.divorcePlace && fields.divorcePlace.error) {
                fields.divorcePlace.errorMessage = fields.divorcePlace.errorMessage.replace('{legalProcess}', ctx.legalProcess);
                errors[0].msg = fields.divorcePlace.errorMessage;
            }
        }

        return fields;
    }

    nextStepUrl(req, ctx) {
        if (ctx.legalProcess === 'divorce') {
            return this.next(req, ctx).constructor.getUrl('divorcePlace');
        }

        return this.next(req, ctx).constructor.getUrl('separationPlace');
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'divorcePlace', value: 'optionYes', choice: 'inEnglandOrWales'},
            ]
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.legalProcess;
        return [ctx, formdata];
    }
}

module.exports = DivorcePlace;
