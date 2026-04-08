import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

export const testConfig = {
  environment: 'ithc',
  frontendUrl: 'https://probate.ithc.platform.hmcts.net',
  email: process.env.PA_USER_EMAIL ?? '',
  password: process.env.PA_USER_PASSWORD ?? '',
  documentToUpload: 'resources/files/test_file_for_document_upload.png',
};
