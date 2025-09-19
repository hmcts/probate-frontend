'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FieldError = require('app/components/error');
const FormatDate = require('app/utils/FormatDate');
const DateValidation = require('app/utils/DateValidation');
const moment = require('moment');
const FormatName = require('../../../../utils/FormatName');

class DivorceDate extends ValidationStep {

    static getUrl() {
        return '/deceased-divorce-or-separation-date';
    }

    handleGet(ctx) {
        if (ctx.divorceDate) {
            [ctx['divorceDate-year'], ctx['divorceDate-month'], ctx['divorceDate-day']] = FormatDate.formatDateGetHyphen(ctx.divorceDate);
        }
        return [ctx];
    }

    getContextData(req) {
        const contentMaritalStatus = require(`app/resources/${req.session.language}/translation/deceased/maritalstatus`);
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(req.session.form.deceased);

        if (formdata.deceased && formdata.deceased.maritalStatus) {
            ctx.legalProcess = formdata.deceased.maritalStatus === 'optionDivorced' ? contentMaritalStatus.divorce : contentMaritalStatus.separation;
        }

        return ctx;
    }

    handlePost(ctx, errors, formdata, session) {

        if (ctx.divorceDateKnown === 'optionNo') {
            delete ctx['divorceDate-day'];
            delete ctx['divorceDate-month'];
            delete ctx['divorceDate-year'];
            ctx.divorceDate = '';
            return [ctx, errors];
        }

        const day = ctx['divorceDate-day'];
        const month = ctx['divorceDate-month'];
        const year = ctx['divorceDate-year'];

        const dateOutOfRange =
            (day && (day < 1 || day > 31)) ||
            (month && (month < 1 || month > 12)) ||
            (year && (year < 1000 || year > 9999));

        const DATE_FORMATS = ['D/M/YYYY', 'DD/MM/YYYY', 'D/MM/YYYY', 'DD/M/YYYY'];
        const divorceDate = moment(`${day}/${month}/${year}`, DATE_FORMATS, true).parseZone();

        const missingFields = [];
        if (!day) {
            missingFields.push('day');
        }
        if (!month) {
            missingFields.push('month');
        }
        if (!year) {
            missingFields.push('year');
        }

        if (missingFields.length === 3) {
            errors.push(FieldError('divorceDate', 'required', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        } else if (missingFields.length === 2) {
            errors.push(FieldError(`divorceDate-${missingFields.join('-')}`, 'required', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        } else if (missingFields.length === 1) {
            errors.push(FieldError(`divorceDate-${missingFields[0]}`, 'required', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        } else if (dateOutOfRange || !divorceDate.isValid() || !DateValidation.isPositive([day, month, year])) {
            errors.push(FieldError('divorceDate', 'invalid', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        } else if (divorceDate.isAfter(moment())) {
            errors.push(FieldError('divorceDate', 'future', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }

        return [ctx, errors];
    }

    generateFields(language, ctx, errors) {
        const commonContent = require(`app/resources/${language}/translation/common`);
        const content = require(`app/resources/${language}/translation/deceased/divorcedate`);
        const fields = super.generateFields(language, ctx, errors);

        fields.title = `${content.title} - ${commonContent.serviceName}`;

        if (ctx && ctx.legalProcess) {
            fields.title = fields.title.replace('{legalProcess}', ctx.legalProcess);

            const divorceDateFields = [
                'divorceDate',
                'divorceDate-day',
                'divorceDate-month',
                'divorceDate-year',
                'divorceDate-day-month',
                'divorceDate-day-year',
                'divorceDate-month-year'
            ];

            divorceDateFields.forEach(field => {
                if (fields[field] && fields[field].error) {
                    fields[field].errorMessage = fields[field].errorMessage
                        .replace('{legalProcess}', ctx.legalProcess)
                        .replace('{deceasedName}', fields.deceasedName.value);
                    errors[0].msg = fields[field].errorMessage;
                }
            });
            if (fields.divorceDateKnown && fields.divorceDateKnown.error) {
                fields.divorceDateKnown.errorMessage = fields.divorceDateKnown.errorMessage.replace('{legalProcess}', ctx.legalProcess);
                errors[0].msg = fields.divorceDateKnown.errorMessage;
            }
        }

        return fields;
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.legalProcess;
        delete ctx['divorceDate-day'];
        delete ctx['divorceDate-month'];
        delete ctx['divorceDate-year'];
        return [ctx, formdata];
    }
}

module.exports = DivorceDate;
