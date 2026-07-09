import { type APIRequestContext, request } from '@playwright/test';
import { testConfig } from '../configs/config.js';
import { getAccessToken, getServiceAuthToken } from './apiHelper.js';
import type { StartEventResponse, DataContent, CaseEventResult, SubmitEventResponse } from './apiTypes.js';

export class apiService {
  readonly request: APIRequestContext;
  private authToken: string = '';
  private serviceAuthToken: string = '';

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async createAUser(options): Promise<void> {
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

  async initialiseUser2Tokens(): Promise<void> {
    // ✅ Get tokens for User 2 (fixed credentials from testConfig)

    const accessToken = await getAccessToken(
      testConfig.TestBoIdamUrl,
      testConfig.CwEmail,
      testConfig.CwPassword
    );
    this.authToken = `Bearer ${accessToken}`;
    this.serviceAuthToken = await getServiceAuthToken(testConfig.TestS2sUrl, 'probate_backend');

    console.log('Caseworker tokens initialised');
  }

  // ─────────────────────────────────────────
  // Step 1: GET event token
  // ─────────────────────────────────────────
  async getEventToken(
    userId: string,
    jurisdictionId: string,
    caseType: string,
    caseId: string,
    eventId: string,
    ignoreWarning: boolean = false
  ): Promise<StartEventResponse> {
    const response = await this.request.get(
      `${testConfig.TestBaseUrl}/caseworkers/${userId}/jurisdictions/${jurisdictionId}/case-types/${caseType}/cases/${caseId}/event-triggers/${eventId}/token`,
      {
        headers: {
          'Authorization': this.authToken,
          'ServiceAuthorization': this.serviceAuthToken,
          'Content-Type': 'application/json'
        },
        params: { 'ignore-warning': ignoreWarning },
        failOnStatusCode: false
      }
    );

    if (response.status() !== 200) {
      throw new Error(
        `Failed to get event token. Status: ${response.status()}, Body: ${await response.text()}`
      );
    }

    const data = await response.json() as StartEventResponse;
    console.log(`Event token obtained. Case ID: ${data.case_details?.id}`);
    return data;
  }

  // ─────────────────────────────────────────
  // Step 2: POST events
  // ─────────────────────────────────────────
  async submitEvent(
    userId: string,
    jurisdictionId: string,
    caseType: string,
    caseId: string,
    dataContent: DataContent,
    ignoreWarning: boolean = false
  ): Promise<SubmitEventResponse> {
  const response = await this.request.post(
    `${testConfig.TestBaseUrl}/caseworkers/${userId}/jurisdictions/${jurisdictionId}/case-types/${caseType}/cases/${caseId}/events`,
    {
      headers: {
        'Authorization': this.authToken,
        'ServiceAuthorization': this.serviceAuthToken,
        'Content-Type': 'application/json'
      },
      params: { 'ignore-warning': ignoreWarning },
      data: dataContent,
      failOnStatusCode: false
    });

    if (response.status() !== 201) {
      throw new Error(
        `Failed to submit event. Status: ${response.status()}, Body: ${await response.text()}`
      );
    }

    console.log('Event submitted successfully');
    return await response.json() as SubmitEventResponse;
  }

  // ─────────────────────────────────────────
  // Combined: update existing case as Caseworker
  // ─────────────────────────────────────────
  async updateCaseAsUser2(
    userId: string,
    jurisdictionId: string,
    caseType: string,
    caseId: string,
    eventId: string
  ): Promise<CaseEventResult> {
    // Get caseworker tokens first
    await this.initialiseUser2Tokens();

    // Step 1: Get event token
    const startEventResponse = await this.getEventToken(
      userId, jurisdictionId, caseType, caseId, eventId
    );

    console.log(`Updating case: ${caseId} as Caseworker`);
    console.log(`Current case state: ${startEventResponse.case_details?.state}`);

    // Step 2: Build DataContent
    const dataContent: DataContent = {
      event: {
        id: startEventResponse.event_id,
        summary: 'Automated test update',
        description: 'Updated via Playwright API test as caseworker'
      },
      data: {
        ...(startEventResponse.case_details?.case_data as Record<string, unknown> ?? {})
      },
      event_token: startEventResponse.token,
      ignore_warning: false,
      security_classification: startEventResponse.case_details?.security_classification ?? 'PUBLIC',
      supplementary_data_request: {}
    };

    // Step 3: Submit event
    const submitResponse = await this.submitEvent(
      userId, jurisdictionId, caseType, caseId, dataContent
    );

    //return CaseEventResult
    return {
      caseId: startEventResponse.case_details?.id ?? 0,
      jurisdiction: startEventResponse.case_details?.jurisdiction ?? '',
      state: submitResponse.state,
      caseData: submitResponse.data ?? {},
      startEventResponse
    };
  }
}
