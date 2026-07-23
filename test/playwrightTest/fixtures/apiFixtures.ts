import { test as base } from "@playwright/test";
import { apiService } from "../apiService/apiService.ts";

type ApiTestFixture = {
  apiCallback: apiService
};

export const test = base.extend<ApiTestFixture>({
  apiCallback: async ({request}, use) => {
    await use(new apiService(request));
  },
});
