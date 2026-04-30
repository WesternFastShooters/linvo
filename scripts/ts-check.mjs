import { access, readdir } from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const rootDir = process.cwd();
const packagesDir = path.join(rootDir, 'packages');
const ignoredDirs = new Set(['node_modules', '.git', '.yarn', 'dist']);

async function exists(filePath) {
  try {
    await access(filePath, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function collectPackageDirs(dir, dirs = []) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (ignoredDirs.has(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await collectPackageDirs(fullPath, dirs);
    }
  }

  if (await exists(path.join(dir, 'package.json'))) {
    if (await exists(path.join(dir, 'tsconfig.json'))) {
      dirs.push(dir);
    }
  }

  return dirs;
}

function runTsc(cwd, configPath) {
  const result = spawnSync(
    'yarn',
    ['exec', 'tsc', '--noEmit', '-p', configPath],
    {
      cwd,
      stdio: 'inherit',
    }
  );

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

async function main() {
  const extraArgs = process.argv.slice(2);
  const packageDirs = (await collectPackageDirs(packagesDir)).sort((a, b) =>
    a.localeCompare(b)
  );

  runTsc(rootDir, 'tsconfig.app.json');

  for (const packageDir of packageDirs) {
    console.log(`\n> tsc ${path.relative(rootDir, packageDir)}`);
    const args = ['exec', 'tsc', '--noEmit', '-p', 'tsconfig.json', ...extraArgs];
    const result = spawnSync('yarn', args, {
      cwd: packageDir,
      stdio: 'inherit',
    });

    if (result.status !== 0) {
      process.exit(result.status ?? 1);
    }
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
