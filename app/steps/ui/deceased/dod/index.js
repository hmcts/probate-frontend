'use strict';

const DateStep = require('app/core/steps/DateStep');
const FieldError = require('app/components/error');
const FormatName = require('../../../../utils/FormatName');
const caseTypes = require('../../../../utils/CaseTypes');

class DeceasedDod extends DateStep {

    static getUrl() {
        return '/deceased-dod';
    }

    dateName() {
        return ['dod'];
    }

    handlePost(ctx, errors, formdata, session) {
        let dob;
        if (session.form.deceased && session.form.deceased['dob-year'] && session.form.deceased['dob-month'] && session.form.deceased['dob-day']) {
            dob = new Date(`${session.form.deceased['dob-year']}-${session.form.deceased['dob-month']}-${session.form.deceased['dob-day']}`);
            dob.setHours(0, 0, 0, 0);
        }

        const dod = new Date(`${ctx['dod-year']}-${ctx['dod-month']}-${ctx['dod-day']}`);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (dod > today) {
            errors.push(FieldError('dod-date', 'dateInFuture', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        } else if (typeof dob === 'object' && dob > dod) {
            errors.push(FieldError('dod-date', 'dodBeforeDob', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }

        return [ctx, errors];
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.deceasedName = FormatName.format(req.session.form.deceased);
        return ctx;
    }

    generateFields(language, ctx, errors) {
        const fields = super.generateFields(language, ctx, errors);
        if (fields.deceasedName && errors) {
            errors[0].msg = errors[0].msg.replace('{deceasedName}', fields.deceasedName.value);
        }
        return fields;
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('notDiedAfterOctober2014');
    }

    nextStepOptions(ctx) {
        const dod = new Date(`${ctx['dod-year']}-${ctx['dod-month']}-${ctx['dod-day']}`);
        const dod1Oct2014 = new Date('2014-10-01');
        dod1Oct2014.setHours(0, 0, 0, 0);

        ctx.diedAfterOctober2014 = (dod >= dod1Oct2014 && ctx.caseType === caseTypes.INTESTACY) || ctx.caseType === caseTypes.GOP;

        return {
            options: [
                {key: 'diedAfterOctober2014', value: true, choice: 'diedAfter'}
            ]
        };
    }
}

module.exports = DeceasedDod;
