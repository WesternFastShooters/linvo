import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const INCLUDE_DIRS = ['app', 'packages', 'test', 'scripts'];
const INCLUDE_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.d.ts']);
const SKIP_DIRS = new Set([
  '.git',
  '.yarn',
  'coverage',
  'dist',
  'node_modules',
  'tmp',
]);

const SPECIFIER_RE =
  /(?<prefix>\b(?:import|export)\b[\s\S]*?\bfrom\s*|import\s*\(\s*)(?<quote>['"])(?<path>\.{1,2}\/[^'"]+?)(?<quote2>['"])/g;

async function walk(dir, out = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath, out);
      continue;
    }

    const ext = path.extname(entry.name);
    if (INCLUDE_EXTS.has(ext) || entry.name.endsWith('.d.ts')) {
      out.push(fullPath);
    }
  }

  return out;
}

function normalizeSpecifier(specifier) {
  return specifier
    .replace(/\/index(?=(?:\.[cm]?[jt]sx?)?$|$)/, '')
    .replace(/\.(?:[cm]?ts|[cm]?js|tsx|jsx)$/, '');
}

function rewriteSource(source) {
  let changed = false;

  const next = source.replace(
    SPECIFIER_RE,
    (match, prefix, quote, specifier, quote2) => {
      const normalized = normalizeSpecifier(specifier);
      if (normalized === specifier) {
        return match;
      }
      changed = true;
      return `${prefix}${quote}${normalized}${quote2}`;
    }
  );

  return { changed, next };
}

async function main() {
  const files = [];
  for (const dir of INCLUDE_DIRS) {
    const fullDir = path.join(ROOT, dir);
    try {
      const stat = await fs.stat(fullDir);
      if (stat.isDirectory()) {
        await walk(fullDir, files);
      }
    } catch {}
  }

  let changedFiles = 0;

  for (const file of files) {
    const source = await fs.readFile(file, 'utf8');
    const { changed, next } = rewriteSource(source);
    if (!changed) {
      continue;
    }

    await fs.writeFile(file, next);
    changedFiles += 1;
    console.log(path.relative(ROOT, file));
  }

  console.log(`Updated ${changedFiles} files.`);
}

await main();
