'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const contentMaritalStatus = require('app/resources/en/translation/deceased/maritalstatus');
const content = require('app/resources/en/translation/deceased/divorceplace');
const commonContent = require('app/resources/en/translation/common');
const {set} = require('lodash');

class DivorcePlace extends ValidationStep {

    static getUrl() {
        return '/deceased-divorce-or-separation-place';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;

        if (formdata.deceased && formdata.deceased.maritalStatus) {
            ctx.legalProcess = formdata.deceased.maritalStatus === contentMaritalStatus.optionDivorced ? contentMaritalStatus.divorce : contentMaritalStatus.separation;
        }

        return ctx;
    }

    generateFields(ctx, errors) {
        const fields = super.generateFields(ctx, errors);

        set(fields, 'title.value', `${content.title} - ${commonContent.serviceName}`);

        if (ctx && ctx.legalProcess) {
            set(fields, 'title.value', fields.title.value.replace('{legalProcess}', ctx.legalProcess));

            if (fields.divorcePlace && fields.divorcePlace.error) {
                set(fields, 'divorcePlace.errorMessage.summary', fields.divorcePlace.errorMessage.summary.replace('{legalProcess}', ctx.legalProcess));
                set(fields, 'divorcePlace.errorMessage.message', fields.divorcePlace.errorMessage.message.replace('{legalProcess}', ctx.legalProcess));
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
                {key: 'divorcePlace', value: content.optionYes, choice: 'inEnglandOrWales'},
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
