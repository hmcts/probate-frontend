'use strict';

const i18next = require('i18next');
const {mapValues, get} = require('lodash');
const JourneyMap = require('app/core/JourneyMap');

const commonContent = (language = 'en') => {
    i18next.changeLanguage(language);
    const common = require(`app/resources/${language}/translation/common`);
    return mapValues(common, (value, key) => i18next.t(`common.${key}`));
};

const updateTaskStatus = (ctx, req, res, steps) => {
    const formdata = req.session.form;
    const journeyMap = new JourneyMap(req.session.journey);
    const taskList = journeyMap.taskList();

    Object.keys(taskList).forEach((taskName) => {

        const task = taskList[taskName];
        let status = 'complete';
        let step = steps[task.firstStep];

        if (!(isDeclarationComplete(formdata) && isPreDeclarationTask(taskName))) {
            status = 'notStarted';

            while (step.name !== task.lastStep) {
                const localctx = step.getContextData(req, res);
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
        }

        const nextURL = step.constructor.getUrl();
        const checkYourAnswersLink = steps[task.summary].constructor.getUrl();

        ctx[taskName] = {status, nextURL, checkYourAnswersLink};
    });
};

const getPreviousUrl = (ctx, req, res, steps, stepName) => {
    const formdata = req.session.form;
    const journeyMap = new JourneyMap(req.session.journey);
    const taskList = journeyMap.taskList();
    let previousUrl='';

    Object.keys(taskList).forEach((taskName) => {
        if (previousUrl !== '') {
            return;
        }
        const task = taskList[taskName];
        let status = 'complete';
        let step = steps[task.firstStep];
        if (stepName===step.name || stepName==='Summary') {
            previousUrl = '/task-list';
            ctx.previousUrl = previousUrl;
            return;
        }
        while (step.name !== stepName && step.name !== task.lastStep) {
            const localctx = step.getContextData(req, res);
            const featureToggles = req.session.featureToggles;
            const [stepCompleted, progressFlag] = step.isComplete(localctx, formdata, featureToggles);
            if (localctx.index > 0) {
                delete localctx.index;
            }
            const nextStep = step.next(req, localctx);
            if (stepName==='ExecutorNotified' || stepName==='Equality') {
                previousUrl = '/executor-roles/*';
                ctx.previousUrl = previousUrl;
                return;
            }
            if (stepCompleted) {
                status = progressFlag !== 'noProgress' ? 'started' : status;
                if (nextStep.name !== stepName) {
                    step = nextStep;
                } else {
                    previousUrl = step.constructor.getUrl();
                    ctx.previousUrl = previousUrl;
                    return;
                }
            } else {
                previousUrl = step.constructor.getUrl();
                ctx.previousUrl = previousUrl;
                return;
            }
        }
    });

};

const getScrennersPreviousUrl = (ctx, req, res, steps, currentStepName) => {
    let previousUrl='';
    const StartEligibilityStep = 'StartEligibility';
    const lastStep = 'MentalCapacity';
    let loopingStep = steps[StartEligibilityStep];
    if (currentStepName === 'StartEligibility') {
        previousUrl = '/dashboard';
        ctx.previousUrl = previousUrl;
        return;
    }
    while (loopingStep.name !== currentStepName && loopingStep.name !== lastStep) {
        const localctx = loopingStep.getContextData(req, res);
        const nextStep = loopingStep.next(req, localctx);
        if (nextStep.name !== currentStepName) {
            if (loopingStep.name!=='StopPage' && nextStep.name!=='StopPage') {
                loopingStep = nextStep;
            } else {
                return;
            }
        } else {
            previousUrl = loopingStep.constructor.getUrl();
            ctx.previousUrl = previousUrl;
            return;
        }
    }
};
const isPreDeclarationTask = (taskName) => {
    return taskName === 'DeceasedTask' || taskName === 'ExecutorsTask';
};

const isDeclarationComplete = (formdata) => {
    return get(formdata, 'declaration.declarationCheckbox') === 'true';
};

const formattedDate = (date, language) => {
    const month = commonContent(language).months.split(',')[date.month()].trim();
    return `${date.date()} ${month} ${date.year()}`;
};

module.exports = {
    commonContent,
    updateTaskStatus,
    getPreviousUrl,
    getScrennersPreviousUrl,
    formattedDate
};
