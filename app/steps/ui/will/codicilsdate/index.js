const DateStep = require('app/core/steps/DateStep');
const WillWrapper = require('app/wrappers/Will');

module.exports = class CodicilsDate extends DateStep {

    static getUrl() {
        return '/codicils-date';
    }

    dateName() {
        return 'codicilsDate';
    }

    parseDate(ctx, dateName) {
        super.parseDate(ctx, dateName);
    }

    action(ctx, formdata) {
        if (ctx.isCodicilsDate === this.generateContent(ctx, formdata).optionNo) {
            delete ctx.codicilsDate_day;
            delete ctx.codicilsDate_month;
            delete ctx.codicilsDate_year;
            delete ctx.codicilsDate_date;
            delete ctx.codicilsDate_formattedDate;
        }
        super.action(ctx, formdata);
        return [ctx, formdata];
    }

    isSoftStop(formdata) {
        const hasCodicilsDate = (new WillWrapper(formdata.will)).hasCodicilsDate();

        return {
            'stepName': this.constructor.name,
            'isSoftStop': hasCodicilsDate === false
        };
    }
};
