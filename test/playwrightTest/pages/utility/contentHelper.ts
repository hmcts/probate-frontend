import * as fs from 'fs';
import * as path from 'path';

export function getContent(completeFilePath: string, isCommonContent: boolean = false) {
  if (isCommonContent) {
    completeFilePath = `app/resources/${completeFilePath}/translation/common.json`;
  }
  const filePath = path.resolve(process.cwd(), completeFilePath);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}
