import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const rootDir = process.cwd();
const sourceExtensions = new Set([
  '.ts',
  '.tsx',
  '.mts',
  '.cts',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
]);

function parseArgs(argv) {
  const args = {
    targets: [],
    format: 'text',
  };

  for (const arg of argv) {
    if (arg.startsWith('--targets=')) {
      args.targets = arg
        .slice('--targets='.length)
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);
    } else if (arg.startsWith('--format=')) {
      args.format = arg.slice('--format='.length);
    }
  }

  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) {
    return files;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (
      entry.name === 'dist' ||
      entry.name === 'node_modules' ||
      entry.name === '__tests__' ||
      entry.name === 'test'
    ) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
      continue;
    }

    if (sourceExtensions.has(path.extname(fullPath))) {
      files.push(fullPath);
    }
  }

  return files;
}

function collectPackageJsonFiles(dir, files = []) {
  if (!fs.existsSync(dir)) {
    return files;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (
      entry.name === 'dist' ||
      entry.name === 'node_modules' ||
      entry.name === '.git' ||
      entry.name === '.yarn'
    ) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectPackageJsonFiles(fullPath, files);
      continue;
    }

    if (entry.isFile() && entry.name === 'package.json') {
      files.push(fullPath);
    }
  }

  return files;
}

function collectWorkspacePackages() {
  const roots = ['packages', 'test'];
  const packageJsonFiles = roots.flatMap(root =>
    collectPackageJsonFiles(path.join(rootDir, root))
  );
  const packages = new Map();

  for (const packageJsonPath of packageJsonFiles) {
    const pkg = readJson(packageJsonPath);
    if (!pkg.name) {
      continue;
    }

    packages.set(pkg.name, {
      name: pkg.name,
      dir: path.dirname(packageJsonPath),
      packageJsonPath,
      packageJson: pkg,
    });
  }

  return packages;
}

function loadCompilerOptions() {
  const configPath = ts.findConfigFile(rootDir, ts.sys.fileExists, 'tsconfig.json');
  if (!configPath) {
    throw new Error('Cannot find tsconfig.json');
  }

  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(configPath)
  );
  return parsed.options;
}

function listImports(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  return ts.preProcessFile(source, true, true).importedFiles.map(
    item => item.fileName
  );
}

function resolveImport(specifier, fromFile, compilerOptions) {
  const result = ts.resolveModuleName(specifier, fromFile, compilerOptions, ts.sys);
  return result.resolvedModule?.resolvedFileName ?? null;
}

function findPackageOwner(filePath, workspacePackages) {
  const normalized = path.normalize(filePath);
  for (const pkg of workspacePackages.values()) {
    if (normalized.startsWith(pkg.dir + path.sep) || normalized === pkg.dir) {
      return pkg.name;
    }
  }
  return null;
}

function toTargetPackages(targets, workspacePackages) {
  if (targets.length === 0) {
    return [...workspacePackages.values()]
      .filter(pkg => pkg.name.startsWith('@linvo/'))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  const resolved = [];
  for (const target of targets) {
    const byName = workspacePackages.get(target);
    if (byName) {
      resolved.push(byName);
      continue;
    }

    const absolute = path.resolve(rootDir, target);
    for (const pkg of workspacePackages.values()) {
      if (pkg.dir === absolute) {
        resolved.push(pkg);
      }
    }
  }

  return resolved;
}

function collectDeclaredWorkspaceDeps(pkg, workspacePackages) {
  const fields = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
  const declared = new Set();
  for (const field of fields) {
    const deps = pkg.packageJson[field] ?? {};
    for (const depName of Object.keys(deps)) {
      if (workspacePackages.has(depName)) {
        declared.add(depName);
      }
    }
  }
  return declared;
}

function collectUsedWorkspaceDeps(pkg, workspacePackages, compilerOptions) {
  const srcDir = path.join(pkg.dir, 'src');
  const files = walk(srcDir);
  const used = new Set();

  for (const filePath of files) {
    for (const specifier of listImports(filePath)) {
      const resolved = resolveImport(specifier, filePath, compilerOptions);
      if (!resolved) {
        continue;
      }

      const owner = findPackageOwner(resolved, workspacePackages);
      if (owner && owner !== pkg.name) {
        used.add(owner);
      }
    }
  }

  return used;
}

function diffSet(left, right) {
  return [...left].filter(item => !right.has(item)).sort();
}

function formatText(results) {
  const lines = ['Workspace Dependency Audit'];
  for (const result of results) {
    lines.push('');
    lines.push(`- ${result.name}`);
    lines.push(`  declared: ${result.declared.length}`);
    lines.push(`  used: ${result.used.length}`);
    lines.push(
      `  unused: ${result.unused.length ? result.unused.join(', ') : 'none'}`
    );
    lines.push(
      `  missing: ${result.missing.length ? result.missing.join(', ') : 'none'}`
    );
  }
  return `${lines.join('\n')}\n`;
}

function formatJson(results) {
  return JSON.stringify(results, null, 2);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const workspacePackages = collectWorkspacePackages();
  const compilerOptions = loadCompilerOptions();
  const targetPackages = toTargetPackages(args.targets, workspacePackages);

  const results = targetPackages.map(pkg => {
    const declared = [...collectDeclaredWorkspaceDeps(pkg, workspacePackages)].sort();
    const used = [...collectUsedWorkspaceDeps(pkg, workspacePackages, compilerOptions)].sort();
    const declaredSet = new Set(declared);
    const usedSet = new Set(used);

    return {
      name: pkg.name,
      declared,
      used,
      unused: diffSet(declaredSet, usedSet),
      missing: diffSet(usedSet, declaredSet),
    };
  });

  const output = args.format === 'json' ? formatJson(results) : formatText(results);
  process.stdout.write(output);
}

main();
