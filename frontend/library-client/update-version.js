/**
 * This script updates the version.ts file with a new version number
 * It's meant to be run as part of the build/deployment process
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the version.ts file
const versionFilePath = path.resolve(__dirname, 'src/utils/version.ts');

// Generate a new version based on timestamp
const newVersion = `${new Date().toISOString().split('T')[0]}-${Date.now()}`;

try {
  // Read the existing file
  let content = fs.readFileSync(versionFilePath, 'utf8');
  
  // Replace the version
  content = content.replace(
    /export const APP_VERSION = ['"](.+)['"];/,
    `export const APP_VERSION = '${newVersion}';`
  );
  
  // Write back to the file
  fs.writeFileSync(versionFilePath, content, 'utf8');
  
  console.log(`Updated application version to ${newVersion}`);
} catch (err) {
  console.error('Error updating version:', err);
  process.exit(1);
}
