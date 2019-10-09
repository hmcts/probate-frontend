'use strict';

class FormatCcdCaseId {
    static format(ccdCase) {
        if (ccdCase && ccdCase.id) {
            const ccdCaseId = ccdCase.id.toString();

            if (!ccdCaseId.includes('-')) {
                return ccdCaseId.match(/.{1,4}/g).join('-');
            }

            return ccdCaseId;
        }

        return '';
    }

    static formatAccessible(ccdCase) {
        let ccdCaseId = this.format(ccdCase);

        ccdCaseId = ccdCaseId
            .toString()
            .split('')
            .join(' ')
            .replace(/ - /g, ', -, ');

        return ccdCaseId;
    }
}

module.exports = FormatCcdCaseId;
