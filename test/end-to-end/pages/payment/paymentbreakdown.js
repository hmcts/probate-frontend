'use strict';

const pageUnderTest = require('app/steps/ui/payment/breakdown/index');
const paymentBreakdownContent = require('app/resources/en/translation/payment/breakdown');

module.exports = function (noUKCopies, noOverseasCopies, estateNetValue, isFailed) {
    const I = this;

    if (!isFailed) {
        I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    } else {
        I.seeCurrentUrlEquals('/payment-breakdown?status=failure');
    }

    I.see(paymentBreakdownContent.heading);
    I.see(paymentBreakdownContent.applicationFee);

    let totalFee = 0;

    if (estateNetValue > 5000) {
        I.see(`£${215}`);
        totalFee += 215;
    } else {
        I.see(`£${0}`);
    }
    if (noUKCopies > 0) {
        I.see(paymentBreakdownContent.extraCopiesFeeUk);
        const cost = 0.5*noUKCopies;
        I.see(`£${cost}`);
        totalFee += cost;
    } else {
        I.dontSee(paymentBreakdownContent.extraCopiesFeeUk);
    }
    if (noOverseasCopies > 0) {
        I.see(paymentBreakdownContent.extraCopiesFeeOverseas);
        const cost = 0.5 * noOverseasCopies;
        I.see(`£${cost}`);
        totalFee += cost;
    } else {
        I.dontSee(paymentBreakdownContent.extraCopiesFeeOverseas);
    }

    I.see(paymentBreakdownContent.total);
    I.see(`£${totalFee}`);


    I.waitForNavigationToComplete('.button');
};

function seeThenReturnApplicationFee(I, estateNetValue) {
    if (estateNetValue > 5000) {
        I.see(`£${215}`);
        return 215;
    }
    I.see(`£${0}`);
    return 0;
}

function seeThenReturnUKCopiesFee(I, noUKCopies) {
    if (noUKCopies > 0) {
        I.see(paymentBreakdownContent.extraCopiesFeeUk);
        const cost = 0.5*noUKCopies;
        I.see(`£${cost}`);
        return cost;
    }
    I.dontSee(paymentBreakdownContent.extraCopiesFeeUk);
    return 0;
}

function seeThenReturnOverseasCopiesFee(I, noOverseasCopies) {
    if (noOverseasCopies > 0) {
        I.see(paymentBreakdownContent.extraCopiesFeeOverseas);
        const cost = 0.5 * noOverseasCopies;
        I.see(`£${cost}`);
        return cost;
    }
    I.dontSee(paymentBreakdownContent.extraCopiesFeeOverseas);
    return 0;
}
