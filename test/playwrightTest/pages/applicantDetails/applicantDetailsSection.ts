import { BrowserContext, expect } from '@playwright/test';
import {BasePage, decodeHTML} from '../utility/basePage';
import {getContent} from "../utility/contentHelper.ts";
import applicantDetailsConfig from '../../data/intestacy/sole/applicantDetails.json';
import ihtDataConfig from "../../data/ee/ihtData.json";
const equalityEn = 'Equality and diversity questions';
const equalityCy = 'Cwestiynau am Gydraddoldeb ac Amrywiaeth';

export class ApplicantDetailsSection extends BasePage {
  readonly saveAndContinueButtonLocator = this.page.getByRole('button', {name: this.commonContent.saveAndContinue});
  readonly firstNameLocator = this.page.locator('#firstName');
  readonly lastNameLocator = this.page.locator('#lastName');
  readonly coApplicantNameLocator = this.page.locator('#fullName');
  readonly backLinkLocator = this.page.locator('#backLink');

  constructor(page, context: BrowserContext, language: string) {
    super(page, context, language);
  }

  async selectRelationshipToDeceased(language = 'en', answer = null) {
    const relationshipContent = getContent(`app/resources/${language}/translation/applicant/relationshiptodeceased.json`);
    await this.checkInUrl('/intestacy/relationship-to-deceased');
    await expect(this.page.getByText(await decodeHTML(relationshipContent.question)
      .replace('{deceasedName}', applicantDetailsConfig.deceasedFullName)))
      .toBeVisible();
    await expect(this.page.locator(`#relationshipToDeceased${answer}`)).toBeEnabled();
    await this.page.locator(`#relationshipToDeceased${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectSpouseNotApplyingReason(reason = null) {
    await this.checkInUrl('/intestacy/spouse-not-applying-reason');
    await expect(this.page.locator(`#spouseNotApplyingReason${reason}`)).toBeEnabled();
    await this.page.locator(`#spouseNotApplyingReason${reason}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async viewSpouseNotApplyingStopPage(language = 'en') {
    const spouseNotApplyingStopPageContent = getContent(`app/resources/${language}/translation/stoppage.json`);
    await this.checkInUrl('/intestacy/stop-page/spouseNotApplying');
    await expect(this.page.getByRole('heading', { name: spouseNotApplyingStopPageContent.deceasedNoLegalPartnerAndRelationshipOtherHeader}))
      .toBeVisible();
    await expect(this.backLinkLocator).toBeEnabled();
    await this.navByClick(this.backLinkLocator);
  }

  async adoptedOutStopPage(language = 'en') {
    const adoptedOutStopPageContent = getContent(`app/resources/${language}/translation/stoppage.json`);
    await this.checkInUrl('/intestacy/stop-page/adoptedOut');
    await expect(this.page.getByRole('heading', { name: adoptedOutStopPageContent.deceasedNoLegalPartnerAndRelationshipOtherHeader}))
      .toBeVisible();
    await expect(this.backLinkLocator).toBeEnabled();
    await this.navByClick(this.backLinkLocator);
  }

  async deceasedAdoptedOutStopPage(language = 'en') {
    const deceasedAdoptedOutStopPageContent = getContent(`app/resources/${language}/translation/stoppage.json`);
    await this.checkInUrl('/intestacy/stop-page/deceasedAdoptedOut');
    await expect(this.page.getByRole('heading', { name: deceasedAdoptedOutStopPageContent.deceasedNoLegalPartnerAndRelationshipOtherHeader}))
      .toBeVisible();
    await expect(this.backLinkLocator).toBeEnabled();
    await this.navByClick(this.backLinkLocator);
  }

  async applicantParentAdoptedOutStopPage(language = 'en') {
    const applicantParentAdoptedOutStopPageContent = getContent(`app/resources/${language}/translation/stoppage.json`);
    await this.checkInUrl('/intestacy/stop-page/grandchildParentAdoptedOut');
    await expect(this.page.getByRole('heading', { name: applicantParentAdoptedOutStopPageContent.deceasedNoLegalPartnerAndRelationshipOtherHeader}))
      .toBeVisible();
    await expect(this.backLinkLocator).toBeEnabled();
    await this.navByClick(this.backLinkLocator);
  }

  async grandchildremUnderEighteenStopPage(language = 'en') {
    const grandchildremUnderEighteenStopPageContent = getContent(`app/resources/${language}/translation/stoppage.json`);
    await this.checkInUrl('/intestacy/stop-page/grandchildrenUnder18');
    await expect(this.page.getByRole('heading', { name: grandchildremUnderEighteenStopPageContent.deceasedNoLegalPartnerAndRelationshipOtherHeader}))
      .toBeVisible();
    await expect(this.backLinkLocator).toBeEnabled();
    await this.navByClick(this.backLinkLocator);
  }

  async grandChildParentAliveStopPage(language = 'en') {
    const grandChildParentAliveStopPageContent = getContent(`app/resources/${language}/translation/stoppage.json`);
    await this.checkInUrl('/intestacy/stop-page/otherCoApplicantRelationship');
    await expect(this.page.getByRole('heading', { name: grandChildParentAliveStopPageContent.personCannotApplyByOnlineHeader}))
      .toBeVisible();
    await expect(this.backLinkLocator).toBeEnabled();
    await this.navByClick(this.backLinkLocator);
  }

  async livingDescendantStopPage(language = 'en') {
    const livingDescendantStopPageContent = getContent(`app/resources/${language}/translation/stoppage.json`);
    await this.checkInUrl('/intestacy/stop-page/notEligibleLivingDescendants');
    await expect(this.page.getByRole('heading', { name: livingDescendantStopPageContent.notEntitledHeader}))
      .toBeVisible();
    await expect(this.backLinkLocator).toBeEnabled();
    await this.navByClick(this.backLinkLocator);
  }

  async differentParentsStopPage(language = 'en') {
    const differentParentsStopPageContent = getContent(`app/resources/${language}/translation/stoppage.json`);
    await this.checkInUrl('/intestacy/stop-page/notEligibleSameParents');
    await expect(this.page.getByRole('heading', { name: differentParentsStopPageContent.notEntitledHeader}))
      .toBeVisible();
    await expect(this.backLinkLocator).toBeEnabled();
    await this.navByClick(this.backLinkLocator);
  }

  async nieceOrNephewUnder18StopPage(language = 'en') {
    const nieceOrNephewUnder18StopPageContent = getContent(`app/resources/${language}/translation/stoppage.json`);
    await this.checkInUrl('/intestacy/stop-page/anyoneUnder18');
    await expect(this.page.getByRole('heading', { name: nieceOrNephewUnder18StopPageContent.deceasedNoLegalPartnerAndRelationshipOtherHeader}))
      .toBeVisible();
    await expect(this.backLinkLocator).toBeEnabled();
    await this.navByClick(this.backLinkLocator);
  }

  async selectMainApplicantParentAlive(answer = null) {
    await this.checkInUrl('/intestacy/mainapplicantsparent-alive');
    await expect(this.page.locator(`#childAlive${answer}`)).toBeEnabled();
    await this.page.locator(`#childAlive${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectCoApplicantParentAlive(coApplicantNumber, answer = null) {
    await this.checkInUrl(`/intestacy/parent-die-before/${coApplicantNumber}`);
    await expect(this.page.locator(`#applicantParentDieBeforeDeceased${answer}`)).toBeEnabled();
    await this.page.locator(`#applicantParentDieBeforeDeceased${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectAnyLivingParents(language = 'en', answer = null) {
    const anyLivingParentContent = getContent(`app/resources/${language}/translation/deceased/anylivingparents.json`);
    await this.checkInUrl('/intestacy/any-living-parents');
    await expect(this.page.getByText(await decodeHTML(anyLivingParentContent.question)
      .replaceAll('{deceasedName}', applicantDetailsConfig.deceasedFullName)))
      .toBeVisible();
    await expect(this.page.locator(`#anyLivingParents${answer}`)).toBeEnabled();
    await this.page.locator(`#anyLivingParents${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async mainApplicantParentAdoptedIn(language = 'en', answer = null) {
    const parentAdoptedInContent = getContent(`app/resources/${language}/translation/applicant/parentadoptedin.json`);
    await this.checkInUrl('/intestacy/mainapplicantsparent-adopted-in');
    await expect(this.page.getByText(await decodeHTML(parentAdoptedInContent.question)
      .replaceAll('{deceasedName}', applicantDetailsConfig.deceasedFullName)))
      .toBeVisible();
    await expect(this.page.locator(`#parentAdoptedIn${answer}`)).toBeEnabled();
    await this.page.locator(`#parentAdoptedIn${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async mainApplicantParentAdoptedOut(language = 'en', answer = null) {
    const parentAdoptedOutContent = getContent(`app/resources/${language}/translation/applicant/parentadoptedout.json`);
    await this.checkInUrl('/intestacy/mainapplicantsparent-adopted-out');
    await expect(this.page.getByText(await decodeHTML(parentAdoptedOutContent.question)
      .replaceAll('{deceasedName}', applicantDetailsConfig.deceasedFullName)))
      .toBeVisible();
    await expect(this.page.locator(`#parentAdoptedOut${answer}`)).toBeEnabled();
    await this.page.locator(`#parentAdoptedOut${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async mainApplicantParentAdoptionPlace(language = 'en', answer = null) {
    const parentAdoptionPlaceContent = getContent(`app/resources/${language}/translation/applicant/parentadoptionplace.json`);
    await this.checkInUrl('/intestacy/parent-adoption-place');
    await expect(this.page.getByText(await decodeHTML(parentAdoptionPlaceContent.question)))
      .toBeVisible();
    await expect(this.page.locator(`#parentAdoptionPlace${answer}`)).toBeEnabled();
    await this.page.locator(`#parentAdoptionPlace${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async mainApplicantAdoptedIn(language = 'en', answer = null, journey) {
    const adoptedInContent = getContent(`app/resources/${language}/translation/applicant/adoptedin.json`);
    await this.checkInUrl('/intestacy/main-applicant-adopted-in');
    await expect(this.page.getByText(await decodeHTML(adoptedInContent[`${journey}Question`])
      .replace('{deceasedName}', applicantDetailsConfig.deceasedFullName)))
      .toBeVisible();
    await expect(this.page.locator(`#adoptedIn${answer}`)).toBeEnabled();
    await this.page.locator(`#adoptedIn${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async mainApplicantAdoptedOut(language = 'en', answer = null, journey = null) {
    const adoptedOutContent = getContent(`app/resources/${language}/translation/applicant/adoptedout.json`);
    await this.checkInUrl('/intestacy/main-applicant-adopted-out');
    await expect(this.page.getByText(await decodeHTML(adoptedOutContent[`${journey}Question`])
      .replace('{deceasedName}', applicantDetailsConfig.deceasedFullName)))
      .toBeVisible();
    await expect(this.page.locator(`#adoptedOut${answer}`)).toBeEnabled();
    await this.page.locator(`#adoptedOut${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async mainApplicantAdoptionPlace(language = 'en', answer = null) {
    const adoptionPlaceContent = getContent(`app/resources/${language}/translation/applicant/adoptionplace.json`);
    await this.checkInUrl('/intestacy/adopted-in-england-or-wales');
    await expect(this.page.getByText(await decodeHTML(adoptionPlaceContent.question))).toBeVisible();
    await expect(this.page.locator(`#adoptionPlace${answer}`)).toBeEnabled();
    await this.page.locator(`#adoptionPlace${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async enterAnyOtherChildren(language = 'en', answer = null) {
    const otherChildrenContent = getContent(`app/resources/${language}/translation/deceased/anyotherchildren.json`);
    await this.checkInUrl('/intestacy/any-other-children');
    await expect(this.page.getByText(await decodeHTML(otherChildrenContent.question)
      .replace('{deceasedName}', applicantDetailsConfig.deceasedFullName)))
      .toBeVisible();
    await expect(this.page.locator(`#anyOtherChildren${answer}`)).toBeEnabled();
    await this.page.locator(`#anyOtherChildren${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async enterAnyChildren(language = 'en', answer = null) {
    const childrenContent = getContent(`app/resources/${language}/translation/deceased/anychildren.json`);
    await this.checkInUrl('/intestacy/any-children');
    await expect(this.page.getByText(await decodeHTML(childrenContent.hint))).toBeVisible();
    await expect(this.page.locator(`#anyChildren${answer}`)).toBeEnabled();
    await this.page.locator(`#anyChildren${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async otherChildrenDiedBefore(answer = null) {
    await this.checkInUrl('/intestacy/any-predeceased-children');
    await expect(this.page.locator(`#anyPredeceasedChildren${answer}`)).toBeEnabled();
    await this.page.locator(`#anyPredeceasedChildren${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async anyGrandChildren(language = 'en', answer = null) {
    const grandChildrenContent = getContent(`app/resources/${language}/translation/deceased/anysurvivinggrandchildren.json`);
    await this.checkInUrl('/intestacy/any-surviving-grandchildren');
    await expect(this.page.getByText(await decodeHTML(grandChildrenContent.question)
      .replace('{deceasedName}', applicantDetailsConfig.deceasedFullName)))
      .toBeVisible();
    await expect(this.page.locator(`#anySurvivingGrandchildren${answer}`)).toBeEnabled();
    await this.page.locator(`#anySurvivingGrandchildren${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async mainApplicantParentAnyOtherChildren(answer = null) {
    await this.checkInUrl('/intestacy/mainapplicantsparent-any-other-children');
    await expect(this.page.locator(`#grandchildParentHasOtherChildren${answer}`)).toBeEnabled();
    await this.page.locator(`#grandchildParentHasOtherChildren${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async anyOtherWholeSiblings(language = 'en', answer = null) {
    const anyOtherWholeSiblingContent = getContent(`app/resources/${language}/translation/applicant/anyotherwholesiblings.json`);
    await this.checkInUrl('/intestacy/deceased-other-whole-siblings');
    await expect(this.page.getByText(await decodeHTML(anyOtherWholeSiblingContent.question)
      .replace('{deceasedName}', applicantDetailsConfig.deceasedFullName)))
      .toBeVisible();
    await expect(this.page.locator(`#anyOtherWholeSiblings${answer}`)).toBeEnabled();
    await this.page.locator(`#anyOtherWholeSiblings${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async anyOtherHalfSiblings(language = 'en', answer = null) {
    const anyOtherHalfSiblingContent = getContent(`app/resources/${language}/translation/applicant/anyotherhalfsiblings.json`);
    await this.checkInUrl('/intestacy/deceased-other-half-siblings');
    await expect(this.page.getByText(await decodeHTML(anyOtherHalfSiblingContent.question)
      .replace('{deceasedName}', applicantDetailsConfig.deceasedFullName)))
      .toBeVisible();
    await expect(this.page.locator(`#anyOtherHalfSiblings${answer}`)).toBeEnabled();
    await this.page.locator(`#anyOtherHalfSiblings${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async anyPredeceasedSiblings(language = 'en', answer = null, siblingType) {
    const predeceasedWholeSiblingsContent = getContent(`app/resources/${language}/translation/applicant/anypredeceasedwholesiblings.json`);
    const predeceasedHalfSiblingsContent = getContent(`app/resources/${language}/translation/applicant/anypredeceasedhalfsiblings.json`);
    const siblingTypeUpper = siblingType.charAt(0).toUpperCase() + siblingType.slice(1);
    let predeceasedSiblingContent;

    if (siblingType === 'whole') {
      predeceasedSiblingContent = predeceasedWholeSiblingsContent;
    } else {
      predeceasedSiblingContent = predeceasedHalfSiblingsContent;
    }
    await this.checkInUrl(`/intestacy/deceased-${siblingType}-siblings`);
    await expect(this.page.getByText(decodeHTML(predeceasedSiblingContent.question)
      .replace('{deceasedName}', applicantDetailsConfig.deceasedFullName)))
      .toBeVisible();
    await expect(this.page.locator(`#anyPredeceased${siblingTypeUpper}Siblings${answer}`)).toBeEnabled();
    await this.page.locator(`#anyPredeceased${siblingTypeUpper}Siblings${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async anySurvivingNieceNephew(language = 'en', answer = null, siblingType) {
    const anySurvivingWholeNieceNephewContent = getContent(`app/resources/${language}/translation/applicant/anysurvivingwholeniecesandwholenephews.json`);
    const anySurvivingHalfNieceNephewContent = getContent(`app/resources/${language}/translation/applicant/anysurvivinghalfniecesandhalfnephews.json`);
    const siblingTypeUpper = siblingType.charAt(0).toUpperCase() + siblingType.slice(1);
    let survivingNieceNephewContent;

    if (siblingType === 'whole') {
      survivingNieceNephewContent = anySurvivingWholeNieceNephewContent;
    } else {
      survivingNieceNephewContent = anySurvivingHalfNieceNephewContent;
    }
    await this.checkInUrl(`/intestacy/${siblingType}-siblings-surviving-children`);
    await expect(this.page.getByText(await decodeHTML(survivingNieceNephewContent.question)
      .replace('{deceasedName}', applicantDetailsConfig.deceasedFullName)))
      .toBeVisible();
    await expect(this.page.locator(`#anySurviving${siblingTypeUpper}NiecesAnd${siblingTypeUpper}Nephews${answer}`)).toBeEnabled();
    await this.page.locator(`#anySurviving${siblingTypeUpper}NiecesAnd${siblingTypeUpper}Nephews${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async anySiblingsAbove18(language = 'en', answer = null, siblingType) {
    const wholeSiblingsAbove18Content = getContent(`app/resources/${language}/translation/applicant/allwholesiblingsover18.json`);
    const halfSiblingsAbove18Content = getContent(`app/resources/${language}/translation/applicant/allhalfsiblingsover18.json`);
    const siblingTypeUpper = siblingType.charAt(0).toUpperCase() + siblingType.slice(1);
    let siblingsAbove18Content;

    if (siblingType === 'whole') {
      siblingsAbove18Content = wholeSiblingsAbove18Content;
    } else {
      siblingsAbove18Content = halfSiblingsAbove18Content;
    }
    await this.checkInUrl(`/intestacy/${siblingType}-siblings-age`);
    await expect(this.page.getByText(await decodeHTML(siblingsAbove18Content.question)
      .replace('{deceasedName}', applicantDetailsConfig.deceasedFullName)))
      .toBeVisible();
    await expect(this.page.locator(`#all${siblingTypeUpper}SiblingsOver18${answer}`)).toBeEnabled();
    await this.page.locator(`#all${siblingTypeUpper}SiblingsOver18${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectAnyLivingDescendants(answer = null) {
    await this.checkInUrl('/intestacy/any-living-descendants');
    await expect(this.page.locator(`#anyLivingDescendants${answer}`)).toBeEnabled();
    await this.page.locator(`#anyLivingDescendants${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async deceasedAdoptedIn(language = 'en', answer = null, journey) {
    const deceasedAdoptedInContent = getContent(`app/resources/${language}/translation/applicant/deceasedadoptedin.json`);
    await this.checkInUrl('/intestacy/deceased-adopted-in');
    await expect(this.page.getByText(await decodeHTML(deceasedAdoptedInContent[`${journey}Question`])
      .replace('{deceasedName}', applicantDetailsConfig.deceasedFullName)))
      .toBeVisible();
    await expect(this.page.locator(`#deceasedAdoptedIn${answer}`)).toBeEnabled();
    await this.page.locator(`#deceasedAdoptedIn${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async deceasedAdoptedOut(language = 'en', answer = null, journey) {
    const deceasedAdoptedOutContent = getContent(`app/resources/${language}/translation/applicant/deceasedadoptedout.json`);
    await this.checkInUrl('/intestacy/deceased-adopted-out');
    await expect(this.page.getByText(await decodeHTML(deceasedAdoptedOutContent[`${journey}Question`])
      .replace('{deceasedName}', applicantDetailsConfig.deceasedFullName)))
      .toBeVisible();
    await expect(this.page.locator(`#deceasedAdoptedOut${answer}`)).toBeEnabled();
    await this.page.locator(`#deceasedAdoptedOut${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async deceasedAdoptionPlace(language = 'en', answer = null) {
    const deceasedAdoptionPlaceContent = getContent(`app/resources/${language}/translation/applicant/deceasedadoptionplace.json`);
    await this.checkInUrl('/intestacy/deceased-adoption-place');
    await expect(this.page.getByText(await decodeHTML(deceasedAdoptionPlaceContent.question)
      .replace('{deceasedName}', applicantDetailsConfig.deceasedFullName)))
      .toBeVisible();
    await expect(this.page.locator(`#deceasedAdoptionPlace${answer}`)).toBeEnabled();
    await this.page.locator(`#deceasedAdoptionPlace${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async deceasedOtherParentAlive(language = 'en', answer = null) {
    const otherParentAliveContent = getContent(`app/resources/${language}/translation/deceased/anyotherparentalive.json`);
    await this.checkInUrl('/intestacy/any-other-parent-alive');
    await expect(this.page.getByText(await decodeHTML(otherParentAliveContent.question)
      .replace('{deceasedName}', applicantDetailsConfig.deceasedFullName)))
      .toBeVisible();
    await expect(this.page.locator(`#anyOtherParentAlive${answer}`)).toBeEnabled();
    await this.page.locator(`#anyOtherParentAlive${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async anyChildrenOverEighteen(language = 'en', answer = null) {
    const childrenOverEighteenContent = getContent(`app/resources/${language}/translation/deceased/allchildrenover18.json`);
    await this.checkInUrl('/intestacy/all-children-over-18');
    await expect(this.page.getByText(await decodeHTML(childrenOverEighteenContent.question)
      .replace('{deceasedName}', applicantDetailsConfig.deceasedFullName)))
      .toBeVisible();
    await expect(this.page.locator(`#allChildrenOver18${answer}`)).toBeEnabled();
    await this.page.locator(`#allChildrenOver18${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async anyGrandchildrenUnderEighteen(language = 'en', answer = null) {
    const grandChildrenUnderEighteenContent = getContent(`app/resources/${language}/translation/deceased/anygrandchildrenunder18.json`);
    await this.checkInUrl('/intestacy/any-grandchildren-under-18');
    await expect(this.page.getByText(await decodeHTML(grandChildrenUnderEighteenContent.question))).toBeVisible();
    await expect(this.page.locator(`#anyGrandchildrenUnder18${answer}`)).toBeEnabled();
    await this.page.locator(`#anyGrandchildrenUnder18${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async allGrandchildrenOverEighteen(answer = null) {
    await this.checkInUrl('/intestacy/all-grandchildren-over-18');
    await expect(this.page.locator(`#grandchildParentHasAllChildrenOver18${answer}`)).toBeEnabled();
    await this.page.locator(`#grandchildParentHasAllChildrenOver18${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async anyNieceOrNephewOver18(language = 'en', answer = null, siblingType) {
    const wholeNieceOrNephewOver18Content = getContent(`app/resources/${language}/translation/applicant/allwholeniecesandwholenephewsover18.json`);
    const halfNieceOrNephewOver18Content = getContent(`app/resources/${language}/translation/applicant/allhalfniecesandhalfnephewsover18.json`);
    const siblingTypeUpper = siblingType.charAt(0).toUpperCase() + siblingType.slice(1);
    let nieceOrNephewOver18Content;
    if (siblingType === 'whole') {
      nieceOrNephewOver18Content = wholeNieceOrNephewOver18Content;
    } else {
      nieceOrNephewOver18Content = halfNieceOrNephewOver18Content;
    }
    await this.checkInUrl(`/intestacy/${siblingType}-nieces-${siblingType}-nephews-age`);
    await expect(this.page.getByText(await decodeHTML(nieceOrNephewOver18Content.question)))
      .toBeVisible();
    await expect(this.page.locator(`#all${siblingTypeUpper}NiecesAnd${siblingTypeUpper}NephewsOver18${answer}`)).toBeEnabled();
    await this.page.locator(`#all${siblingTypeUpper}NiecesAnd${siblingTypeUpper}NephewsOver18${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectDeceasedSameParents(language = 'en', option = null) {
    const sameParentsContent = getContent(`app/resources/${language}/translation/applicant/sameparents.json`);
    await this.checkInUrl('/intestacy/deceased-same-parents');
    await expect(this.page.getByText(await decodeHTML(sameParentsContent.question)
      .replace('{deceasedName}', applicantDetailsConfig.deceasedFullName)))
      .toBeVisible();
    await expect(this.page.locator(`[value="${option}"]`)).toBeEnabled();
    await this.page.locator(`[value="${option}"]`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async jointApplication(language = 'en', answer = null, journey = null) {
    const jointApplicationPageContent = getContent(`app/resources/${language}/translation/executors/jointapplication.json`);
    await this.checkInUrl('/intestacy/joint-application');
    await expect(this.page
      .getByRole('heading', { name: jointApplicationPageContent[`title${journey}`], exact: true }).first())
      .toBeVisible();
    await this.page.locator(`#hasCoApplicant${answer}`).scrollIntoViewIfNeeded();
    await expect(this.page.locator(`#hasCoApplicant${answer}`)).toBeVisible();
    await expect(this.page.locator(`#hasCoApplicant${answer}`)).toBeEnabled();
    await this.page.locator(`#hasCoApplicant${answer}`).dispatchEvent('click');
    try {
      // Try label click first
      await this.page.locator(`label[for="hasCoApplicant${answer}"]`).click();
    } catch {
      // Fall back to force check
      await this.page.locator(`#hasCoApplicant${answer}`).check({ force: true });
    }

    await expect(this.page.locator(`#hasCoApplicant${answer}`)).toBeChecked();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async spouseCoApplicationStopPage() {
    await this.checkInUrl('/intestacy/stop-page/noJointApplicationApplicable');
    await expect(this.page.locator('#backLink')).toBeVisible();
    await this.page.locator('#backLink').click();
  }

  async enterApplicantName(language ='en', firstname = null, lastname = null) {
    const nameContent = getContent(`app/resources/${language}/translation/applicant/name.json`);
    await this.checkInUrl('/intestacy/applicant-name');
    await expect(this.page.getByText(await decodeHTML(nameContent.question))).toBeVisible();
    await expect(this.firstNameLocator).toBeEnabled();
    await this.firstNameLocator.fill(firstname);
    await this.lastNameLocator.fill(lastname);
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async enterApplicantPhone(language = 'en') {
    const phoneContent = getContent(`app/resources/${language}/translation/applicant/phone.json`);
    const phoneNumberLabel = await decodeHTML(phoneContent.phoneNumber);
    await this.checkInUrl('/intestacy/applicant-phone');
    await expect(this.page.locator('label', { hasText: phoneNumberLabel })).toBeVisible();
    await expect(this.page.locator('#phoneNumber')).toBeEnabled();
    await this.page.locator('#phoneNumber').fill(applicantDetailsConfig.phoneNumberValue);
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async enterAddressManually() {
    await this.checkInUrl('/intestacy/applicant-address');
    await this.page.locator('#details-panel > summary > span').click();
    await expect(this.page.locator('#addressLine1')).toBeEnabled();
    await this.page.locator('#addressLine1').fill('Applicant Address Line 1');
    await this.page.locator('#addressLine2').fill('Applicant Address Line 2');
    await this.page.locator('#addressLine3').fill('Applicant Address Line 3');
    await this.page.locator('#postTown').fill('Applicant Post Town');
    await this.page.locator('#newPostCode').fill('AA1 1AA');
    await this.page.locator('#country').fill('United Kingdom');
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectCoapplicantRelationship(coapplicantRelationship, coapplicantNumber: string) {
    await this.checkInUrl(`/coapplicant-relationship-to-deceased/${coapplicantNumber}`);
    await expect(this.page.locator(`[value="${coapplicantRelationship}"]`)).toBeVisible();
    await expect(this.page.locator(`[value="${coapplicantRelationship}"]`)).toBeEnabled();
    await this.page.locator(`[value="${coapplicantRelationship}"]`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async enterCoapplicantName(coApplicantNumber, coApplicantName) {
    await this.checkInUrl(`/coapplicant-name/${coApplicantNumber}`);
    await expect(this.coApplicantNameLocator).toBeEnabled();
    await this.coApplicantNameLocator.fill(coApplicantName);
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async coApplicantAdoptedIn(coApplicantNumber, answer = null) {
    await this.checkInUrl(`/intestacy/coapplicant-adopted-in/${coApplicantNumber}`);
    await expect(this.page.locator(`#adoptedIn${answer}`)).toBeEnabled();
    await this.page.locator(`#adoptedIn${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async coApplicantAdoptionPlace(coApplicantNumber, answer = null) {
    await this.checkInUrl(`/intestacy/coapplicant-adoption-place/${coApplicantNumber}`);
    await expect(this.page.locator(`#adoptionPlace${answer}`)).toBeEnabled();
    await this.page.locator(`#adoptionPlace${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async coApplicantAdoptedOut(coApplicantNumber, answer = null) {
    await this.checkInUrl(`/intestacy/coapplicant-adopted-out/${coApplicantNumber}`);
    await expect(this.page.locator(`#adoptedOut${answer}`)).toBeEnabled();
    await this.page.locator(`#adoptedOut${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async coApplicantParentAdoptedIn(coApplicantNumber, answer = null) {
    await this.checkInUrl(`/intestacy/parent-adopted-in/${coApplicantNumber}`);
    await expect(this.page.locator(`#applicantParentAdoptedIn${answer}`)).toBeEnabled();
    await this.page.locator(`#applicantParentAdoptedIn${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async coApplicantParentAdoptedOut(coApplicantNumber, answer = null) {
    await this.checkInUrl(`/intestacy/parent-adopted-out/${coApplicantNumber}`);
    await expect(this.page.locator(`#applicantParentAdoptedOut${answer}`)).toBeEnabled();
    await this.page.locator(`#applicantParentAdoptedOut${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async coApplicantParentAdoptionPlace(coApplicantNumber, answer = null) {
    await this.checkInUrl(`/intestacy/parent-adoption-place/${coApplicantNumber}`);
    await expect(this.page.locator(`#applicantParentAdoptionPlace${answer}`)).toBeEnabled();
    await this.page.locator(`#applicantParentAdoptionPlace${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async enterCoApplicantEmail(coApplicantNumber, coApplicantEmail) {
    await this.checkInUrl(`/intestacy/coapplicant-email/${coApplicantNumber}`);
    await expect(this.page.locator('#email')).toBeEnabled();
    await this.page.locator('#email').fill(coApplicantEmail);
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async enterCoApplicantAddress(coApplicantNumber) {
    await this.checkInUrl(`/intestacy/executor-address/${coApplicantNumber}`);
    await this.page.locator('#details-panel > summary > span').click();
    await expect(this.page.locator('#addressLine1')).toBeEnabled();
    await this.page.locator('#addressLine1').fill('Applicant Address Line 1');
    await this.page.locator('#addressLine2').fill('Applicant Address Line 2');
    await this.page.locator('#addressLine3').fill('Applicant Address Line 3');
    await this.page.locator('#postTown').fill('Applicant Post Town');
    await this.page.locator('#newPostCode').fill('AA1 1AA');
    await this.page.locator('#country').fill('United Kingdom');
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async exitEqualityAndDiversity (language ='en') {
    const equalityContent = language === 'en' ? equalityEn : equalityCy;
    await this.checkInUrl('pcq');
    await expect(this.page.locator('#back-button')).toBeVisible();
    await this.page.reload();
    await expect(this.page.locator('#back-button')).toBeVisible();
    const currentUrl = await this.page.url();
    if (!currentUrl.includes('/offline')) {
      await expect(this.page.getByText(equalityContent).nth(1)).toBeVisible();
    }
    await this.page.locator('#back-button').click();
  }

  async completeEqualityAndDiversity(language = 'en', isJointApplication?: Boolean) {
    if (this.page.url().includes('pcq')) {
      await this.page.waitForTimeout(300);
      await expect(this.saveAndContinueButtonLocator).toBeVisible();
      await this.page.reload();
    }

    if(isJointApplication) {
      await this.jointApplication(language, ihtDataConfig.optionNo);
    } else {
      await expect(this.saveAndContinueButtonLocator).toBeVisible();
      await this.navByClick(this.saveAndContinueButtonLocator);
    }
  }
}
