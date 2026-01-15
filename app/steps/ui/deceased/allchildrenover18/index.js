'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');

class AllChildrenOver18 extends ValidationStep {

    static getUrl() {
        return '/all-children-over-18';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        ctx.relationshipToDeceased = formdata.applicant && formdata.applicant.relationshipToDeceased;
        return ctx;
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('childrenUnder18');
    }

    nextStepOptions(ctx) {
        ctx.childAndAllChildrenOver18 = ctx.relationshipToDeceased === 'optionChild' && ctx.allChildrenOver18 === 'optionYes';
        ctx.grandchildAndAllChildrenOver18 = ctx.relationshipToDeceased === 'optionGrandchild' && ctx.allChildrenOver18 === 'optionYes';
        return {
            options: [
                {key: 'childAndAllChildrenOver18', value: true, choice: 'childAndAllChildrenOver18'},
                {key: 'grandchildAndAllChildrenOver18', value: true, choice: 'grandchildAndAllChildrenOver18'}
            ]
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.deceasedName;
        return [ctx, formdata];
    }
}

module.exports = AllChildrenOver18;
