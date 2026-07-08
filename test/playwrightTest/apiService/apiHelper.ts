import { APIRequestContext } from '@playwright/test';
import type { StartEventResponse, DataContent } from './apiTypes.ts';

export class CaseApiHelper {
  private requestContext: APIRequestContext;
  private baseUrl: string;
  private authToken: string;
  private serviceAuthToken: string;

  constructor(
    requestContext: APIRequestContext,
    baseUrl: string,
    authToken: string,
    serviceAuthToken: string
  ) {
    this.requestContext = requestContext;
    this.baseUrl = baseUrl;
    this.authToken = authToken;
    this.serviceAuthToken = serviceAuthToken;
  }

  // ─────────────────────────────────────────
  // Step 1: GET token - fetchCaseDataForProcess
  // ─────────────────────────────────────────
  async getEventToken(
    userId: string,
    jurisdictionId: string,
    caseType: string,
    caseId: string,
    eventId: string,
    ignoreWarning: boolean = false
  ): Promise<StartEventResponse> {
    const response = await this.requestContext.get(
      `${this.baseUrl}/caseworkers/{userId}/jurisdictions/{jurisdictionId}/case-types/{caseType}/cases/{caseId}/event-triggers/{eventId}/token`,
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
      `${this.baseUrl}/caseworkers/${userId}/jurisdictions/${jurisdictionId}/case-types/${caseType}/cases/${caseId}/events`,
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
}
