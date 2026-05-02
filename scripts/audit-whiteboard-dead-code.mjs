import fs from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';

const rootDir = process.cwd();
const defaultRoots = ['app', 'packages'];
const sourceExtensions = new Set([
  '.ts',
  '.tsx',
  '.mts',
  '.cts',
]);

function parseArgs(argv) {
  const args = {
    entries: collectDefaultEntries(),
    roots: defaultRoots,
    format: 'text',
    out: null,
  };

  for (const arg of argv) {
    if (arg.startsWith('--entries=')) {
      args.entries = arg
        .slice('--entries='.length)
        .split(',')
        .filter(Boolean);
    } else if (arg.startsWith('--roots=')) {
      args.roots = arg
        .slice('--roots='.length)
        .split(',')
        .filter(Boolean);
    } else if (arg.startsWith('--format=')) {
      args.format = arg.slice('--format='.length);
    } else if (arg.startsWith('--out=')) {
      args.out = arg.slice('--out='.length);
    }
  }

  return args;
}

function collectDefaultEntries() {
  const entries = new Set([
    'app/extensions.ts',
    'app/main.ts',
    'app/editor.ts',
    'app/mock-services.ts',
  ]);

  for (const file of walk(
    path.join(rootDir, 'packages'),
    filePath => path.basename(filePath) === 'index.ts' &&
      path.dirname(filePath).endsWith(path.sep + 'app')
  )) {
    entries.add(path.relative(rootDir, file));
  }

  return [...entries];
}

function walk(dir, matcher, files = []) {
  if (!fs.existsSync(dir)) {
    return files;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'dist' || entry.name === 'node_modules') {
      continue;
    }
    if (entry.name === '__tests__') {
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
    if (parent === current) break;
    current = parent;
  }
  return null;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function collectWorkspacePackages() {
  const packageJsonFiles = walk(
    path.join(rootDir, 'packages'),
    filePath => path.basename(filePath) === 'package.json'
  );

  const packages = new Map();
  for (const packageJsonPath of packageJsonFiles) {
    const pkg = readJson(packageJsonPath);
    if (!pkg.name) continue;
    packages.set(pkg.name, {
      name: pkg.name,
      dir: path.dirname(packageJsonPath),
    });
  }
  return packages;
}

function ownerOf(filePath, workspacePackages) {
  const packageJsonPath = findNearestPackageJson(filePath);
  if (!packageJsonPath) return '<app>';

  const pkgDir = path.dirname(packageJsonPath);
  for (const pkg of workspacePackages.values()) {
    if (pkg.dir === pkgDir) return pkg.name;
  }
  return '<app>';
}

function collectCandidateFiles(roots) {
  const files = new Set();
  for (const root of roots) {
    const absRoot = path.resolve(rootDir, root);
    for (const file of walk(absRoot, filePath =>
      sourceExtensions.has(path.extname(filePath)) &&
      !filePath.endsWith('.d.ts')
    )) {
      files.add(path.normalize(path.relative(rootDir, file)));
    }
  }
  return files;
}

function runRuntimeGraph(entries) {
  const graphScript = path.join(rootDir, 'scripts/graph-whiteboard-runtime.mjs');
  const command = [
    'node',
    graphScript,
    `--entries=${entries.join(',')}`,
    '--format=json',
    '--include-files',
  ];

  const output = execSync(command.map(arg => JSON.stringify(arg)).join(' '), {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  });

  return JSON.parse(output);
}

function formatText(report) {
  const lines = [];
  lines.push('Whiteboard Dead Code Audit');
  lines.push(`Entries: ${report.entries.join(', ')}`);
  lines.push(`Roots: ${report.roots.join(', ')}`);
  lines.push(`Reachable files: ${report.reachableFiles.size}`);
  lines.push(`Candidate files: ${report.candidateFiles.size}`);
  lines.push(`Unreachable files: ${report.unreachableFiles.length}`);
  lines.push(`Unreachable packages: ${report.unreachablePackages.length}`);

  if (report.unreachablePackages.length > 0) {
    lines.push('');
    lines.push('Unreachable packages:');
    for (const pkg of report.unreachablePackages) {
      lines.push(`- ${pkg.name} (${pkg.fileCount} files)`);
    }
  }

  if (report.unreachableFiles.length > 0) {
    lines.push('');
    lines.push('Unreachable files:');
    for (const file of report.unreachableFiles) {
      lines.push(`- ${file.file}`);
    }
  }

  return `${lines.join('\n')}\n`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const entries = args.entries.map(entry => path.relative(rootDir, path.resolve(rootDir, entry)));
  const roots = args.roots.map(root => path.relative(rootDir, path.resolve(rootDir, root)));
  const graph = runRuntimeGraph(entries);
  const workspacePackages = collectWorkspacePackages();
  const candidateFiles = collectCandidateFiles(roots);
  const reachableFiles = new Set(graph.packages.flatMap(pkg => pkg.files ?? []));

  const unreachableFiles = [...candidateFiles]
    .filter(file => !reachableFiles.has(file))
    .sort()
    .map(file => ({
      file,
      owner: ownerOf(path.resolve(rootDir, file), workspacePackages),
    }));

  const packageMap = new Map();
  const packageReachableCounts = new Map();
  for (const file of unreachableFiles) {
    if (!packageMap.has(file.owner)) {
      packageMap.set(file.owner, []);
    }
    packageMap.get(file.owner).push(file.file);
  }
  for (const file of candidateFiles) {
    const owner = ownerOf(path.resolve(rootDir, file), workspacePackages);
    if (!packageReachableCounts.has(owner)) {
      packageReachableCounts.set(owner, { candidate: 0, reachable: 0 });
    }
    const counts = packageReachableCounts.get(owner);
    counts.candidate += 1;
    if (reachableFiles.has(file)) {
      counts.reachable += 1;
    }
  }

  const unreachablePackages = [...packageMap.entries()]
    .map(([name, files]) => ({
      name,
      fileCount: files.length,
      files: files.sort(),
      counts: packageReachableCounts.get(name) ?? {
        candidate: files.length,
        reachable: 0,
      },
    }))
    .filter(pkg => pkg.counts.reachable === 0)
    .sort((a, b) => a.name.localeCompare(b.name));

  const report = {
    entries,
    roots,
    reachableFiles,
    candidateFiles,
    unreachableFiles,
    unreachablePackages,
  };

  const output =
    args.format === 'json'
      ? JSON.stringify(
          {
            entries,
            roots,
            reachableFiles: [...reachableFiles].sort(),
            candidateFiles: [...candidateFiles].sort(),
            unreachableFiles,
            unreachablePackages,
          },
          null,
          2
        )
      : formatText(report);

  if (args.out) {
    const outPath = path.resolve(rootDir, args.out);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, output);
    process.stdout.write(`${path.relative(rootDir, outPath)}\n`);
  } else {
    process.stdout.write(output);
  }

  if (unreachableFiles.length > 0) {
    process.exitCode = 1;
  }
}

main();
