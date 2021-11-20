import * as fs from 'fs';

export function writeTokenToDisk(tokenData) {
  fs.writeFileSync('./token.json', JSON.stringify(tokenData));
}

export function readTokenFromDisk() {
  const tokenData = fs.readFileSync('./token.json', 'utf-8');

  try {
    return JSON.parse(tokenData);
  } catch {
    return {};
  }
}
