'use strict';

const Helper = codecept_helper;
const helperName = 'Puppeteer';
const mainApplicantPersistence = require('test/data/main-applicant-persistence');
const executorPersistence = require('test/data/executor-persistence');
let allExecutorsPersistence;
const allDeclarationContent = require('test/data/declaration-values');
let requiredDeclarationContent;
const declarationContent = [];

class PuppeteerHelper extends Helper {

    clickBrowserBackButton() {
        const page = this.helpers[helperName].page;

        return page.goBack();
    }

    async waitForNavigationToComplete(locator) {
        const page = this.helpers[helperName].page;

        await Promise.all([
            page.waitForNavigation({waitUntil: ['domcontentloaded', 'networkidle0']}), // The promise resolves after navigation has finished
            page.click(locator) // Clicking the link will indirectly cause a navigation
        ]);
    }

    persistMainApplicant(key, value) {
        mainApplicantPersistence[key] = value;
    }

    initAllExecutorsPersistence(totalExecutors) {
        allExecutorsPersistence = [];
        for (let i = 0; i < totalExecutors; i++) {
            allExecutorsPersistence.push(Object.assign({}, executorPersistence, {}));
        }
    }

    persistExecutor(id, key, value, settingId) {
        id = settingId ? id : allExecutorsPersistence.findIndex(executor => executor.executorNumber == id);
        allExecutorsPersistence[id][key] = value;
    }

    selectDeclarationContent() {
        requiredDeclarationContent = [];
        const options = ['alias', 'codicils', 'multipleApplicants', 'mainApplicant'];//factors affecting the declaration content.
        const allDeclarationKeys = Object.keys(allDeclarationContent);
        const allExecutorKeys = allDeclarationKeys.filter(key => key.includes('applicantName') === true ||
            key.includes('executorNotApplying') === true);
        const totalExecutors = allExecutorsPersistence.length + 1;

        for (let executor = 0; executor < totalExecutors; executor++) {
            const requiredKeys = [];

            const mainApplicant = executor === 0;
            const codicils = mainApplicantPersistence.codicils;
            const multipleExecutors = allExecutorsPersistence.length > 1;
            const currentExecutorPersistence = mainApplicant ? mainApplicantPersistence : allExecutorsPersistence[executor - 1];
            const alias = currentExecutorPersistence.executorAlias;
            const applying = currentExecutorPersistence.executorApplying;
            const deceasedAlias = mainApplicantPersistence['{deceasedOtherNames}'] !== '';
            const optionVariables = [alias, codicils, multipleExecutors, mainApplicant];

            const relevantKeys = mainApplicant ? allDeclarationKeys : allExecutorKeys;
            const keysWithoutOptions = relevantKeys.filter(key => !key.includes('-'));

            keysWithoutOptions.forEach(key => {
                const optionKeys = relevantKeys.filter(optionKey => optionKey.includes(key) === true);

                if (optionKeys.length > 1) {
                    key = this.filterRequiredKey(optionKeys, options, optionVariables);
                }

                if (applying && key.includes('NotApplying')) {
                    key = '';
                } else if (!applying && key.includes('applicantName')) {
                    key = '';
                } else if (!deceasedAlias && key === 'deceasedOtherNames') {
                    key = '';
                }

                if (key !== '') {
                    requiredKeys.push(key);
                }
            });
            requiredDeclarationContent.push(requiredKeys);
        }
    }

    filterRequiredKey(optionKeys, options, optionVariables) {
        const scores = [];

        optionKeys.forEach(key => {
            let score = 0;

            options.forEach((option, index) => {
                const optionEnabled = optionVariables[index];
                const keyIncludesOption = key.includes(option);

                if (optionEnabled && keyIncludesOption) {
                    score += 1;
                } else if (!optionEnabled && keyIncludesOption) {
                    score = 0;
                }
            });
            scores.push(score);
        });
        const highestScoreIndex = scores.indexOf(Math.max(...scores));
        const requiredKey = optionKeys[highestScoreIndex];
        return requiredKey;
    }

    async populateDeclarationContent() {
        mainApplicantPersistence['{detailsOfApplicants}'] = await this.constructApplicantDetails();

        const totalExecutors = allExecutorsPersistence.length + 1;
        for (let executor = 0; executor < totalExecutors; executor++) {
            const currentExecutorPersistence = (executor === 0) ? mainApplicantPersistence : allExecutorsPersistence[executor - 1];
            const requiredKeys = requiredDeclarationContent[executor];

            for (let i = 0; i < requiredKeys.length; i++) {
                const key = requiredKeys[i];
                const originalContent = allDeclarationContent[key];
                const replacedContent = await this.replacePlaceholder(originalContent, currentExecutorPersistence); // eslint-disable-line no-await-in-loop
                const replacementComplete = !replacedContent.includes('{');
                const contentUnique = !declarationContent.includes(replacedContent);

                if (replacementComplete && contentUnique) {
                    declarationContent.push(replacedContent);
                }
            }
        }
        console.log(declarationContent);

        return declarationContent;
    }

    constructApplicantDetails() {
        return new Promise(resolve => {
            let details = `${mainApplicantPersistence['{applicantCurrentName}']} of ${mainApplicantPersistence['{applicantAddress}']}`;
            const applyingExecutors = allExecutorsPersistence.filter(executorPersistence => executorPersistence.executorApplying === true);
            applyingExecutors.forEach((executor, index) => {
                const final = index === applyingExecutors.length - 1;
                const connective = final ? ' and' : ',';
                details += `${connective} ${executor['{applicantCurrentName}']} of ${executor['{applicantAddress}']}`;
            });
            resolve(details);
        });
    }

    replacePlaceholder(declarationContentLine, persistence) {
        return new Promise(resolve => { // swapped out.
            for (const key in persistence) {
                const placeholder = key;
                const replacement = persistence[key];
                declarationContentLine = declarationContentLine.replace(new RegExp(placeholder, 'g'), replacement);
            }
            resolve(declarationContentLine);
        });
    }
}

module.exports = PuppeteerHelper;
