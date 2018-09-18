'use strict';

const ExecutorsWrapper = require('app/wrappers/Executors');
const services = require('app/components/services');
const FormatName = require('app/utils/FormatName');
const logger = require('app/components/logger')();

class UpdateExecutorInvite {
    static update(session) {
        const formdata = session.form;
        const executorsWrapper = new ExecutorsWrapper(formdata.executors);
        const executorsEmailChangedList = executorsWrapper.executorsEmailChangedList();

        const promises = executorsEmailChangedList
            .map(exec => {
                const data = {
                    invitation: {
                        executorName: exec.fullName,
                        firstName: formdata.deceased.firstName,
                        lastName: formdata.deceased.lastName,
                        email: exec.email,
                        phoneNumber: exec.mobile,
                        formdataId: session.regId,
                        leadExecutorName: FormatName.format(formdata.applicant)
                    }
                };
                return services.sendInvite(data, session.id, exec);
            });
        return Promise.all(promises).then(result => {
            if (result.some(r => r.name === 'Error')) {
                logger.error(`Error while sending emails to updated email address: ${result}`);
                throw new ReferenceError('Error while sending co-applicant invitation email.');
            }
            formdata.executors.list = executorsWrapper.removeExecutorsEmailChangedFlag();
            return formdata.executors;
        });
    }
}

module.exports = UpdateExecutorInvite;
