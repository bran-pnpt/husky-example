const fs = require('fs');

function readJsonFile(filePath) {
  try {
      const data = fs.readFileSync(filePath, 'utf8');
      // vscode의 settings.json은 JSONC 형식으로 작성되어 있어서 JSON.parse에서 에러를 일으킬 수 있음
      const sanitizedData = data.replace(/,(\s*[}\]])/g, '$1');
      return JSON.parse(sanitizedData);
  } catch (err) {
      // 설정 파일이 아직 존재하지 않을 경우, 빈 객체 반환
      if (err.code === 'ENOENT') {
          console.log(`File not found: ${filePath}, creating new file.`);
          return {};
      } else {
          console.error('\x1b[31m%s\x1b[0m', `Error reading file: ${err}`);
          throw err;
      }
  }
}

function writeJsonFile(filePath, data) {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonData, 'utf8');
  } catch (err) {
    console.error('\x1b[31m%s\x1b[0m', `Error writing file: ${err}`);
    throw err;
  }
}

function mergeJsonObjects(obj1, obj2) {
  return {...obj1, ...obj2};
}

function isJsonEqual(json1, json2) {
  return JSON.stringify(json1) === JSON.stringify(json2);
}

const sharedSettingsPath = './.vscode/settings.shared.json';
const settingsPath = './.vscode/settings.json';

const sharedSettings = readJsonFile(sharedSettingsPath);
const settings = readJsonFile(settingsPath);

const mergedSettings = mergeJsonObjects(settings, sharedSettings);

if (!isJsonEqual(settings, mergedSettings)) {
  try {
    writeJsonFile(settingsPath, mergedSettings);
    console.log(
      '\x1b[32m%s\x1b[0m',
      'Your vscode settings have been updated successfully (.vscode/settings.json)',
    );
  } catch (err) {
    console.error(
      '\x1b[31m%s\x1b[0m',
      'Failed to update vscode settings..\nPlease manually merge `.vscode/settings.shared.json` into `.vscode/settings.json`',
    );
  }
}

