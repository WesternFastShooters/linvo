import { access, readdir } from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const rootDir = process.cwd();
const vitestBin = path.join(rootDir, 'node_modules/.bin/vitest');
const packagesDir = path.join(rootDir, 'packages');
const testDir = path.join(rootDir, 'test');
const testFilePattern = /\.(?:unit\.)?(?:spec|test)\.[cm]?[jt]sx?$/;
const ignoredDirs = new Set(['node_modules', '.git', '.yarn', 'dist']);

async function exists(filePath) {
  try {
    await access(filePath, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function collectTestFiles(dir, files = []) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (ignoredDirs.has(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await collectTestFiles(fullPath, files);
      continue;
    }

    if (entry.isFile() && testFilePattern.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

async function findPackageDir(filePath) {
  let current = path.dirname(filePath);

  while (current.startsWith(packagesDir) || current.startsWith(testDir)) {
    if (await exists(path.join(current, 'package.json'))) {
      return current;
    }

    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }

  return null;
}

async function discoverTestPackages() {
  const files = [
    ...(await collectTestFiles(packagesDir)),
    ...(await collectTestFiles(testDir)),
  ];
  const packageDirs = new Map();

  for (const filePath of files) {
    const packageDir = await findPackageDir(filePath);
    if (!packageDir) continue;
    packageDirs.set(packageDir, true);
  }

  return [...packageDirs.keys()].sort((a, b) => a.localeCompare(b));
}

function runCommand(cwd, args) {
  const result = spawnSync(
    vitestBin,
    [
      '--run',
      '--passWithNoTests',
      '--config',
      path.join(rootDir, 'scripts/vitest-runner.config.mjs'),
      ...args,
    ],
    {
      cwd,
      env: {
        ...process.env,
        VITEST_PACKAGE_DIR: cwd,
      },
      stdio: 'inherit',
    }
  );

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

async function main() {
  const extraArgs = process.argv.slice(2);
  const packageDirs = await discoverTestPackages();

  if (packageDirs.length === 0) {
    console.error('No test packages found.');
    process.exit(1);
  }

  for (const packageDir of packageDirs) {
    console.log(`\n> vitest ${path.relative(rootDir, packageDir)}`);
    runCommand(packageDir, extraArgs);
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
