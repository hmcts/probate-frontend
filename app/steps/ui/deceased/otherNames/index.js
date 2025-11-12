'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FieldError = require('app/components/error');
const {get, set, isEmpty} = require('lodash');
const FormatName = require('app/utils/FormatName');

class DeceasedOtherNames extends ValidationStep {

    static getUrl() {
        return '/other-names';
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'deceasedMarriedAfterDateOnCodicilOrWill', value: true, choice: 'deceasedMarriedAfterDateOnCodicilOrWill'}
            ]
        };
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        if (!ctx.otherNames) {
            set(ctx, 'otherNames.name_0.firstName', '');
            set(ctx, 'otherNames.name_0.lastName', '');
        }
        const formdata = req.session.form;
        ctx.deceasedFullName = FormatName.format(formdata.deceased);
        return ctx;
    }

    validate(ctx, formdata, language) {
        let allValid = true;
        let allErrors = [];
        const otherNameErrors = new Map();

        if (Object.keys(ctx.otherNames).length >= 100) {
            otherNameErrors.set('name_101', [
                FieldError('numberOfOtherNames', 'maxLength', `${this.resourcePath}`, ctx, language)
            ]);
        }

        Object.entries(ctx.otherNames).forEach(([index, otherName]) => {
            const [isValid, errors] = super.validate(otherName, formdata, language);
            allValid = isValid && allValid;
            if (!isEmpty(errors)) {
                otherNameErrors.set(index, errors);
            }
        });
        if (!isEmpty(otherNameErrors)) {
            allErrors = allErrors.concat(Array.from(otherNameErrors));
        }
        return [allValid, allErrors];
    }

    generateFields(language, ctx, errors) {
        const fields = super.generateFields(language, ctx, errors);

        if (get(ctx, 'otherNames')) {
            errors = new Map(errors);
            set(fields, 'otherNames.value', new Map());
            Object.entries(ctx.otherNames).forEach(([index, otherName]) => {
                const otherNameErrors = isEmpty(errors) ? [] : errors.get(index);
                const generated = super.generateFields(language, otherName, otherNameErrors);
                if (otherNameErrors && otherNameErrors.length) {
                    otherNameErrors.forEach(err => {
                        if (err.msg.includes('{deceasedName}') && fields.deceasedFullName) {
                            err.msg = err.msg.replace('{deceasedName}', fields.deceasedFullName.value);
                        }
                    });
                }
                fields.otherNames.value.set(index, generated);
            });
            set(errors, 'otherNames', Array.from(errors));
            set(fields, 'otherNames.value', Array.from(fields.otherNames.value));
        }
        return fields;
    }

    handleGet(ctx, formdata) {
        if (ctx.errors) {
            const errors = ctx.errors;
            delete ctx.errors;
            delete formdata[this.section].errors;
            return [ctx, errors];
        }
        return [ctx];
    }

    handlePost(ctx, errors, formdata, session) {
        if (ctx.otherNames) {
            Object.entries(ctx.otherNames).forEach(([index, otherName]) => {
                const entryErrors = [];
                if (otherName.firstName && otherName.firstName.length < 2) {
                    entryErrors.push(FieldError('firstName', 'minLength', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
                } else if (otherName.firstName && otherName.firstName.length > 100) {
                    entryErrors.push(FieldError('firstName', 'maxLength', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
                }
                if (otherName.lastName && otherName.lastName.length < 2) {
                    entryErrors.push(FieldError('lastName', 'minLength', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
                } else if (otherName.lastName && otherName.lastName.length > 100) {
                    entryErrors.push(FieldError('lastName', 'maxLength', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
                }
                if (entryErrors.length) {
                    errors.push([index, entryErrors]);
                }
            });
        }
        return [ctx, errors];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.deceasedFullName;
        return [ctx, formdata];
    }
}

module.exports = DeceasedOtherNames;
