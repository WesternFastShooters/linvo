import { access, readdir } from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

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

function runTsc(cwd, configPath, noEmit = true, extraArgs = []) {
  const args = ['exec', 'tsc', '-p', configPath, ...extraArgs];
  if (noEmit) {
    args.splice(2, 0, '--noEmit');
  }
  const result = spawnSync(
    'yarn',
    args,
    {
      cwd,
      stdio: 'inherit',
    }
  );

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

async function readReferences(packageDir) {
  const tsconfigPath = path.join(packageDir, 'tsconfig.json');
  const tsconfigText = await readFile(tsconfigPath, 'utf8');
  const parsed = ts.parseConfigFileTextToJson(tsconfigPath, tsconfigText);
  if (parsed.error) {
    throw new Error(
      ts.flattenDiagnosticMessageText(parsed.error.messageText, '\n')
    );
  }
  const tsconfig = parsed.config ?? {};
  return (tsconfig.references ?? [])
    .map(ref => ref.path)
    .map(refPath => path.resolve(packageDir, refPath))
    .filter(refDir => refDir.startsWith(packagesDir));
}

async function topoSortPackageDirs(packageDirs) {
  const dirSet = new Set(packageDirs.map(dir => path.resolve(dir)));
  const graph = new Map();
  const inDegree = new Map();

  for (const dir of packageDirs) {
    const resolved = path.resolve(dir);
    graph.set(resolved, []);
    inDegree.set(resolved, 0);
  }

  for (const dir of packageDirs) {
    const resolved = path.resolve(dir);
    const refs = await readReferences(resolved);
    for (const ref of refs) {
      if (!dirSet.has(ref)) continue;
      graph.get(ref).push(resolved);
      inDegree.set(resolved, (inDegree.get(resolved) ?? 0) + 1);
    }
  }

  const queue = packageDirs
    .map(dir => path.resolve(dir))
    .filter(dir => (inDegree.get(dir) ?? 0) === 0)
    .sort((a, b) => a.localeCompare(b));
  const result = [];

  while (queue.length > 0) {
    const current = queue.shift();
    result.push(current);
    for (const next of graph.get(current) ?? []) {
      const nextDegree = (inDegree.get(next) ?? 0) - 1;
      inDegree.set(next, nextDegree);
      if (nextDegree === 0) {
        queue.push(next);
        queue.sort((a, b) => a.localeCompare(b));
      }
    }
  }

  if (result.length !== packageDirs.length) {
    throw new Error('Failed to topologically sort package tsconfig references');
  }

  return result;
}

async function main() {
  const extraArgs = process.argv.slice(2);
  const packageDirs = await topoSortPackageDirs(
    (await collectPackageDirs(packagesDir)).sort((a, b) => a.localeCompare(b))
  );

  runTsc(rootDir, 'tsconfig.app.json', true, extraArgs);

  for (const packageDir of packageDirs) {
    console.log(`\n> tsc ${path.relative(rootDir, packageDir)}`);
    runTsc(packageDir, 'tsconfig.json', false, extraArgs);
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
