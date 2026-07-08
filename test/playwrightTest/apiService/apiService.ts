import { type APIRequestContext, request } from "@playwright/test";
import { testConfig } from "../configs/config";
import type { StartEventResponse, DataContent } from '../types/apiTypes.js';

export class apiService {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async createAUser(options) {
    if (testConfig.TestUseIdam === 'true') {
      console.log(`Creating user: ${options.getTestCitizenEmail()}`);
      const userDetails = options.getTestUserDetails();

      try {
        const requestContext = await request.newContext({
          ...(options.getUseProxy() === 'true' && {
            proxy: {
              server: options.getProxy()
            }
          })
        });

        const response = await requestContext.post(options.getTestAddUserURL(), {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          data: userDetails,
          failOnStatusCode: false // equivalent to validateStatus: () => true
        });

        if (!response) {
          throw new Error('TestConfigurator.getBefore: Using proxy - ERROR. No error raised, but no response obtained.');
        }

        if (response.status() !== 201) {
          throw new Error(
            'TestConfigurator.getBefore: Using proxy - Unable to create user. Response from IDAM was: ' +
            response.status()
          );
        }
        process.env.testCitizenEmail = options.getTestCitizenEmail();
        process.env.testCitizenPassword = options.getTestCitizenPassword();
        console.log('User created (via proxy)', userDetails);
      } catch (err) {
        throw new Error(
          `TestConfigurator.getBefore: Using proxy - ERROR: ${err.message}\nError stack:\n${err.stack}`
        );
      }
    }
  }

  async getEventToken(
    userId: string,
    jurisdictionId: string,
    caseType: string,
    caseId: string,
    eventId: string,
    ignoreWarning: boolean = false
  ): Promise<StartEventResponse> {
    const response = await this.requestContext.get(
      `${testConfig.baseUrl}/caseworkers/{userId}/jurisdictions/{jurisdictionId}/case-types/{caseType}/cases/{caseId}/event-triggers/{eventId}/token`,
      {
        headers: {
          'Authorization': this.authToken,
          'ServiceAuthorization': this.serviceAuthToken,
          'Content-Type': 'application/json'
        },
        params: {
          'ignore-warning': ignoreWarning
        },
        failOnStatusCode: false
      }
    );

    if (response.status() !== 200) {
      throw new Error(
        `Failed to get event token. Status: ${response.status()}, Body: ${await response.text()}`
      );
    }

    const data: StartEventResponse = await response.json();
    console.log(`Event token obtained for eventId: ${eventId}`);
    console.log(`Case ID: ${data.case_details?.id}`);
    return data;
  }

  // ─────────────────────────────────────────
  // Step 2: POST events - fetchCaseDataForProcess
  // ─────────────────────────────────────────
  async submitEvent(
    userId: string,
    jurisdictionId: string,
    caseType: string,
    caseId: string,
    dataContent: DataContent,
    ignoreWarning: boolean = false
  ): Promise<any> {
    const response = await this.requestContext.post(
      `${testConfig.baseUrl}/caseworkers/${userId}/jurisdictions/${jurisdictionId}/case-types/${caseType}/cases/${caseId}/events`,
      {
        headers: {
          'Authorization': this.authToken,
          'ServiceAuthorization': this.serviceAuthToken,
          'Content-Type': 'application/json'
        },
        params: {
          'ignore-warning': ignoreWarning
        },
        data: dataContent,
        failOnStatusCode: false
      }
    );

    if (response.status() !== 201) {
      throw new Error(
        `Failed to submit event. Status: ${response.status()}, Body: ${await response.text()}`
      );
    }

    const data = await response.json();
    console.log(`Event submitted successfully`);
    return data;
  }

  async createCaseEvent(
    userId: string,
    jurisdictionId: string,
    caseType: string,
    caseId: string,
    eventId: string,
    authToken: string,
    serviceAuthToken: string,
    caseDataContent?: Record<string, any>
  ): Promise<any> {
    // Step 1: Get token
    const startEventResponse = await this.getEventToken(
      userId, jurisdictionId, caseType, caseId, eventId, authToken, serviceAuthToken
    );

    console.log(`Token obtained for case: ${startEventResponse.case_details?.id}`);

    // Step 2: Build DataContent with token from Step 1
    const dataContent: DataContent = {
      event: {
        eventId: startEventResponse.event_id,
        summary: 'Automated test event',
        description: 'Created via Playwright API test'
      },
      data: caseDataContent ?? {},
      event_token: startEventResponse.token, // ✅ token from Step 1
      ignore_warning: false,
      security_classification: 'PUBLIC',
      supplementary_data_request: {}
    };

    // Step 3: Submit event
    return await this.submitEvent(
      userId, jurisdictionId, caseType, caseId, dataContent, authToken, serviceAuthToken
    );
  }

}
