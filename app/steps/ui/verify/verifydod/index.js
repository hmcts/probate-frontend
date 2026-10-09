'use strict';

const DateStep = require('app/core/steps/DateStep');
const FieldError = require('app/components/error');
const FormatName = require('../../../../utils/FormatName');
const caseTypes = require('../../../../utils/CaseTypes');
const DateValidation = require('../../../../utils/DateValidation');

class VerifyDod extends DateStep {

    static getUrl() {
        return '/verify-dod';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        const formdataApplicant = formdata.applicant || {};
        ctx.applicantName = FormatName.format(formdataApplicant);
        ctx.deceasedName = FormatName.format(req.session.form.deceased);
        return ctx;
    }

    dateName() {
        return ['dod'];
    }

    static createDate(year, month, day) {
        // Date.UTC months are zero-based (0-11), while form months are 1-12
        return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
    }

    // eslint-disable-next-line complexity
    handlePost(ctx, errors, formdata, session) {
        let deceasedDod;
        if (session.form.deceased && session.form.deceased['dod-year'] && session.form.deceased['dod-month'] && session.form.deceased['dod-day']) {
            deceasedDod = VerifyDod.createDate(
                session.form.deceased['dod-year'],
                session.form.deceased['dod-month'],
                session.form.deceased['dod-day']
            );
        }
        const day = ctx['dod-day'];
        const month = ctx['dod-month'];
        const year = ctx['dod-year'];
        const verifyDod = VerifyDod.createDate(year, month, day);

        const todayParts = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Europe/London',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        }).formatToParts(new Date());

        const getTodayPart = datePart => Number(todayParts.find(part => part.type === datePart).value);
        const today = VerifyDod.createDate(
            getTodayPart('year'),
            getTodayPart('month'),
            getTodayPart('day')
        );

        const missingFields = ['day', 'month', 'year'].filter(f => typeof ctx[`dod-${f}`] === 'undefined' || ctx[`dod-${f}`] === null || ctx[`dod-${f}`] === '');
        const isDateOutOfRange =
            (day && (day < 1 || day > 31)) ||
            (month && (month < 1 || month > 12)) ||
            (year && (year < 1000 || year > 9999));
        const isNonNumeric = isNaN(Number(day)) || isNaN(Number(month)) || isNaN(Number(year));

        if (missingFields.length === 2) {
            errors.push(FieldError(`dod-${missingFields.join('-')}`, 'required', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        } else if (missingFields.length === 1) {
            errors.push(FieldError(`dod-${missingFields[0]}`, 'required', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        } else if (isNonNumeric || isDateOutOfRange || Number.isNaN(verifyDod.getTime()) || !DateValidation.isPositive([day, month, year])
            || verifyDod.getUTCFullYear() !== Number(year)
            || verifyDod.getUTCMonth() + 1 !== Number(month)
            || verifyDod.getUTCDate() !== Number(day)) {
            // Date.UTC months are zero-based (0-11), while form months are 1-12
            errors.push(FieldError('dod-date', 'invalid', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        } else if (verifyDod > today) {
            errors.push(FieldError('dod-date', 'dateInFuture', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        } else if (!deceasedDod || verifyDod.getTime() !== deceasedDod.getTime()) {
            errors.push(FieldError('dod-date', 'dodNotMatch', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }
        return [ctx, errors];
    }

    generateFields(language, ctx, errors) {
        const fields = super.generateFields(language, ctx, errors);
        if (fields.applicantName && fields.deceasedName && errors) {
            errors[0].msg = errors[0].msg
                .replace('{applicantName}', fields.applicantName.value)
                .replace('{deceasedName}', fields.deceasedName.value);
        }
        return fields;
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).getUrlWithContext(ctx, 'notDiedAfterOctober2014');
    }

    nextStepOptions(ctx) {
        const dod = VerifyDod.createDate(ctx['dod-year'], ctx['dod-month'], ctx['dod-day']);
        const dod1Oct2014 = VerifyDod.createDate(2014, 10, 1);

        ctx.diedAfterOctober2014 = (dod >= dod1Oct2014 && ctx.caseType === caseTypes.INTESTACY) || ctx.caseType === caseTypes.GOP;

        return {
            options: [
                {key: 'diedAfterOctober2014', value: true, choice: 'diedAfter'}
            ]
        };
    }

    shouldPersistFormData() {
        return false;
    }
}

module.exports = VerifyDod;
