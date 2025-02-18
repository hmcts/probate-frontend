'use strict';

const {mapValues, reduce} = require('lodash');
const Ajv = require('ajv');
const Step = require('app/core/steps/Step');
const generateErrors = require('app/components/error').generateErrors;
const validator = new Ajv({allErrors: true, v5: true});
require('ajv-keywords')(validator);

class ValidationStep extends Step {

    get schema() {
        if (!this.schemaFile) {
            throw new TypeError(`Step ${this.name} has no schema file in it's resource folder`);
        }
        return this.schemaFile;
    }

    get saveSchema() {
        if (!this.schemaFile) {
            throw new TypeError(`Step ${this.name} has no schema file in it's resource folder`);
        }
        const saveSchema = {...this.schemaFile};
        const altId = saveSchema.$id + '-save';
        saveSchema.$id = altId;
        delete saveSchema.required;
        return saveSchema;
    }

    constructor(steps, section, templatePath, i18next, schema, language = 'en') {
        super(steps, section, templatePath, i18next, schema, language);

        this.schemaFile = schema;
        this.validateSchema = validator.compile(this.schema);
        this.validateSaveSchema = validator.compile(this.saveSchema);
        this.properties = this.uniqueProperties(this.schema);
    }

    uniqueProperties(schema) {
        if (schema.properties) {
            return schema.properties;
        }

        if (schema.oneOf) {

            const properties = reduce(schema.oneOf, (acc, s) => {
                Object.assign(acc, s.properties);
                return acc;
            }, {});

            return mapValues(properties, (v) => ({type: v.type}));
        }

        throw new Error(`Step ${this.name} has an invalid schema: schema has no properties or oneOf keywords`);
    }

    validate(ctx, formdata, language, isSaveAndClose) {
        let [isValid, errors] = [true, []];

        const removeEmptyFields = field => (typeof ctx[field] === 'string' && ctx[field].trim() === '') || ctx[field] === '';

        //remove empty fields as ajv expects them to be absent
        Object.keys(ctx).filter(removeEmptyFields)
            .forEach((field) => {
                delete ctx[field];
            });

        if (ctx) {
            const validator = isSaveAndClose ? this.validateSaveSchema : this.validateSchema;

            isValid = validator(ctx);
            errors = isValid ? [] : generateErrors(validator.errors, ctx, formdata, `${this.resourcePath}`, language);
        }
        return [isValid, errors];
    }

    isComplete(ctx, formdata) {
        return [this.validate(ctx, formdata)[0], 'inProgress'];
    }
}

module.exports = ValidationStep;
