// api/apiHelper.ts
import { request } from '@playwright/test';

export const getAccessToken = async (
  idamUrl: string,
  email: string,
  password: string
): Promise<string> => {
  const requestContext = await request.newContext();

  try {
    const response = await requestContext.post(
      `${idamUrl}/loginUser?username=${email}&password=${password}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        failOnStatusCode: false
      }
    );

    if (response.status() !== 200) {
      throw new Error(`Auth failed: ${response.status()} - ${await response.text()}`);
    }

    const data = await response.json();
    console.log('Auth token obtained for user:', email);
    return data.access_token;
  } finally {
    await requestContext.dispose();
  }
};

export const getServiceAuthToken = async (
  s2sUrl: string,
  microserviceName: string
): Promise<string> => {
  const requestContext = await request.newContext();

  try {
    const response = await requestContext.post(
      `${s2sUrl}`,
      {
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json'
        },
        data: {
          microservice: `${microserviceName}`
        },
        failOnStatusCode: false
      }
    );

    if (response.status() !== 200) {
      throw new Error(`S2S auth failed: ${response.status()} - ${await response.text()}`);
    }

    console.log('Service auth token obtained');
    return await response.text();
  } finally {
    await requestContext.dispose();
  }
};
