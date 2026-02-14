import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const generatedDir = join(rootDir, 'src', 'generated');
const versionFilePath = join(generatedDir, 'version.ts');

const date = new Date();
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0');
const day = String(date.getDate()).padStart(2, '0');
const hours = String(date.getHours()).padStart(2, '0');
const minutes = String(date.getMinutes()).padStart(2, '0');

const versionString = `v${year}${month}${day}${hours}${minutes}`;

const versionExport = `export const VERSION = '${versionString}';\n`;

if (!existsSync(generatedDir)) {
  mkdirSync(generatedDir, { recursive: true });
}

writeFileSync(versionFilePath, versionExport);

console.log(`Generated version: ${versionString}`);
