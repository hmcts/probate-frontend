const DateStep = require('app/core/steps/DateStep');

module.exports = class WillDate extends DateStep {

    static getUrl() {
        return '/will-date';
    }

    dateName() {
        return 'willDate';
    }

    parseDate(ctx, dateName) {
        if (ctx.isWillDate === this.generateContent(ctx).optionYes) {
            super.parseDate(ctx, dateName);
        }
    }

    action(ctx, formdata) {
        if (ctx.isWillDate === this.generateContent(ctx, formdata).optionNo) {
            delete ctx.willDate_day;
            delete ctx.willDate_month;
            delete ctx.willDate_year;
            delete ctx.willDate_date;
        }
        super.action(ctx, formdata);
        return [ctx, formdata];
    }
};
