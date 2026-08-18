import { type APIRequestContext, request } from "@playwright/test";
import { testConfig } from "../configs/config";

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
}
