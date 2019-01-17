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

    totalFee += seeThenAddApplicationFee(I, estateNetValue);
    totalFee += seeThenAddUKCopiesFee(I, noUKCopies);
    totalFee += seeThenAddOverseasCopiesFee(I, noOverseasCopies);

    I.see(paymentBreakdownContent.total);
    I.see(`£${totalFee}`);

    I.awaitNavigation(() => I.click('.button'));
};

function seeThenAddApplicationFee(I, estateNetValue) {
    if (estateNetValue > 5000) {
        I.see(`£${215}`);
        return 215;
    }
    I.see(`£${0}`);
    return 0;
}

function seeThenAddUKCopiesFee(I, noUKCopies) {
    if (noUKCopies > 0) {
        I.see(paymentBreakdownContent.extraCopiesFeeUk);
        const cost = 0.5*noUKCopies;
        I.see(`£${cost}`);
        return cost;
    }
    I.dontSee(paymentBreakdownContent.extraCopiesFeeUk);
    return 0;
}

function seeThenAddOverseasCopiesFee(I, noOverseasCopies) {
    if (noOverseasCopies > 0) {
        I.see(paymentBreakdownContent.extraCopiesFeeOverseas);
        const cost = 0.5 * noOverseasCopies;
        I.see(`£${cost}`);
        return cost;
    }
    I.dontSee(paymentBreakdownContent.extraCopiesFeeOverseas);
    return 0;
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
