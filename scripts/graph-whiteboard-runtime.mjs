import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const rootDir = process.cwd();
const defaultEntry = path.join(rootDir, 'app/extensions.ts');
const textExtensions = new Set([
  '.ts',
  '.tsx',
  '.mts',
  '.cts',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
]);

const defaultBannedPackages = [
  '@linvo/linvo-block-code',
  '@linvo/linvo-block-divider',
  '@linvo/linvo-block-edgeless-text',
  '@linvo/linvo-block-latex',
  '@linvo/linvo-block-list',
  '@linvo/linvo-block-paragraph',
  '@linvo/linvo-inline-footnote',
  '@linvo/linvo-inline-latex',
  '@linvo/linvo-inline-link',
  '@linvo/linvo-inline-preset',
  '@linvo/linvo-inline-reference',
  '@linvo/linvo-widget-keyboard-toolbar',
  '@linvo/linvo-widget-slash-menu',
];

function parseArgs(argv) {
  const args = {
    entries: [defaultEntry],
    format: 'text',
    out: null,
    banned: defaultBannedPackages,
    includeFiles: false,
  };

  for (const arg of argv) {
    if (arg.startsWith('--entries=')) {
      args.entries = arg
        .slice('--entries='.length)
        .split(',')
        .filter(Boolean)
        .map(entry => path.resolve(rootDir, entry));
    } else if (arg.startsWith('--format=')) {
      args.format = arg.slice('--format='.length);
    } else if (arg.startsWith('--out=')) {
      args.out = path.resolve(rootDir, arg.slice('--out='.length));
    } else if (arg.startsWith('--banned=')) {
      args.banned = arg
        .slice('--banned='.length)
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);
    } else if (arg === '--include-files') {
      args.includeFiles = true;
    }
  }

  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function walk(dir, matcher, files = []) {
  if (!fs.existsSync(dir)) {
    return files;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'dist' || entry.name === 'node_modules') {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, matcher, files);
      continue;
    }

    if (matcher(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
}

function findNearestPackageJson(startPath) {
  let current = path.dirname(startPath);
  while (current.startsWith(rootDir)) {
    const packageJsonPath = path.join(current, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      return packageJsonPath;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }
  return null;
}

function collectWorkspacePackages() {
  const packageJsonFiles = walk(
    path.join(rootDir, 'packages'),
    filePath => path.basename(filePath) === 'package.json'
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
  if (configFile.error) {
    throw new Error(ts.flattenDiagnosticMessageText(configFile.error.messageText, '\n'));
  }

  const parsed = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(configPath)
  );

  return parsed.options;
}

function isSourceFile(filePath) {
  return textExtensions.has(path.extname(filePath)) && filePath.startsWith(rootDir);
}

function listImports(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  const info = ts.preProcessFile(source, true, true);
  return info.importedFiles.map(file => file.fileName);
}

function resolveImport(specifier, fromFile, compilerOptions) {
  const result = ts.resolveModuleName(specifier, fromFile, compilerOptions, ts.sys);
  const resolvedFileName = result.resolvedModule?.resolvedFileName;
  if (!resolvedFileName) {
    return null;
  }

  const normalized = resolvedFileName.split('?')[0];
  let realPath = normalized;
  try {
    realPath = fs.realpathSync.native(normalized);
  } catch {
    // Keep the original path if the symlink target cannot be resolved.
  }
  if (!isSourceFile(realPath)) {
    return null;
  }

  return path.normalize(realPath);
}

function getOwnerPackage(filePath, workspacePackages) {
  const packageJsonPath = findNearestPackageJson(filePath);
  if (!packageJsonPath) {
    return '<app>';
  }

  const pkgDir = path.dirname(packageJsonPath);
  for (const pkg of workspacePackages.values()) {
    if (pkg.dir === pkgDir) {
      return pkg.name;
    }
  }

  return '<app>';
}

function buildGraph(entries, compilerOptions, workspacePackages) {
  const queue = [...entries];
  const visitedFiles = new Set();
  const fileEdges = new Map();
  const packageEdges = new Map();
  const packageFiles = new Map();

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || visitedFiles.has(current) || !fs.existsSync(current)) {
      continue;
    }

    visitedFiles.add(current);
    const owner = getOwnerPackage(current, workspacePackages);
    if (!packageFiles.has(owner)) {
      packageFiles.set(owner, new Set());
    }
    packageFiles.get(owner).add(current);

    const imports = [];
    for (const specifier of listImports(current)) {
      const resolved = resolveImport(specifier, current, compilerOptions);
      if (!resolved) {
        continue;
      }

      imports.push(resolved);
      queue.push(resolved);

      const targetOwner = getOwnerPackage(resolved, workspacePackages);
      if (owner !== targetOwner) {
        if (!packageEdges.has(owner)) {
          packageEdges.set(owner, new Set());
        }
        packageEdges.get(owner).add(targetOwner);
      }
    }

    fileEdges.set(current, imports);
  }

  return { visitedFiles, fileEdges, packageEdges, packageFiles };
}

function shortestPath(graph, from, to) {
  const queue = [[from]];
  const visited = new Set([from]);

  while (queue.length > 0) {
    const currentPath = queue.shift();
    const node = currentPath.at(-1);
    if (node === to) {
      return currentPath;
    }

    for (const next of graph.get(node) ?? []) {
      if (visited.has(next)) {
        continue;
      }
      visited.add(next);
      queue.push([...currentPath, next]);
    }
  }

  return null;
}

function formatText(result, entries, bannedPackages, includeFiles) {
  const lines = [];
  lines.push('Whiteboard Runtime Graph');
  lines.push(`Entries: ${entries.map(entry => path.relative(rootDir, entry)).join(', ')}`);
  lines.push(`Reachable files: ${result.visitedFiles.size}`);
  lines.push(`Reachable packages: ${result.packageFiles.size}`);
  lines.push('');
  lines.push('Package graph:');

  const owners = [...result.packageFiles.keys()].sort();
  for (const owner of owners) {
    const deps = [...(result.packageEdges.get(owner) ?? [])].sort();
    const fileCount = result.packageFiles.get(owner)?.size ?? 0;
    lines.push(`- ${owner} (${fileCount} files)`);
    if (includeFiles) {
      const files = [...(result.packageFiles.get(owner) ?? [])]
        .sort()
        .map(file => path.relative(rootDir, file));
      for (const file of files) {
        lines.push(`    file: ${file}`);
      }
    }
    for (const dep of deps) {
      lines.push(`  -> ${dep}`);
    }
  }

  const rootOwner = '<app>';
  const bannedHits = bannedPackages
    .filter(pkg => owners.includes(pkg))
    .map(pkg => ({
      pkg,
      path: shortestPath(result.packageEdges, rootOwner, pkg),
    }));

  lines.push('');
  if (bannedHits.length === 0) {
    lines.push('Banned packages reachable: none');
  } else {
    lines.push('Banned packages reachable:');
    for (const hit of bannedHits) {
      lines.push(`- ${hit.pkg}`);
      if (hit.path) {
        lines.push(`  path: ${hit.path.join(' -> ')}`);
      }
    }
  }

  return `${lines.join('\n')}\n`;
}

function formatJson(result, entries, bannedPackages, includeFiles) {
  const owners = [...result.packageFiles.keys()].sort();
  const bannedHits = bannedPackages
    .filter(pkg => owners.includes(pkg))
    .map(pkg => ({
      package: pkg,
      path: shortestPath(result.packageEdges, '<app>', pkg),
    }));

  return JSON.stringify(
    {
      entries: entries.map(entry => path.relative(rootDir, entry)),
      reachableFiles: result.visitedFiles.size,
      reachablePackages: owners.length,
      packages: owners.map(owner => ({
        name: owner,
        fileCount: result.packageFiles.get(owner)?.size ?? 0,
        dependencies: [...(result.packageEdges.get(owner) ?? [])].sort(),
        ...(includeFiles
          ? {
              files: [...(result.packageFiles.get(owner) ?? [])]
                .sort()
                .map(file => path.relative(rootDir, file)),
            }
          : {}),
      })),
      bannedReachable: bannedHits,
    },
    null,
    2
  );
}

function formatDot(result) {
  const lines = ['digraph WhiteboardRuntime {'];
  lines.push('  rankdir=LR;');
  for (const owner of [...result.packageFiles.keys()].sort()) {
    lines.push(`  "${owner}";`);
  }
  for (const [from, deps] of result.packageEdges.entries()) {
    for (const to of deps) {
      lines.push(`  "${from}" -> "${to}";`);
    }
  }
  lines.push('}');
  return `${lines.join('\n')}\n`;
}

function writeOutput(output, outPath) {
  if (!outPath) {
    process.stdout.write(output);
    return;
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, output);
  process.stdout.write(`${path.relative(rootDir, outPath)}\n`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const workspacePackages = collectWorkspacePackages();
  const compilerOptions = loadCompilerOptions();
  const result = buildGraph(args.entries, compilerOptions, workspacePackages);

  const formatter =
    args.format === 'json'
      ? formatJson(result, args.entries, args.banned, args.includeFiles)
      : args.format === 'dot'
        ? formatDot(result)
        : formatText(result, args.entries, args.banned, args.includeFiles);

  writeOutput(formatter, args.out);
}

main();
