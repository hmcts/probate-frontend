/*eslint complexity: ["off"]*/

'use strict';

const ExecutorsWrapper = require('./Executors');
const executorsInviteSchema = require('app/steps/ui/executors/invite/schema');
const {get} = require('lodash');

class DetectDataChanges {
    hasDataChanged(ctx, req, step) {
        const formdata = req.session ? req.session.form : {};
        const executorsWrapper = new ExecutorsWrapper(formdata.executors);
        const hasMultipleApplicants = executorsWrapper.hasMultipleApplicants();
        const multipleApplicantsToSingle = formdata[step.section] &&
            formdata[step.section].executorsNumber > 1 &&
            formdata[step.section].otherExecutorsApplying &&
            ctx.executorsNumber === 1;

        if (hasMultipleApplicants &&
            (req.session.haveAllExecutorsDeclared !== 'true' || multipleApplicantsToSingle) &&
            step.schemaFile &&
            step.schemaFile.id !== executorsInviteSchema.$id &&
            formdata[step.section] &&
            formdata.declaration &&
            (formdata.declaration.declarationCheckbox === 'true' || !formdata.declaration.hasDataChanged || formdata.declaration.hasDataChanged === 'false')
        ) {
            if (step.section === 'executors') {
                const executorsNumberChanged = ctx.executorsNumber !== formdata[step.section].executorsNumber;
                if (executorsNumberChanged) {
                    return true;
                }
                const index = (req.params && !isNaN(req.params[0])) ? req.params[0] : req.session.indexPosition;
                const bodyKeys = Object.keys(req.body);
                if (
                    bodyKeys.includes('email') ||
                    bodyKeys.includes('currentName') ||
                    bodyKeys.includes('currentNameReason') ||
                    bodyKeys.includes('executorNotified') ||
                    bodyKeys.includes('notApplyingReason') ||
                    bodyKeys.includes('otherReason') ||
                    bodyKeys.includes('diedbefore')
                ) {
                    return this.hasChanged(req.body, formdata[step.section].list[index]);
                }
                if (bodyKeys.includes('addressLine1')) {
                    req.body.address = this.sanitiseAddressObject(req.body);
                    return this.hasChanged(req.body, formdata[step.section].list[index]);
                }
                if (bodyKeys.includes('alias')) {
                    const hasOtherName = Boolean(formdata[step.section].list[index].hasOtherName);
                    const aliasIsYes = req.body.alias === 'optionYes';
                    return aliasIsYes !== hasOtherName;
                }
                if (req.body.executorName) {
                    const currentExecutors = executorsWrapper.executors(true).map(executor => executor.fullName);
                    return this.isNotEqual(req.body.executorName, currentExecutors);
                }
                if (req.body.executorsApplying) {
                    const executorsApplying = executorsWrapper.executorsApplying(true).map(executor => executor.fullName);
                    return this.isNotEqual(req.body.executorsApplying, executorsApplying);
                }
                if (req.body.executorsWhoDied) {
                    const executorsWhoDied = executorsWrapper.deadExecutors().map(executor => executor.fullName);
                    return this.isNotEqual(req.body.executorsWhoDied, executorsWhoDied);
                }
            }
            if (Object.keys(req.body).includes('addressLine1')) {
                req.body.address = this.sanitiseAddressObject(req.body);
            }
            return this.hasChanged(req.body, formdata[step.section]);
        }
        return false;
    }

    hasChanged(params, sectionData) {
        return Object.keys(params).some(paramsKey => {
            const sectionDataKey = this.accessDataKey(paramsKey);
            return paramsKey !== 'declarationCheckbox' && sectionData && get(sectionData, sectionDataKey) && this.isNotEqual(get(params, sectionDataKey), get(sectionData, sectionDataKey));
        });
    }

    accessDataKey(paramsKey) {
        if (['addressLine1'].includes(paramsKey)) {
            return 'address.formattedAddress';
        }
        return paramsKey;
    }

    isNotEqual(val1, val2) {
        val2 = val2 || '';
        return val1.toString() !== val2.toString();
    }

    sanitiseAddressObject(address) {
        const sanitisedAddress = {...address};
        delete sanitisedAddress._csrf;
        delete sanitisedAddress.isSaveAndClose;
        sanitisedAddress.formattedAddress = this.getFormattedAddress(sanitisedAddress);
        return sanitisedAddress;
    }

    getFormattedAddress(paramsKey) {
        return Object.values(paramsKey)
            .filter(value => value !== null && value !== '')
            .join(' ');
    }
}

module.exports = DetectDataChanges;
