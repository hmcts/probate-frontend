'use strict';

const i18next = require('i18next');
const mapValues = require('lodash').mapValues;
const JourneyMap = require('app/core/JourneyMap');

const commonContent = (language = 'en') => {
    i18next.changeLanguage(language);
    const common = require(`app/resources/${language}/translation/common`);
    return mapValues(common, (value, key) => i18next.t(`common.${key}`));
};

const updateTaskStatus = (ctx, req, steps) => {
    const formdata = req.session.form;
    const journeyMap = new JourneyMap(req.session.journey);
    const taskList = journeyMap.taskList();

    Object.keys(taskList).forEach((taskName) => {
        const task = taskList[taskName];
        let status = 'notStarted';
        let step = steps[task.firstStep];

        while (step.name !== task.lastStep) {
            const localctx = step.getContextData(req);
            const featureToggles = req.session.featureToggles;
            const [stepCompleted, progressFlag] = step.isComplete(localctx, formdata, featureToggles);
            const nextStep = step.next(req, localctx);
            if (stepCompleted && nextStep !== steps.StopPage) {
                status = progressFlag !== 'noProgress' ? 'started' : status;
                step = nextStep;
            } else {
                break;
            }
        }
        status = step.name === task.lastStep ? 'complete' : status;
        const nextURL = step.constructor.getUrl();
        const checkYourAnswersLink = steps[task.summary].constructor.getUrl();

        ctx[taskName] = {status, nextURL, checkYourAnswersLink};
    });
};

const formattedDate = (date, language) => {
    const month = commonContent(language).months.split(',')[date.month()].trim();
    return `${date.date()} ${month} ${date.year()}`;
};

module.exports = {
    commonContent,
    updateTaskStatus,
    formattedDate
};
