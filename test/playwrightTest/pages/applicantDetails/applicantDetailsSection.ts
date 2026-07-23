import { BrowserContext, expect, Page } from '@playwright/test';
import { BasePage, decodeHTML } from '../utility/basePage.js';
import { getContent } from '../utility/contentHelper.js';
import applicantDetailsConfig from '../../data/intestacy/sole/applicantDetails.json' with { type: 'json' };
import ihtDataConfig from '../../data/ee/ihtData.json' with { type: 'json' };

const equalityEn = 'Equality and diversity questions';
const equalityCy = 'Cwestiynau am Gydraddoldeb ac Amrywiaeth';

export type YesNoOption = 'optionYes' | 'optionNo';
export type SiblingType = 'whole' | 'half';
export type ApplicantJourney =
  | 'child'
  | 'grandchild'
  | 'parent'
  | 'sibling'
  | 'wholeBloodSibling'
  | 'halfBloodSibling';

export type SpouseNotApplyingReason = 'optionRenouncing' | 'optionOther';

export const relationshipToDeceasedOptions = {
  spousePartner: 'optionSpousePartner',
  child: 'optionChild',
  adoptedChild: 'optionAdoptedChild',
  grandchild: 'optionGrandchild',
  parent: 'optionParent',
  sibling: 'optionSibling',
  other: 'optionOther',
} as const;

export type RelationshipToDeceasedOption =
  typeof relationshipToDeceasedOptions[keyof typeof relationshipToDeceasedOptions];

export class ApplicantDetailsSection extends BasePage {
  readonly saveAndContinueButtonLocator = this.page.getByRole('button', {
    name: this.commonContent.saveAndContinue,
  });
  readonly firstNameLocator = this.page.locator('#firstName');
  readonly lastNameLocator = this.page.locator('#lastName');
  readonly coApplicantNameLocator = this.page.locator('#fullName');
  readonly backLinkLocator = this.page.locator('#backLink');

  constructor(page: Page, context: BrowserContext, language: string) {
    super(page, context, language);
  }

  private async chooseRadioById(id: string): Promise<void> {
    const radio = this.page.locator(`#${id}`);
    await expect(radio).toBeVisible();
    await expect(radio).toBeEnabled();
    await radio.check();
  }

  private async chooseRadioByNameValue(name: string, value: string): Promise<void> {
    const radio = this.page.locator(`input[name="${name}"][value="${value}"]`);
    await expect(radio).toBeVisible();
    await expect(radio).toBeEnabled();
    await radio.check();
  }

  private async continue(): Promise<void> {
    await this.runAccessibilityTest();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectRelationshipToDeceased(answer: RelationshipToDeceasedOption): Promise<void> {
    await this.checkInUrl('/relationship-to-deceased');
    await this.chooseRadioByNameValue('relationshipToDeceased', answer);
    await this.continue();
  }

  async selectSpouseNotApplyingReason(reason: SpouseNotApplyingReason): Promise<void> {
    await this.checkInUrl('/spouse-not-applying-reason');
    await this.chooseRadioByNameValue('spouseNotApplyingReason', reason);
    await this.continue();
  }

  async viewSpouseNotApplyingStopPage(language: string): Promise<void> {
    await this.checkInUrl('/stop-page/spouseNotApplying');

    if (language === 'cy') {
      await expect(
        this.page.getByRole('heading', {
          name: /Yn anffodus, ni allwch ddefnyddio’r gwasanaeth ar-lein/i,
        })
      ).toBeVisible();
    } else {
      await expect(
        this.page.getByRole('heading', {
          name: /Sorry, you can’t use the online service/i,
        })
      ).toBeVisible();
    }

    await this.page.goBack();
    await this.checkInUrl('/spouse-not-applying-reason');
  }

  async adoptedOutStopPage(language = 'en'): Promise<void> {
    const content = getContent(`app/resources/${language}/translation/stoppage.json`);
    await this.checkInUrl('/intestacy/stop-page/adoptedOut');
    await expect(
      this.page.getByRole('heading', {
        name: content.deceasedNoLegalPartnerAndRelationshipOtherHeader,
      })
    ).toBeVisible();
    await expect(this.backLinkLocator).toBeEnabled();
    await this.runAccessibilityTest();
    await this.navByClick(this.backLinkLocator);
  }

  async deceasedAdoptedOutStopPage(language = 'en'): Promise<void> {
    const content = getContent(`app/resources/${language}/translation/stoppage.json`);
    await this.checkInUrl('/intestacy/stop-page/deceasedAdoptedOut');
    await expect(
      this.page.getByRole('heading', {
        name: content.deceasedNoLegalPartnerAndRelationshipOtherHeader,
      })
    ).toBeVisible();
    await expect(this.backLinkLocator).toBeEnabled();
    await this.runAccessibilityTest();
    await this.navByClick(this.backLinkLocator);
  }

  async applicantParentAdoptedOutStopPage(language = 'en'): Promise<void> {
    const content = getContent(`app/resources/${language}/translation/stoppage.json`);
    await this.checkInUrl('/intestacy/stop-page/grandchildParentAdoptedOut');
    await expect(
      this.page.getByRole('heading', {
        name: content.deceasedNoLegalPartnerAndRelationshipOtherHeader,
      })
    ).toBeVisible();
    await expect(this.backLinkLocator).toBeEnabled();
    await this.runAccessibilityTest();
    await this.navByClick(this.backLinkLocator);
  }

  async grandchildrenUnderEighteenStopPage(language = 'en'): Promise<void> {
    const content = getContent(`app/resources/${language}/translation/stoppage.json`);
    await this.checkInUrl('/intestacy/stop-page/grandchildrenUnder18');
    await expect(
      this.page.getByRole('heading', {
        name: content.deceasedNoLegalPartnerAndRelationshipOtherHeader,
      })
    ).toBeVisible();
    await expect(this.backLinkLocator).toBeEnabled();
    await this.runAccessibilityTest();
    await this.navByClick(this.backLinkLocator);
  }

  async grandChildParentAliveStopPage(language = 'en'): Promise<void> {
    const content = getContent(`app/resources/${language}/translation/stoppage.json`);
    await this.checkInUrl('/intestacy/stop-page/otherCoApplicantRelationship');
    await expect(
      this.page.getByRole('heading', {
        name: content.personCannotApplyByOnlineHeader,
      })
    ).toBeVisible();
    await expect(this.backLinkLocator).toBeEnabled();
    await this.runAccessibilityTest();
    await this.navByClick(this.backLinkLocator);
  }

  async livingDescendantStopPage(language = 'en'): Promise<void> {
    const content = getContent(`app/resources/${language}/translation/stoppage.json`);
    await this.checkInUrl('/intestacy/stop-page/notEligibleLivingDescendants');
    await expect(
      this.page.getByRole('heading', {
        name: content.notEntitledHeader,
      })
    ).toBeVisible();
    await expect(this.backLinkLocator).toBeEnabled();
    await this.runAccessibilityTest();
    await this.navByClick(this.backLinkLocator);
  }

  async differentParentsStopPage(language = 'en'): Promise<void> {
    const content = getContent(`app/resources/${language}/translation/stoppage.json`);
    await this.checkInUrl('/intestacy/stop-page/notEligibleSameParents');
    await expect(
      this.page.getByRole('heading', {
        name: content.notEntitledHeader,
      })
    ).toBeVisible();
    await expect(this.backLinkLocator).toBeEnabled();
    await this.runAccessibilityTest();
    await this.navByClick(this.backLinkLocator);
  }

  async nieceOrNephewUnder18StopPage(language = 'en'): Promise<void> {
    const content = getContent(`app/resources/${language}/translation/stoppage.json`);
    await this.checkInUrl('/intestacy/stop-page/anyoneUnder18');
    await expect(
      this.page.getByRole('heading', {
        name: content.deceasedNoLegalPartnerAndRelationshipOtherHeader,
      })
    ).toBeVisible();
    await expect(this.backLinkLocator).toBeEnabled();
    await this.runAccessibilityTest();
    await this.navByClick(this.backLinkLocator);
  }

  async selectMainApplicantParentAlive(answer: YesNoOption): Promise<void> {
    await this.checkInUrl('/intestacy/mainapplicantsparent-alive');
    await this.chooseRadioById(`childAlive${answer}`);
    await this.continue();
  }

  async selectCoApplicantParentAlive(coApplicantNumber: string, answer: YesNoOption): Promise<void> {
    await this.checkInUrl(`/intestacy/parent-die-before/${coApplicantNumber}`);
    await this.chooseRadioById(`applicantParentDieBeforeDeceased${answer}`);
    await this.continue();
  }

  async selectAnyLivingParents(language = 'en', answer: YesNoOption): Promise<void> {
    const content = getContent(`app/resources/${language}/translation/deceased/anylivingparents.json`);
    await this.checkInUrl('/intestacy/any-living-parents');
    await expect(
      this.page.getByText(
        await decodeHTML(content.question).replaceAll(
          '{deceasedName}',
          applicantDetailsConfig.deceasedFullName
        )
      )
    ).toBeVisible();
    await this.chooseRadioById(`anyLivingParents${answer}`);
    await this.continue();
  }

  async mainApplicantParentAdoptedIn(language = 'en', answer: YesNoOption): Promise<void> {
    const content = getContent(`app/resources/${language}/translation/applicant/parentadoptedin.json`);
    await this.checkInUrl('/intestacy/mainapplicantsparent-adopted-in');
    await expect(
      this.page.getByText(
        await decodeHTML(content.question).replaceAll(
          '{deceasedName}',
          applicantDetailsConfig.deceasedFullName
        )
      )
    ).toBeVisible();
    await this.chooseRadioById(`parentAdoptedIn${answer}`);
    await this.continue();
  }

  async mainApplicantParentAdoptedOut(language = 'en', answer: YesNoOption): Promise<void> {
    const content = getContent(`app/resources/${language}/translation/applicant/parentadoptedout.json`);
    await this.checkInUrl('/intestacy/mainapplicantsparent-adopted-out');
    await expect(
      this.page.getByText(
        await decodeHTML(content.question).replaceAll(
          '{deceasedName}',
          applicantDetailsConfig.deceasedFullName
        )
      )
    ).toBeVisible();
    await this.chooseRadioById(`parentAdoptedOut${answer}`);
    await this.continue();
  }

  async mainApplicantParentAdoptionPlace(language = 'en', answer: YesNoOption): Promise<void> {
    const content = getContent(`app/resources/${language}/translation/applicant/parentadoptionplace.json`);
    await this.checkInUrl('/intestacy/parent-adoption-place');
    await expect(this.page.getByText(await decodeHTML(content.question))).toBeVisible();
    await this.chooseRadioById(`parentAdoptionPlace${answer}`);
    await this.continue();
  }

  async mainApplicantAdoptedIn(
    language = 'en',
    answer: YesNoOption,
    journey: ApplicantJourney
  ): Promise<void> {
    const content = getContent(`app/resources/${language}/translation/applicant/adoptedin.json`);
    await this.checkInUrl('/intestacy/main-applicant-adopted-in');
    await expect(
      this.page.getByText(
        await decodeHTML(content[`${journey}Question`]).replace(
          '{deceasedName}',
          applicantDetailsConfig.deceasedFullName
        )
      )
    ).toBeVisible();
    await this.chooseRadioById(`adoptedIn${answer}`);
    await this.continue();
  }

  async mainApplicantAdoptedOut(
    language = 'en',
    answer: YesNoOption,
    journey: ApplicantJourney
  ): Promise<void> {
    const content = getContent(`app/resources/${language}/translation/applicant/adoptedout.json`);
    await this.checkInUrl('/intestacy/main-applicant-adopted-out');
    await expect(
      this.page.getByText(
        await decodeHTML(content[`${journey}Question`]).replace(
          '{deceasedName}',
          applicantDetailsConfig.deceasedFullName
        )
      )
    ).toBeVisible();
    await this.chooseRadioById(`adoptedOut${answer}`);
    await this.continue();
  }

  async mainApplicantAdoptionPlace(language = 'en', answer: YesNoOption): Promise<void> {
    const content = getContent(`app/resources/${language}/translation/applicant/adoptionplace.json`);
    await this.checkInUrl('/intestacy/adopted-in-england-or-wales');
    await expect(this.page.getByText(await decodeHTML(content.question))).toBeVisible();
    await this.chooseRadioById(`adoptionPlace${answer}`);
    await this.continue();
  }

  async enterAnyOtherChildren(answer: YesNoOption): Promise<void> {
    await this.checkInUrl('/any-other-children');
    await this.chooseRadioByNameValue('anyOtherChildren', answer);
    await this.continue();
  }

  async allChildrenOver18(answer: YesNoOption): Promise<void> {
    await this.checkInUrl('/all-children-over-18');
    await this.chooseRadioByNameValue('allChildrenOver18', answer);
    await this.continue();

    if (answer === 'optionNo') {
      await expect(this.page).toHaveURL(/\/stop-page\/childrenUnder18/);
    } else {
      await expect(this.page).toHaveURL(/\/any-deceased-children/);
    }
  }

  async anyDeceasedChildren(answer: YesNoOption): Promise<void> {
    await this.checkInUrl('/any-deceased-children');
    await this.chooseRadioByNameValue('anyDeceasedChildren', answer);
    await this.continue();

    if (answer === 'optionNo') {
      await expect(this.page).toHaveURL(/\/applicant-name/);
    } else {
      await expect(this.page).toHaveURL(/\/any-grandchildren-under-18/);
    }
  }

  async anyGrandchildrenUnder18(answer: YesNoOption): Promise<void> {
    await this.checkInUrl('/any-grandchildren-under-18');
    await this.chooseRadioByNameValue('anyGrandchildrenUnder18', answer);
    await this.continue();

    if (answer === 'optionYes') {
      await expect(this.page).toHaveURL(/\/stop-page\/grandchildrenUnder18/);
    } else {
      await expect(this.page).toHaveURL(/\/applicant-name/);
    }
  }

  async enterAnyChildren(answer: YesNoOption): Promise<void> {
    await this.checkInUrl('/any-children');
    await this.chooseRadioByNameValue('anyChildren', answer);
    await this.continue();
  }

  async mainApplicantParentAnyOtherChildren(answer: YesNoOption): Promise<void> {
    await this.checkInUrl('/intestacy/mainapplicantsparent-any-other-children');
    await this.chooseRadioById(`grandchildParentHasOtherChildren${answer}`);
    await this.continue();
  }

  async anyOtherWholeSiblings(language = 'en', answer: YesNoOption): Promise<void> {
    const content = getContent(
      `app/resources/${language}/translation/applicant/anyotherwholesiblings.json`
    );
    await this.checkInUrl('/intestacy/deceased-other-whole-siblings');
    await expect(
      this.page.getByText(
        await decodeHTML(content.question).replace(
          '{deceasedName}',
          applicantDetailsConfig.deceasedFullName
        )
      )
    ).toBeVisible();
    await this.chooseRadioById(`anyOtherWholeSiblings${answer}`);
    await this.continue();
  }

  async anyOtherHalfSiblings(language = 'en', answer: YesNoOption): Promise<void> {
    const content = getContent(
      `app/resources/${language}/translation/applicant/anyotherhalfsiblings.json`
    );
    await this.checkInUrl('/intestacy/deceased-other-half-siblings');
    await expect(
      this.page.getByText(
        await decodeHTML(content.question).replace(
          '{deceasedName}',
          applicantDetailsConfig.deceasedFullName
        )
      )
    ).toBeVisible();
    await this.chooseRadioById(`anyOtherHalfSiblings${answer}`);
    await this.continue();
  }

  async anyPredeceasedSiblings(
    language = 'en',
    answer: YesNoOption,
    siblingType: SiblingType
  ): Promise<void> {
    const wholeContent = getContent(
      `app/resources/${language}/translation/applicant/anypredeceasedwholesiblings.json`
    );
    const halfContent = getContent(
      `app/resources/${language}/translation/applicant/anypredeceasedhalfsiblings.json`
    );
    const siblingTypeUpper = siblingType.charAt(0).toUpperCase() + siblingType.slice(1);
    const content = siblingType === 'whole' ? wholeContent : halfContent;

    await this.checkInUrl(`/intestacy/deceased-${siblingType}-siblings`);
    await expect(
      this.page.getByText(
        await decodeHTML(content.question).replace(
          '{deceasedName}',
          applicantDetailsConfig.deceasedFullName
        )
      )
    ).toBeVisible();
    await this.chooseRadioById(`anyPredeceased${siblingTypeUpper}Siblings${answer}`);
    await this.continue();
  }

  async anySurvivingNieceNephew(
    language = 'en',
    answer: YesNoOption,
    siblingType: SiblingType
  ): Promise<void> {
    const wholeContent = getContent(
      `app/resources/${language}/translation/applicant/anysurvivingwholeniecesandwholenephews.json`
    );
    const halfContent = getContent(
      `app/resources/${language}/translation/applicant/anysurvivinghalfniecesandhalfnephews.json`
    );
    const siblingTypeUpper = siblingType.charAt(0).toUpperCase() + siblingType.slice(1);
    const content = siblingType === 'whole' ? wholeContent : halfContent;

    await this.checkInUrl(`/intestacy/${siblingType}-siblings-surviving-children`);
    await expect(
      this.page.getByText(
        await decodeHTML(content.question).replace(
          '{deceasedName}',
          applicantDetailsConfig.deceasedFullName
        )
      )
    ).toBeVisible();
    await this.chooseRadioById(
      `anySurviving${siblingTypeUpper}NiecesAnd${siblingTypeUpper}Nephews${answer}`
    );
    await this.continue();
  }

  async anySiblingsAbove18(
    language = 'en',
    answer: YesNoOption,
    siblingType: SiblingType
  ): Promise<void> {
    const wholeContent = getContent(
      `app/resources/${language}/translation/applicant/allwholesiblingsover18.json`
    );
    const halfContent = getContent(
      `app/resources/${language}/translation/applicant/allhalfsiblingsover18.json`
    );
    const siblingTypeUpper = siblingType.charAt(0).toUpperCase() + siblingType.slice(1);
    const content = siblingType === 'whole' ? wholeContent : halfContent;

    await this.checkInUrl(`/intestacy/${siblingType}-siblings-age`);
    await expect(
      this.page.getByText(
        await decodeHTML(content.question).replace(
          '{deceasedName}',
          applicantDetailsConfig.deceasedFullName
        )
      )
    ).toBeVisible();
    await this.chooseRadioById(`all${siblingTypeUpper}SiblingsOver18${answer}`);
    await this.continue();
  }

  async selectAnyLivingDescendants(answer: YesNoOption): Promise<void> {
    await this.checkInUrl('/intestacy/any-living-descendants');
    await this.chooseRadioById(`anyLivingDescendants${answer}`);
    await this.continue();
  }

  async deceasedAdoptedIn(
    language = 'en',
    answer: YesNoOption,
    journey: ApplicantJourney
  ): Promise<void> {
    const content = getContent(
      `app/resources/${language}/translation/applicant/deceasedadoptedin.json`
    );
    await this.checkInUrl('/intestacy/deceased-adopted-in');
    await expect(
      this.page.getByText(
        await decodeHTML(content[`${journey}Question`]).replace(
          '{deceasedName}',
          applicantDetailsConfig.deceasedFullName
        )
      )
    ).toBeVisible();
    await this.chooseRadioById(`deceasedAdoptedIn${answer}`);
    await this.continue();
  }

  async deceasedAdoptedOut(
    language = 'en',
    answer: YesNoOption,
    journey: ApplicantJourney
  ): Promise<void> {
    const content = getContent(
      `app/resources/${language}/translation/applicant/deceasedadoptedout.json`
    );
    await this.checkInUrl('/intestacy/deceased-adopted-out');
    await expect(
      this.page.getByText(
        await decodeHTML(content[`${journey}Question`]).replace(
          '{deceasedName}',
          applicantDetailsConfig.deceasedFullName
        )
      )
    ).toBeVisible();
    await this.chooseRadioById(`deceasedAdoptedOut${answer}`);
    await this.continue();
  }

  async deceasedAdoptionPlace(language = 'en', answer: YesNoOption): Promise<void> {
    const content = getContent(
      `app/resources/${language}/translation/applicant/deceasedadoptionplace.json`
    );
    await this.checkInUrl('/intestacy/deceased-adoption-place');
    await expect(
      this.page.getByText(
        await decodeHTML(content.question).replace(
          '{deceasedName}',
          applicantDetailsConfig.deceasedFullName
        )
      )
    ).toBeVisible();
    await this.chooseRadioById(`deceasedAdoptionPlace${answer}`);
    await this.continue();
  }

  async deceasedOtherParentAlive(language = 'en', answer: YesNoOption): Promise<void> {
    const content = getContent(
      `app/resources/${language}/translation/deceased/anyotherparentalive.json`
    );
    await this.checkInUrl('/intestacy/any-other-parent-alive');
    await expect(
      this.page.getByText(
        await decodeHTML(content.question).replace(
          '{deceasedName}',
          applicantDetailsConfig.deceasedFullName
        )
      )
    ).toBeVisible();
    await this.chooseRadioById(`anyOtherParentAlive${answer}`);
    await this.continue();
  }

  async anyGrandchildrenUnderEighteen(language = 'en', answer: YesNoOption): Promise<void> {
    const content = getContent(
      `app/resources/${language}/translation/deceased/anygrandchildrenunder18.json`
    );
    await this.checkInUrl('/intestacy/any-grandchildren-under-18');
    await expect(this.page.getByText(await decodeHTML(content.question))).toBeVisible();
    await this.chooseRadioById(`anyGrandchildrenUnder18${answer}`);
    await this.continue();
  }

  async allGrandchildrenOverEighteen(answer: YesNoOption): Promise<void> {
    await this.checkInUrl('/intestacy/all-grandchildren-over-18');
    await this.chooseRadioById(`grandchildParentHasAllChildrenOver18${answer}`);
    await this.continue();
  }

  async anyNieceOrNephewOver18(
    language = 'en',
    answer: YesNoOption,
    siblingType: SiblingType
  ): Promise<void> {
    const wholeContent = getContent(
      `app/resources/${language}/translation/applicant/allwholeniecesandwholenephewsover18.json`
    );
    const halfContent = getContent(
      `app/resources/${language}/translation/applicant/allhalfniecesandhalfnephewsover18.json`
    );
    const siblingTypeUpper = siblingType.charAt(0).toUpperCase() + siblingType.slice(1);
    const content = siblingType === 'whole' ? wholeContent : halfContent;

    await this.checkInUrl(`/intestacy/${siblingType}-nieces-${siblingType}-nephews-age`);
    await expect(this.page.getByText(await decodeHTML(content.question))).toBeVisible();
    await this.chooseRadioById(
      `all${siblingTypeUpper}NiecesAnd${siblingTypeUpper}NephewsOver18${answer}`
    );
    await this.continue();
  }

  async selectDeceasedSameParents(language = 'en', option: YesNoOption): Promise<void> {
    const content = getContent(`app/resources/${language}/translation/applicant/sameparents.json`);
    await this.checkInUrl('/intestacy/deceased-same-parents');
    await expect(
      this.page.getByText(
        await decodeHTML(content.question).replace(
          '{deceasedName}',
          applicantDetailsConfig.deceasedFullName
        )
      )
    ).toBeVisible();
    await this.chooseRadioByNameValue('deceasedSameParents', option);
    await this.continue();
  }

  async jointApplication(
    language = 'en',
    answer: YesNoOption,
    journey: string | null = null
  ): Promise<void> {
    const content = getContent(
      `app/resources/${language}/translation/executors/jointapplication.json`
    );
    await this.checkInUrl('/intestacy/joint-application');

    const titleKey = `title${journey ?? ''}`;
    const headingText = content[titleKey] ?? content.title;

    await expect(
      this.page.getByRole('heading', { name: headingText, exact: true }).first()
    ).toBeVisible();

    await this.chooseRadioById(`hasCoApplicant${answer}`);
    await expect(this.page.locator(`#hasCoApplicant${answer}`)).toBeChecked();
    await this.continue();
  }

  async spouseCoApplicationStopPage(): Promise<void> {
    await this.checkInUrl('/intestacy/stop-page/noJointApplicationApplicable');
    await expect(this.page.locator('#backLink')).toBeVisible();
    await this.runAccessibilityTest();
    await this.page.locator('#backLink').click();
  }

  async enterApplicantName(language = 'en', firstname: string, lastname: string): Promise<void> {
    const content = getContent(`app/resources/${language}/translation/applicant/name.json`);
    await this.checkInUrl('/applicant-name');
    await expect(this.page.getByText(await decodeHTML(content.question))).toBeVisible();
    await expect(this.firstNameLocator).toBeEnabled();
    await this.firstNameLocator.fill(firstname);
    await this.lastNameLocator.fill(lastname);
    await this.continue();
  }

  async enterApplicantPhone(language = 'en'): Promise<void> {
    const content = getContent(`app/resources/${language}/translation/applicant/phone.json`);
    const phoneNumberLabel = await decodeHTML(content.phoneNumber);
    await this.checkInUrl('/applicant-phone');
    await expect(this.page.locator('label', { hasText: phoneNumberLabel })).toBeVisible();
    await expect(this.page.locator('#phoneNumber')).toBeEnabled();
    await this.page.locator('#phoneNumber').fill(applicantDetailsConfig.phoneNumberValue);
    await this.continue();
  }

  async enterAddressManually(isGop?: boolean): Promise<void> {
    if (!isGop) {
      await this.checkInUrl('/applicant-address');
    }
    await this.page.locator('#details-panel > summary > span').click();
    await expect(this.page.locator('#addressLine1')).toBeEnabled();
    await this.page.locator('#addressLine1').fill('Applicant Address Line 1');
    await this.page.locator('#addressLine2').fill('Applicant Address Line 2');
    await this.page.locator('#addressLine3').fill('Applicant Address Line 3');
    await this.page.locator('#postTown').fill('Applicant Post Town');
    await this.page.locator('#newPostCode').fill('AA1 1AA');
    await this.page.locator('#country').fill('United Kingdom');
    await this.continue();
  }

  async selectCoapplicantRelationship(
    coapplicantRelationship: string,
    coapplicantNumber: string
  ): Promise<void> {
    await this.checkInUrl(`/coapplicant-relationship-to-deceased/${coapplicantNumber}`);
    await this.chooseRadioByNameValue('relationshipToDeceased', coapplicantRelationship);
    await this.continue();
  }

  async enterCoapplicantName(coApplicantNumber: string, coApplicantName: string): Promise<void> {
    await this.checkInUrl(`/coapplicant-name/${coApplicantNumber}`);
    await expect(this.coApplicantNameLocator).toBeEnabled();
    await this.coApplicantNameLocator.fill(coApplicantName);
    await this.continue();
  }

  async coApplicantAdoptedIn(coApplicantNumber: string, answer: YesNoOption): Promise<void> {
    await this.checkInUrl(`/intestacy/coapplicant-adopted-in/${coApplicantNumber}`);
    await this.chooseRadioById(`adoptedIn${answer}`);
    await this.continue();
  }

  async coApplicantAdoptionPlace(coApplicantNumber: string, answer: YesNoOption): Promise<void> {
    await this.checkInUrl(`/intestacy/coapplicant-adoption-place/${coApplicantNumber}`);
    await this.chooseRadioById(`adoptionPlace${answer}`);
    await this.continue();
  }

  async coApplicantAdoptedOut(coApplicantNumber: string, answer: YesNoOption): Promise<void> {
    await this.checkInUrl(`/intestacy/coapplicant-adopted-out/${coApplicantNumber}`);
    await this.chooseRadioById(`adoptedOut${answer}`);
    await this.continue();
  }

  async coApplicantParentAdoptedIn(coApplicantNumber: string, answer: YesNoOption): Promise<void> {
    await this.checkInUrl(`/intestacy/parent-adopted-in/${coApplicantNumber}`);
    await this.chooseRadioById(`applicantParentAdoptedIn${answer}`);
    await this.continue();
  }

  async coApplicantParentAdoptedOut(coApplicantNumber: string, answer: YesNoOption): Promise<void> {
    await this.checkInUrl(`/intestacy/parent-adopted-out/${coApplicantNumber}`);
    await this.chooseRadioById(`applicantParentAdoptedOut${answer}`);
    await this.continue();
  }

  async coApplicantParentAdoptionPlace(
    coApplicantNumber: string,
    answer: YesNoOption
  ): Promise<void> {
    await this.checkInUrl(`/intestacy/parent-adoption-place/${coApplicantNumber}`);
    await this.chooseRadioById(`applicantParentAdoptionPlace${answer}`);
    await this.continue();
  }

  async enterCoApplicantEmail(coApplicantNumber: string, coApplicantEmail: string): Promise<void> {
    await this.checkInUrl(`/intestacy/coapplicant-email/${coApplicantNumber}`);
    await expect(this.page.locator('#email')).toBeEnabled();
    await this.page.locator('#email').fill(coApplicantEmail);
    await this.continue();
  }

  async enterCoApplicantAddress(coApplicantNumber: string): Promise<void> {
    await this.checkInUrl(`/intestacy/executor-address/${coApplicantNumber}`);
    await this.page.locator('#details-panel > summary > span').click();
    await expect(this.page.locator('#addressLine1')).toBeEnabled();
    await this.page.locator('#addressLine1').fill('Applicant Address Line 1');
    await this.page.locator('#addressLine2').fill('Applicant Address Line 2');
    await this.page.locator('#addressLine3').fill('Applicant Address Line 3');
    await this.page.locator('#postTown').fill('Applicant Post Town');
    await this.page.locator('#newPostCode').fill('AA1 1AA');
    await this.page.locator('#country').fill('United Kingdom');
    await this.continue();
  }

  async skipEqualityAndDiversityQuestions(): Promise<void> {
    await expect(this.page).toHaveURL(/pcq/);
    await expect(this.page.locator('button[name="opt-out-button"]')).toBeVisible();
    await this.page.locator('button[name="opt-out-button"]').click();
    await expect(this.page).toHaveURL(/\/task-list/);
  }

  async exitEqualityAndDiversity(language = 'en'): Promise<void> {
    const equalityContent = language === 'en' ? equalityEn : equalityCy;
    await this.checkInUrl('pcq');
    await expect(this.page.locator('#back-button')).toBeVisible();
    await this.page.reload();
    await expect(this.page.locator('#back-button')).toBeVisible();

    const currentUrl = this.page.url();
    if (!currentUrl.includes('/offline')) {
      await expect(this.page.getByText(equalityContent).nth(1)).toBeVisible();
    }

    await this.page.locator('#back-button').click();
  }

  async completeEqualityAndDiversity(
    language = 'en',
    isJointApplication?: boolean,
    isGop?: boolean
  ): Promise<void> {
    if (this.page.url().includes('pcq')) {
      await this.page.waitForTimeout(300);
      await expect(this.saveAndContinueButtonLocator).toBeVisible();
      await this.page.reload();
    }

    if (isJointApplication && !isGop) {
      await this.jointApplication(language, ihtDataConfig.optionNo as YesNoOption);
    } else if (isGop) {
      await this.checkInUrl('/executors-named');
      await expect(this.page.locator('#executorsNamed-2')).toBeEnabled();
      await this.page.locator('#executorsNamed-2').check();
      await this.navByClick(this.saveAndContinueButtonLocator);
    } else {
      await expect(this.saveAndContinueButtonLocator).toBeVisible();
      await this.navByClick(this.saveAndContinueButtonLocator);
    }
  }
}
