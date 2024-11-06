'use strict';

module.exports = async function({language, hasCodicils = false, decName, applName = null,} = {}) {
    const I = this;

    const summaryContent = require(`app/resources/${language}/translation/summary`);
    const marriedContent = require(`app/resources/${language}/translation/deceased/married`);
    const nameAsOnWillContent = require(`app/resources/${language}/translation/applicant/nameasonwill`);

    let marriedQuestion;
    let applQuestion;
    if (hasCodicils) {
        marriedQuestion = marriedContent.questionWithCodicil.replace('{deceasedName}', decName);
        if (applName) {
            applQuestion = nameAsOnWillContent.questionWithCodicil.replace('{applicantName}', applName);
        } else {
            applQuestion = nameAsOnWillContent.questionWithoutNameWithCodicil;
        }
    } else {
        marriedQuestion = marriedContent.question.replace('{deceasedName}', decName);
        if (applName) {
            applQuestion = nameAsOnWillContent.question.replace('{applicantName}', applName);
        } else {
            applQuestion = nameAsOnWillContent.questionWithoutName;
        }
    }

    await I.checkInUrl('/task-list');
    await I.navByClick({css: 'ol.task-list > li > div > p > a'});

    await I.waitForText(summaryContent.heading);

    await I.waitForText(marriedQuestion);
    await I.waitForText(applQuestion);

    await I.navByClick({css: '.govuk-button'});
};
