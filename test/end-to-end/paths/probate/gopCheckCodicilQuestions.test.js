'use strict';

const taskListContentEn = require('app/resources/en/translation/tasklist');
const taskListContentCy = require('app/resources/cy/translation/tasklist');
const {getTestLanguages} = require('../../helpers/GeneralHelpers');
const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();
const ihtDataConfig = require('test/end-to-end/pages/ee/ihtData');

const optionYes = ihtDataConfig.optionYes;
const optionNo = ihtDataConfig.optionNo;

const optionIHT400 = ihtDataConfig.optionIHT400;

const hmrcCode = ihtDataConfig.hmrcCode;

Feature('GOP - Codicil changes question wording');

Before(async () => {
    await TestConfigurator.initLaunchDarkly();
    await TestConfigurator.getBefore();
});

After(async () => {
    await TestConfigurator.getAfter();
});

getTestLanguages().forEach(language => {
    Scenario(TestConfigurator.idamInUseText(`${language.toUpperCase()} - GOP Codicil questions`), async ({I}) => {
        const decFN = 'DecFN';
        const decLN = 'DecLN';
        const decName = `${decFN} ${decLN}`;

        const decDOB = new Date(1950, 1, 1);
        const decDOD = new Date(2024, 10, 10);

        const applFN = 'Applicant First Name';
        const applLN = 'Applicant Last Name';
        const applName = `${applFN} ${applLN}`;

        const taskListContent = language === 'en' ? taskListContentEn : taskListContentCy;
        await I.createAUser(TestConfigurator);

        // Eligibility Task (pre IdAM)
        await I.startApplication(language);
        await I.selectDeathCertificate(language);
        await I.selectDeathCertificateInEnglish(language, optionYes);
        await I.selectDeceasedDomicile(language);
        const isEEEnabled = await TestConfigurator.checkFeatureToggle('probate-excepted-estates');
        if (isEEEnabled) {
            await I.selectEEDeceasedDod(language);
            await I.selectEEvalue(language);
        } else {
            await I.selectIhtCompleted(language, optionYes);
        }
        await I.selectPersonWhoDiedLeftAWill(language, optionYes);
        await I.selectOriginalWill(language, optionYes);
        await I.selectApplicantIsExecutor(language, optionYes);
        await I.selectMentallyCapable(language, optionYes);
        await I.startApply(language);

        // IdAM
        await I.authenticateWithIdamIfAvailable(language);

        // Deceased Details
        await I.selectATask(language, taskListContent.taskNotStarted);
        await I.chooseBiLingualGrant(language, optionNo);
        await I.enterDeceasedName(language, decFN, decLN);
        await I.enterDeceasedNameOnWill(language, optionYes);
        await I.enterDeceasedDateOfBirth(language, decDOB.getDate(), decDOB.getMonth(), decDOB.getFullYear());
        await I.enterDeceasedDateOfDeath(language, decDOD.getDate(), decDOD.getMonth(), decDOD.getFullYear());
        await I.enterDeceasedAddress(language);

        await I.selectDiedEngOrWales(language, optionYes);
        await I.selectDeathCertificateInterim(language, optionYes);
        await I.selectEEComplete(language, optionYes);
        await I.selectSubmittedToHmrc(language, optionIHT400);
        await I.selectHmrcLetterComplete(language, optionYes);
        await I.enterHmrcCode(language, hmrcCode);

        await I.enterProbateAssetValues(language, '500', '400');

        await I.selectDeceasedAliasGop(language, optionNo);
        await I.selectDeceasedMarriedAfterDateOnWill(language, optionNo);

        const isWillConditionEnabled = await TestConfigurator.checkFeatureToggle('probate-will-condition');
        if (isWillConditionEnabled) {
            await I.selectWillDamage(language, optionNo, 'test');
        }
        await I.selectWillCodicils(language, optionNo);
        if (isWillConditionEnabled) {
            await I.selectWrittenWishes(language, optionNo);
        }

        // check summary string(s)
        await I.checkSummaryCodicilStrings({
            language: language,
            hasCodicils: false,
            decName: decName,
            applName: null,
        });

        // ExecutorsTask
        await I.selectATask(language, taskListContent.taskNotStarted);
        await I.enterApplicantName(language, applFN, applLN);
        await I.checkErrorForNameAsOnTheWill({
            language: language,
            applicantName: applName,
            hasCodicils: false,
        });

        await I.navByClick({css: 'a#saveAndClose'});

        await I.checkSummaryCodicilStrings({
            language: language,
            hasCodicils: false,
            decName: decName,
            applName: applName,
        });

        await I.goBackAndAddACodicil({
            language: language,
            codicilsNumber: 1,
        });

        await I.checkSummaryCodicilStrings({
            language: language,
            hasCodicils: true,
            decName: decName,
            applName: applName,
        });

        await I.selectATask(language, taskListContent.taskNotStarted);
        await I.checkErrorForNameAsOnTheWill({
            language: language,
            applicantName: applName,
            hasCodicils: true,
        });

    }).tag('@e2enightly')
        .tag('@e2enightly-pr')
        .retry(0);
});
