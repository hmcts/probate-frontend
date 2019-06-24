'use strict';

const caseTypes = {
    INTESTACY: 'intestacy',
    GOP: 'gop'
};

const isIntestacyCaseType = (session) => {
    if (session.caseType) {
        return session.caseType === caseTypes.INTESTACY;
    } else if (session.form && session.form.caseType) {
        return session.form.caseType === caseTypes.INTESTACY;
    }
    return false;
};

const setCaseTypeFormdata = (session) => {
    if (session.caseType) {
        if (!session.form.caseType) {
            session.form.caseType = isIntestacyCaseType(session) ? caseTypes.INTESTACY : caseTypes.GOP;
        }
    }
    return session;
};

const getCaseType = (session) => {
    return isIntestacyCaseType(session) ? caseTypes.INTESTACY : caseTypes.GOP;
};

module.exports = caseTypes;
module.exports.getCaseType = getCaseType;
module.exports.isIntestacyCaseType = isIntestacyCaseType;
module.exports.setCaseTypeFormdata = setCaseTypeFormdata;
