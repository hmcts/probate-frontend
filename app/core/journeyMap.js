const {get} = require('lodash'),
    journey = require('app/journeys/probate'),
    steps = require('app/core/initSteps').steps;

const nextStep = (currentStep, ctx) => {
    let nextStepName = journey.stepList[currentStep.name];
    if (nextStepName !== null && typeof nextStepName === 'object') {
        nextStepName = nextStepName[nextOptionStep(currentStep, ctx)];
    }
    return steps[nextStepName];
};

const nextOptionStep = (currentStep, ctx) => {
    const match = currentStep.nextStepOptions(ctx).options
                    .find((option) => get(ctx, option.key) === option.value);
    return match ? match.choice : 'otherwise';
};

module.exports = nextStep;
module.exports.stepList = journey.stepList;
module.exports.taskList = journey.taskList;
