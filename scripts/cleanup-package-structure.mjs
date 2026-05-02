import { rmSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const packagesDir = path.join(rootDir, 'packages');
const packageRoots = new Set(['core', 'primitives', 'ui', 'integrations']);
const dryRun = process.argv.includes('--dry-run');

const removals = [];

function collectNestedArtifacts(dir, depthFromPackages = 0) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules') continue;

    const fullPath = path.join(dir, entry.name);

    if (depthFromPackages === 0 && entry.isDirectory()) {
      if (!packageRoots.has(entry.name)) continue;
      collectNestedArtifacts(fullPath, 1);
      continue;
    }

    if (entry.isDirectory()) {
      if (entry.name === 'dist' && depthFromPackages > 1) {
        removals.push(fullPath);
        continue;
      }

      collectNestedArtifacts(fullPath, depthFromPackages + 1);
      continue;
    }

    if (
      depthFromPackages > 1 &&
      (entry.name === 'package.json' || entry.name === 'tsconfig.json')
    ) {
      removals.push(fullPath);
    }
  }
}

if (existsSync(packagesDir)) {
  collectNestedArtifacts(packagesDir);
}

if (removals.length === 0) {
  console.log('No nested package artifacts found.');
  process.exit(0);
}

for (const target of removals.sort()) {
  console.log(`${dryRun ? 'would remove' : 'remove'} ${path.relative(rootDir, target)}`);
  if (!dryRun) {
    rmSync(target, { recursive: true, force: true });
  }
}

console.log(`${dryRun ? 'Found' : 'Removed'} ${removals.length} nested artifacts.`);
