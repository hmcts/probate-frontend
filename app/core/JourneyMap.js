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
        let nextStepName = this.journey.stepList[currentStep.name];
        if (nextStepName !== null && typeof nextStepName === 'object') {
            nextStepName = nextStepName[this.nextOptionStep(currentStep, ctx)];
        }
        return steps[nextStepName];
    }

    previousStep(currentStep, req) {
        let prevStepName = this.journey.previousStepList[currentStep.name];
        if (prevStepName !== null && typeof prevStepName === 'object') {
            const reason = req.params[0];
            if (reason !== null) {
                prevStepName = this.stopReason(reason, prevStepName);
            }
        }
        return steps[prevStepName];
    }
    stopReason(reason, prevStepName) {
        switch (reason) {
            case 'deathCertificate':
                prevStepName = prevStepName.DeathCertificate;
                break;
            case 'deathCertificateTranslation':
                prevStepName = prevStepName.DeathCertificateTranslation;
                break;
            case 'notInEnglandOrWales':
                prevStepName = prevStepName.DeceasedDomicile;
                break;
            case 'eeEstateNotValued':
                prevStepName = prevStepName.ExceptedEstateValued;//Need to add more case where stop page is coming.Just added 3 for testing
                break;
            default:
                prevStepName = prevStepName.StartEligibility;
        }
        return prevStepName;
    }
    stepList() {
        return this.journey.stepList;
    }

    previousStepList() {
        return this.journey.previousStepList;
    }

    taskList() {
        return this.journey.taskList;
    }

    getNextStepByName(stepName) {
        return steps[stepName];
    }
}

module.exports = JourneyMap;
