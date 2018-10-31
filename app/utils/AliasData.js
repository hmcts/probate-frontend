'use strict';

const {get} = require('lodash');

class AliasData {
    static aliasDataRequiredAfterDeclaration(ctx, formdata) {
        if (get(formdata, 'declaration.declarationCheckbox') &&
               (this.applicantAliasUpdated(ctx, formdata) ||
                this.applicantAliasReasonUpdated(ctx, formdata))
        ) {
            formdata = this.resetDeclaration(formdata);
        }
        return formdata;
    }

    static applicantAliasUpdated(ctx, formdata) {
        return Boolean(get(formdata, 'applicant.nameAsOnTheWill') === 'No' &&
            formdata.applicant.alias !== ctx.alias);
    }

    static applicantAliasReasonUpdated(ctx, formdata) {
        return Boolean(get(formdata, 'applicant.nameAsOnTheWill') === 'No' &&
            formdata.applicant.aliasReason !== ctx.aliasReason);
    }

    static resetDeclaration(formdata) {
        delete formdata.declaration.declarationCheckbox;
        formdata.declaration.hasDataChanged = true;
        return formdata;
    }
}

module.exports = AliasData;
