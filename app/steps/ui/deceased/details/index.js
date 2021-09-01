'use strict';

const DateStep = require('app/core/steps/DateStep');
const FieldError = require('app/components/error');

class DeceasedDetails extends DateStep {

    static getUrl() {
        return '/deceased-details*';
    }

    dateName() {
        return ['dob', 'dod'];
    }

    handlePost(ctx, errors, formdata, session) {
        const dob = new Date(`${ctx['dob-year']}-${ctx['dob-month']}-${ctx['dob-day']}`);
        const dod = new Date(`${ctx['dod-year']}-${ctx['dod-month']}-${ctx['dod-day']}`);
        const today = new Date();

        dob.setHours(0, 0, 0, 0);
        dod.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (dob >= today) {
            errors.push(FieldError('dob-date', 'dateInFuture', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        } else if (dob >= dod) {
            errors.push(FieldError('dob-date', 'dodBeforeDob', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }

        if (dod > today) {
            errors.push(FieldError('dod-date', 'dateInFuture', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }

        return [ctx, errors];
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('notDiedAfterOctober2014');
    }

    nextStepOptions(ctx) {
        const dod = new Date(`${ctx['dod-year']}-${ctx['dod-month']}-${ctx['dod-day']}`);
        const dod1Oct2014 = new Date('2014-10-01');
        dod1Oct2014.setHours(0, 0, 0, 0);

        ctx.diedAfterOctober2014 = dod >= dod1Oct2014;

        return {
            options: [
                {key: 'diedAfterOctober2014', value: true, choice: 'diedAfter'}
            ]
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.diedAfterOctober2014;
        return [ctx, formdata];
    }
}

module.exports = DeceasedDetails;
