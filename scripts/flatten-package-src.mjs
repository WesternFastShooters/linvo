import {
  existsSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync,
} from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const packagesDir = path.join(rootDir, 'packages');
const dryRun = process.argv.includes('--dry-run');

const ignoredDirs = new Set(['node_modules', 'dist', '.git', '.yarn']);
const flattenTargets = [];

function shouldFlatten(dir) {
  const srcDir = path.join(dir, 'src');
  if (!existsSync(srcDir) || !statSync(srcDir).isDirectory()) {
    return false;
  }

  const srcEntries = readdirSync(srcDir);
  if (srcEntries.length === 0) {
    return false;
  }

  for (const entry of srcEntries) {
    if (existsSync(path.join(dir, entry))) {
      return false;
    }
  }

  return true;
}

function collect(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || ignoredDirs.has(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);
    if (shouldFlatten(fullPath)) {
      flattenTargets.push(fullPath);
      continue;
    }

    collect(fullPath);
  }
}

if (existsSync(packagesDir)) {
  collect(packagesDir);
}

if (flattenTargets.length === 0) {
  console.log('No src directories can be flattened safely.');
  process.exit(0);
}

for (const target of flattenTargets.sort()) {
  const srcDir = path.join(target, 'src');
  const relTarget = path.relative(rootDir, target);

  console.log(`${dryRun ? 'would flatten' : 'flatten'} ${relTarget}`);

  if (dryRun) continue;

  for (const entry of readdirSync(srcDir)) {
    renameSync(path.join(srcDir, entry), path.join(target, entry));
  }

  rmSync(srcDir, { recursive: true, force: true });
}

console.log(
  `${dryRun ? 'Found' : 'Flattened'} ${flattenTargets.length} src directories.`
);
