import { request } from "@playwright/test";
import randomstring from "randomstring";
import { testConfig } from "../../configs/config.ts";
// import LaunchDarkly from "test/end-to-end/helpers/LaunchDarkly";
// import setupSecrets from "../../../app/setupSecrets";

/* eslint no-console: 0 no-unused-vars: 0 */
export class TestConfigurator {
  environment: string;
  testBaseUrl: string;
  useIdam: string;
  testCitizenName: string;
  testCitizenPassword: string;
  testCitizenDomain: string;
  testAddUserUrl: string;
  testDeleteUserUrl: string;
  role: string;
  testIdamUserGroup: string;
  useGovPay: string;
  userDetails: string;
  retryFeatures: number;
  retryScenarios: number;
  testUseProxy: boolean;
  testProxy: string;

  constructor() {
    this.environment = testConfig.TestFrontendUrl.includes('local') ? 'local' : 'aat';
    this.testBaseUrl = testConfig.TestIdamBaseUrl;
    this.useIdam = testConfig.TestUseIdam;
    this.setTestCitizenName();
    this.testCitizenDomain = testConfig.TestCitizenDomain.replace('/@', '@');
    this.setTestCitizenPassword();
    this.testAddUserUrl = testConfig.TestIdamAddUserUrl;
    this.testDeleteUserUrl = this.testAddUserUrl + '/';
    this.role = testConfig.TestIdamRole;
    this.testIdamUserGroup = testConfig.TestIdamUserGroup;
    this.useGovPay = testConfig.TestUseGovPay;
    this.userDetails = '';
    this.retryFeatures = testConfig.TestRetryFeatures;
    this.retryScenarios = testConfig.TestRetryScenarios;
    this.testUseProxy = testConfig.TestUseProxy;
    this.testProxy = testConfig.TestProxy;
    // private launchDarkly: LaunchDarkly | null = null;
  }

  /*initLaunchDarkly(): void {
    console.log('Opening LaunchDarkly connection...');
    this.launchDarkly = new LaunchDarkly();
    console.log('LaunchDarkly connection opened.');
  }

  async closeLaunchDarkly() {
    if (this.launchDarkly) {
      console.log('Closing LaunchDarkly connection...');
      await this.launchDarkly.close();
      console.log('LaunchDarkly connection closed.');
    }
  }*/

  async getBefore() {
    if (process.env.testCitizenEmail === this.getTestCitizenEmail()) {
      this.setTestCitizenName();
      this.setTestCitizenPassword();
    }
    await this.setEnvVarsForIndividualTest();
  }

  async getAfter() {
    await this.deleteIdamUser();
    // await this.closeLaunchDarkly();
  }

  setTestCitizenName() {
    this.testCitizenName = randomstring.generate({
      length: 24,
      charset: 'alphabetic'
    });
  }

  getTestCitizenName() {
    return this.testCitizenName;
  }

  getTestCitizenPassword() {
    return this.testCitizenPassword;
  }

  setTestCitizenPassword() {
    const letters = randomstring.generate({length: 5, charset: 'alphabetic'});
    const captiliseFirstLetter = letters.charAt(0).toUpperCase();

    this.testCitizenPassword = captiliseFirstLetter + letters.slice(1) + randomstring.generate({length: 4, charset: 'numeric'});
  }

  getTestRole() {
    return this.role;
  }

  getTestIdamUserGroup() {
    return this.testIdamUserGroup;
  }

  getTestCitizenEmail() {
    return this.testCitizenName + this.testCitizenDomain;
  }

  getTestAddUserURL() {
    return this.testBaseUrl + this.testAddUserUrl;
  }

  getTestDeleteUserURL() {
    return this.testBaseUrl + this.testDeleteUserUrl;
  }

  getTestUserDetails() {
    const name = this.getTestCitizenName();
    return {
      email: this.getTestCitizenEmail(),
      forename: name,
      surname: name,
      password: this.getTestCitizenPassword(),
      roles: [{code: this.getTestRole()}],
      userGroup: {code: this.getTestIdamUserGroup()}
    };
  }

  idamInUseText(scenarioText) {
    return (this.useIdam === 'true') ? scenarioText + ' - With Idam' : scenarioText + ' - Without Idam';
  }

  async deleteIdamUser() {
    if (this.useIdam === 'true') {
      const email = this.getTestCitizenEmail();
      console.log(`Deleting user: ${email}`);

      try {
        const requestContext = await request.newContext({
          ...(this.getUseProxy() === true && {
            proxy: {
              server: this.getProxy()
            }
          })
        });

        const response = await requestContext.delete(this.getTestDeleteUserURL() + email, {
          failOnStatusCode: false
        });

        if (response.status() > 204) {
          console.log(`Delete IDAM test user '${email}' result: ${response.status()}, ${response.statusText()}`);
        }
      } catch (err) {
        console.error(`IDAM test user deletion unsuccessful: ${(err as Error).message}`);
      }
    }
  }

  setEnvVarsForIndividualTest() {
    process.env.testCitizenEmail = this.getTestCitizenEmail();
    process.env.testCitizenPassword = this.getTestCitizenPassword();
  }

  /*bootStrapTestSuite() {
    if (process.env.NODE_ENV === 'dev-aat') {
      return () => setupSecrets();
    }
  }*/

  showBrowser() {
    return process.env.TEST_HEADLESS ? process.env.TEST_HEADLESS === 'false' : testConfig.TestShowBrowser;
  }

  getUseGovPay() {
    return this.useGovPay;
  }

  getRetryFeatures() {
    return this.retryFeatures;
  }

  getRetryScenarios() {
    return this.retryScenarios;
  }

  getUseProxy() {
    return this.testUseProxy;
  }

  getProxy() {
    return this.testProxy;
  }

  equalityAndDiversityEnabled() {
    return this.environment !== 'local';
  }

  /*checkFeatureToggle(featureToggleKey) {
    return this.launchDarkly.variation(featureToggleKey, testConfig.featureToggles.launchDarklyUser, false);
  }*/
}
