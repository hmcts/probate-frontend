'use strict';

const ExecutorsWrapper = require('./Executors');
const executorsInviteSchema = require('app/steps/ui/executors/invite/schema');

class DetectDataChanges {
    isNotEqual(val1, val2) {
        val2 = val2 || '';
        return val1.toString() !== val2.toString();
    }

    sectionDataKey(paramsKey) {
        if (['postcodeAddress', 'freeTextAddress'].includes(paramsKey)) {
            return 'address';
        }
        return paramsKey;
    }

    hasChanged(params, sectionData) {
        return Object.keys(params).some(paramsKey => {
            const sectionDataKey = this.sectionDataKey(paramsKey);
            return sectionData && sectionData[sectionDataKey] && this.isNotEqual(params[paramsKey], sectionData[sectionDataKey]);
        });
    }

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
            step.schemaFile.id !== executorsInviteSchema.id &&
            formdata[step.section] &&
            formdata.declaration &&
            !formdata.declaration.hasDataChanged
        ) {
            if (step.section === 'executors') {
                if (Object.keys(req.body).includes('freeTextAddress') || Object.keys(req.body).includes('email')) {
                    const index = (req.params && !isNaN(req.params[0])) ? req.params[0] : req.session.indexPosition;
                    return this.hasChanged(req.body, formdata[step.section].list[index]);
                } else if (req.body.executorName) {
                    const currentExecutors = executorsWrapper.executors(true).map(executor => executor.fullName);
                    return this.isNotEqual(req.body.executorName, currentExecutors);
                } else if (req.body.executorsApplying) {
                    const executorsApplying = executorsWrapper.executorsApplying(true).map(executor => executor.fullName);
                    return this.isNotEqual(req.body.executorsApplying, executorsApplying);
                }
            }
            return this.hasChanged(req.body, formdata[step.section]);
        }

        return false;
    }
}

module.exports = DetectDataChanges;
