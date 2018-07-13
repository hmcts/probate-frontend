'use strict';
const initSteps = require('app/core/initSteps');
const assert = require('chai').assert;
const {set} = require('lodash');

describe('WillDate', function () {

    const steps = initSteps([__dirname + '/../../app/steps/action/', __dirname + '/../../app/steps/ui/']);
    const req = {
        session: {}
    };

    beforeEach(function() {
        set(req, 'session.form.will', {
            isWillDate: 'Yes',
            willDate_day: '01',
            willDate_month: '01',
            willDate_year: '2000'
        });
    });

    describe('parseDate', function () {

        it('Creates a date object from three date fields', function () {

            const WillDate = steps.WillDate;

            const ctx = WillDate.getContextData(req);

            assert.equal(ctx.willDate_date, '2000-01-01T00:00:00.000Z');
        });

        it('Creates a date object with full month description', function () {

            const WillDate = steps.WillDate;

            const ctx = WillDate.getContextData(req);

            assert.equal(ctx.willDate_formattedDate, '1 January 2000');
        });

        it('Invalid date gives undefined response', function () {
            set(req, 'session.form.will', {
                isWillDate: 'Yes',
                willDate_day: '31',
                willDate_month: '02',
                willDate_year: '2000'
            });

            const WillDate = steps.WillDate;

            const ctx = WillDate.getContextData(req);

            assert.isUndefined(ctx.willDate_formattedDate);
        });

        it('Clears the three date fields when isWillDate is set to "No"', function () {

            req.session.form.will.isWillDate = 'No';

            const willDate = steps.WillDate;

            const ctx = willDate.getContextData(req);
            willDate.action(ctx);

            assert.isUndefined(ctx.willDate_day);
            assert.isUndefined(ctx.willDate_month);
            assert.isUndefined(ctx.willDate_year);
        });

    });
});
