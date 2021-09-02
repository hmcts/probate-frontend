'use strict';

const {get} = require('lodash');
const steps = require('app/core/initSteps').steps;

class JourneyMap {
    constructor(journey) {
        this.journey = journey;
    }

    nextOptionStep(currentStep, ctx) {
        console.log('JourneyMap nextOptionStep');
        const match = currentStep
            .nextStepOptions(ctx).options
            .find((option) => get(ctx, option.key) === option.value);
        return match ? match.choice : 'otherwise';
    }

    nextStep(currentStep, ctx) {
        console.log('JourneyMap nextStep');
        let nextStepName = this.journey.stepList[currentStep.name];
        if (nextStepName !== null && typeof nextStepName === 'object') {
            nextStepName = nextStepName[this.nextOptionStep(currentStep, ctx)];
        }
        return steps[nextStepName];
    }

    stepList() {
        console.log('JourneyMap stepList');
        return this.journey.stepList;
    }

    taskList() {
        console.log('JourneyMap taskList');
        return this.journey.taskList;
    }
}

module.exports = JourneyMap;
