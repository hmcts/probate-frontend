'use strict';

const caseTypes = {
    INTESTACY: 'intestacy',
    GOP: 'gop'
};

const isIntestacyCaseType = (session) => {
    if (session.form && session.form.caseType) {
        return session.form.caseType === caseTypes.INTESTACY;
    } else if (session.caseType) {
        return session.caseType === caseTypes.INTESTACY;
    }
    return false;
};

const setCaseTypeFormdata = (session) => {
    if (isIntestacyCaseType(session)) {
        session.form.caseType = caseTypes.INTESTACY;
        session.caseType = caseTypes.INTESTACY;
    } else {
        session.form.caseType = caseTypes.GOP;
        session.caseType = caseTypes.GOP;
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
