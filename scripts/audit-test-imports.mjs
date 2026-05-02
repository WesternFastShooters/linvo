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

const defaultRoots = ['app', 'packages', 'test'];
const defaultPatterns = ['linvo/'];

function parseArgs(argv) {
  const args = {
    roots: defaultRoots,
    patterns: defaultPatterns,
  };

  for (const arg of argv) {
    if (arg.startsWith('--roots=')) {
      args.roots = arg
        .slice('--roots='.length)
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);
    } else if (arg.startsWith('--patterns=')) {
      args.patterns = arg
        .slice('--patterns='.length)
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);
    }
  }

  return args;
}

function walk(dir, matcher, files = []) {
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
      walk(fullPath, matcher, files);
      continue;
    }

    if (matcher(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
}

function isTestFile(filePath) {
  const normalized = path.normalize(filePath);
  const fileName = path.basename(normalized);
  return (
    normalized.includes(`${path.sep}__tests__${path.sep}`) ||
    /\.spec\.(?:ts|tsx|mts|cts|js|jsx|mjs|cjs)$/.test(fileName) ||
    /\.test\.(?:ts|tsx|mts|cts|js|jsx|mjs|cjs)$/.test(fileName)
  );
}

function collectTestFiles(roots) {
  const files = new Set();
  for (const root of roots) {
    const absRoot = path.resolve(rootDir, root);
    for (const file of walk(absRoot, filePath =>
      sourceExtensions.has(path.extname(filePath)) && isTestFile(filePath)
    )) {
      files.add(path.normalize(path.relative(rootDir, file)));
    }
  }
  return [...files].sort();
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

function readImports(filePath) {
  const sourceText = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true
  );

  const imports = [];

  function visit(node) {
    if (
      ts.isImportDeclaration(node) ||
      ts.isExportDeclaration(node) ||
      ts.isImportEqualsDeclaration(node)
    ) {
      const moduleSpecifier = node.moduleSpecifier ?? node?.moduleReference;
      if (moduleSpecifier && ts.isStringLiteralLike(moduleSpecifier)) {
        imports.push({
          specifier: moduleSpecifier.text,
          line: sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
          column: sourceFile.getLineAndCharacterOfPosition(node.getStart()).character + 1,
        });
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return imports;
}

function resolveImport(specifier, fromFile, compilerOptions) {
  const result = ts.resolveModuleName(specifier, fromFile, compilerOptions, ts.sys);
  const resolvedFileName = result.resolvedModule?.resolvedFileName;
  if (!resolvedFileName) {
    return null;
  }

  let realPath = resolvedFileName.split('?')[0];
  try {
    realPath = fs.realpathSync.native(realPath);
  } catch {
    // Keep the resolved path if the symlink target cannot be resolved.
  }

  return path.normalize(realPath);
}

function isBannedSpecifier(specifier, patterns) {
  return patterns.some(pattern => specifier === pattern || specifier.startsWith(pattern));
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const compilerOptions = loadCompilerOptions();
  const testFiles = collectTestFiles(args.roots);
  const findings = [];

  for (const file of testFiles) {
    for (const { specifier, line, column } of readImports(path.resolve(rootDir, file))) {
      if (!isBannedSpecifier(specifier, args.patterns)) {
        continue;
      }

      findings.push({
        file,
        line,
        column,
        specifier,
        resolved: resolveImport(specifier, path.resolve(rootDir, file), compilerOptions),
      });
    }
  }

  if (findings.length === 0) {
    console.log('Test import audit passed.');
    return;
  }

  findings.sort((a, b) =>
    a.file.localeCompare(b.file) ||
    a.line - b.line ||
    a.column - b.column ||
    a.specifier.localeCompare(b.specifier)
  );

  console.error('Test import audit failed:');
  for (const finding of findings) {
    console.error(
      `- ${finding.file}:${finding.line}:${finding.column} imports ${finding.specifier}` +
        (finding.resolved ? ` -> ${path.relative(rootDir, finding.resolved)}` : ' -> unresolved')
    );
  }

  process.exitCode = 1;
}

main();
