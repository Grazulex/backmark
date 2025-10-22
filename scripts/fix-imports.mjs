#!/usr/bin/env node
import { readdir, readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '../dist');

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(path);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      yield path;
    }
  }
}

async function fixImports(filePath) {
  let content = await readFile(filePath, 'utf-8');
  let modified = false;

  // Fix relative imports without .js extension
  const importRegex = /(from\s+['"])(\.[^'"]+)(['"])/g;
  content = content.replace(importRegex, (match, p1, p2, p3) => {
    if (!p2.endsWith('.js') && !p2.endsWith('.json')) {
      modified = true;
      return `${p1}${p2}.js${p3}`;
    }
    return match;
  });

  if (modified) {
    await writeFile(filePath, content, 'utf-8');
    console.log(`Fixed: ${filePath}`);
  }
}

console.log('Fixing imports in dist directory...');
for await (const file of walk(distDir)) {
  await fixImports(file);
}
console.log('Done!');
