'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/deceased/otherNames/index');

module.exports = function (noOfAliases) {
    const I = this;
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    let i = 1;

    let deceasedOtherNames = '';
    let connective;

    while (i <= noOfAliases) {
        if (i === 1) {
            I.fillField(`#otherNames_name_${i-1}_firstName`, `alias_firstnames_${i}`);
            I.fillField(`#otherNames_name_${i-1}_lastName`, `alias_lastnames_${i}`);
            deceasedOtherNames += `alias_firstnames_${i} alias_lastnames_${i}`;
        } else {
            I.waitForNavigationToComplete('input[value="Add another name"]');
            I.fillField(`#otherNames_name_${i-1}_firstName`, `alias_firstnames_${i}`);
            I.fillField(`#otherNames_name_${i-1}_lastName`, `alias_lastnames_${i}`);

            if (i < noOfAliases) {
                connective = ', ';
            } else {
                connective = ' and ';
            }
            deceasedOtherNames += connective;
            deceasedOtherNames += `alias_firstnames_${i} alias_lastnames_${i}`;
        }
        i += 1;
    }

    I.persistMainApplicant('{deceasedOtherNames}', deceasedOtherNames);

    I.waitForNavigationToComplete(`input[value="${commonContent.saveAndContinue}"]`);
};
