'use strict';

const {get} = require('lodash');
const steps = require('app/core/initSteps').steps;

class JourneyMap {
    constructor(journey) {
        this.journey = journey;
    }

    nextOptionStep(currentStep, ctx) {
        const match = currentStep
            .nextStepOptions(ctx).options
            .find((option) => get(ctx, option.key) === option.value);
        return match ? match.choice : 'otherwise';
    }

    nextStep(currentStep, ctx) {
        const stepListEntry = this.journey.stepList[currentStep.name];
        if (stepListEntry !== null && typeof stepListEntry === 'object') {
            const nextStepId = this.nextOptionStep(currentStep, ctx);
            const nextStepName = stepListEntry[nextStepId];
            if (!nextStepName) {
                const stepOptions = Object.keys(stepListEntry).join(', ');
                throw Error(`for ${currentStep.name} nextStepId ${nextStepId} not in options - options are [${stepOptions}]`);
            }
            const resultingStep = steps[nextStepName];
            if (!resultingStep) {
                throw Error(`for ${currentStep.name} nextStepId ${nextStepId} gave ${nextStepName} which is not found in steps`);
            }
            return resultingStep;
        }
        const directStep = steps[stepListEntry];
        if (!directStep) {
            throw Error(`for ${currentStep.name} got non-object ${stepListEntry} which is not found in steps`);
        }
        return directStep;
    }

    stepList() {
        return this.journey.stepList;
    }

    taskList() {
        return this.journey.taskList;
    }

    getNextStepByName(stepName) {
        return steps[stepName];
    }
}

module.exports = JourneyMap;
