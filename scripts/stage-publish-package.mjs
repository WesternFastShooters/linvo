import {
  copyFileSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { fileURLToPath } from 'node:url';

const packageDirArg = process.argv[2];

if (!packageDirArg) {
  console.error('Usage: node ./scripts/stage-publish-package.mjs <package-dir>');
  process.exit(1);
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const packageDir = path.resolve(rootDir, packageDirArg);
const sourceManifestPath = path.join(packageDir, 'package.json');
const sourceManifest = JSON.parse(readFileSync(sourceManifestPath, 'utf8'));
const distDir = path.join(packageDir, 'dist');
const workspacePackagePaths = [
  path.join(rootDir, 'packages/core/package.json'),
  path.join(rootDir, 'packages/primitives/package.json'),
  path.join(rootDir, 'packages/ui/package.json'),
  path.join(rootDir, 'packages/integrations/package.json'),
];
const workspaceVersions = new Map(
  workspacePackagePaths
    .map(manifestPath => JSON.parse(readFileSync(manifestPath, 'utf8')))
    .map(manifest => [manifest.name, manifest.version])
);
const internalAliasToPublishedPackage = new Map([
  ['@linvo-core', '@whfzgyx/linvo-core'],
  ['@linvo-primitives', '@whfzgyx/linvo-primitives'],
  ['@linvo-ui', '@whfzgyx/linvo-ui'],
  ['@linvo-integrations', '@whfzgyx/linvo-integrations'],
]);

const exportRoots = {
  '@whfzgyx/linvo-core': {
    composition: 'framework/composition',
    global: 'framework/global',
    std: 'framework/std',
    store: 'framework/store',
    content: 'runtime/content',
    foundation: 'runtime/foundation-base',
    shared: 'runtime/shared-base',
    'block-surface': 'runtime/block-surface',
    'block-root': 'runtime/block-edgeless-root',
    'turbo-renderer': 'runtime/turbo-renderer',
  },
  '@whfzgyx/linvo-primitives': {
    brush: 'elements/brush',
    connector: 'elements/connector',
    group: 'elements/group',
    mindmap: 'elements/mindmap',
    pointer: 'elements/pointer',
    shape: 'elements/shape',
    text: 'elements/text',
    attachment: 'nodes/attachment',
    embed: 'nodes/embed',
    frame: 'nodes/frame',
    image: 'nodes/image',
  },
  '@whfzgyx/linvo-ui': {
    components: 'components-base',
    'edgeless-dragging-area': 'edgeless-dragging-area',
    'edgeless-selected-rect': 'edgeless-selected-rect',
    'edgeless-toolbar': 'edgeless-toolbar',
    'edgeless-zoom-toolbar': 'edgeless-zoom-toolbar',
    'frame-title': 'frame-title',
    'scroll-anchoring': 'scroll-anchoring',
    'viewport-overlay': 'viewport-overlay',
  },
  '@whfzgyx/linvo-integrations': {
    mermaid: 'mermaid',
  },
};

const rootMap = exportRoots[sourceManifest.name];

if (!rootMap) {
  console.error(`Unsupported package: ${sourceManifest.name}`);
  process.exit(1);
}

function toPosix(value) {
  return value.split(path.sep).join('/');
}

function walk(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
      continue;
    }
    if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

function shouldSkipEntry(fullPath) {
  const rel = toPosix(path.relative(packageDir, fullPath));
  return (
    rel === 'package.json' ||
    rel === 'tsconfig.json' ||
    path.basename(rel) === 'typedoc.json' ||
    path.basename(rel) === 'vitest.config.ts' ||
    path.basename(rel) === 'vitest.config.js' ||
    rel === 'dist' ||
    rel.startsWith('dist/') ||
    rel.includes('/node_modules/') ||
    rel.startsWith('node_modules/') ||
    rel.includes('/__tests__/') ||
    rel.endsWith('.spec.ts') ||
    rel.endsWith('.spec.tsx')
  );
}

function isPublishableFile(fullPath) {
  if (fullPath.endsWith('.d.ts')) return true;
  if (fullPath.endsWith('.js')) return true;
  if (fullPath.endsWith('.css')) return true;
  if (fullPath.endsWith('.svg')) return true;
  if (fullPath.endsWith('.json')) return true;
  if (fullPath.endsWith('.wasm')) return true;
  if (path.basename(fullPath) === 'LICENSE') return true;
  return false;
}

function isTranspilableTsFile(fullPath) {
  return fullPath.endsWith('.ts') && !fullPath.endsWith('.d.ts');
}

function shouldGenerateDeclarationStub(sourceText) {
  const stripped = sourceText
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .filter(line => !line.startsWith('//'));

  return stripped.every(
    line =>
      line.startsWith('export ') ||
      line.startsWith('import ') ||
      line === '};' ||
      line === '}'
  ) &&
    !stripped.some(line =>
      /(class\s|function\s|const\s|let\s|var\s|=>|return\s|@\w| accessor )/.test(line)
    );
}

function hasFile(filePath) {
  try {
    return statSync(filePath).isFile();
  } catch {
    return false;
  }
}

function resolveWorkspaceRanges(deps) {
  if (!deps) {
    return undefined;
  }

  const resolved = Object.fromEntries(
    Object.entries(deps).map(([name, range]) => {
      if (!String(range).startsWith('workspace:')) {
        return [name, range];
      }

      const workspaceVersion = workspaceVersions.get(name);
      if (!workspaceVersion) {
        throw new Error(`Unable to resolve workspace dependency version for ${name}`);
      }

      return [name, workspaceVersion];
    })
  );

  return Object.keys(resolved).length > 0 ? resolved : undefined;
}

function rewriteInternalSpecifiers(sourceText) {
  let nextText = sourceText;

  for (const [internalAlias, publishedName] of internalAliasToPublishedPackage) {
    nextText = nextText
      .replaceAll(`'${internalAlias}/`, `'${publishedName}/`)
      .replaceAll(`"${internalAlias}/`, `"${publishedName}/`)
      .replaceAll(`'${internalAlias}'`, `'${publishedName}'`)
      .replaceAll(`"${internalAlias}"`, `"${publishedName}"`);
  }

  return nextText;
}

function stageRuntimeFiles() {
  rmSync(distDir, { recursive: true, force: true });
  mkdirSync(distDir, { recursive: true });

  for (const buildRoot of Object.values(rootMap)) {
    const absBuildRoot = path.join(packageDir, buildRoot);
    if (!statSync(absBuildRoot, { throwIfNoEntry: false })?.isDirectory()) {
      continue;
    }

    for (const fullPath of walk(absBuildRoot)) {
      if (shouldSkipEntry(fullPath)) {
        continue;
      }

      const relPath = path.relative(packageDir, fullPath);

      if (isPublishableFile(fullPath)) {
        const targetPath = path.join(distDir, relPath);
        mkdirSync(path.dirname(targetPath), { recursive: true });
        if (fullPath.endsWith('.js') || fullPath.endsWith('.d.ts')) {
          const sourceText = readFileSync(fullPath, 'utf8');
          writeFileSync(targetPath, rewriteInternalSpecifiers(sourceText));
        } else {
          copyFileSync(fullPath, targetPath);
        }
        continue;
      }

      if (!isTranspilableTsFile(fullPath)) {
        continue;
      }

      const sourceText = readFileSync(fullPath, 'utf8');
      const jsSourcePath = fullPath.slice(0, -3) + '.js';
      const dtsSourcePath = fullPath.slice(0, -3) + '.d.ts';

      if (!hasFile(jsSourcePath)) {
        const transpiled = ts.transpileModule(sourceText, {
          compilerOptions: {
            target: ts.ScriptTarget.ESNext,
            module: ts.ModuleKind.ESNext,
            experimentalDecorators: true,
            useDefineForClassFields: false,
          },
          fileName: path.basename(fullPath),
        });
        const jsTargetPath = path.join(distDir, relPath.slice(0, -3) + '.js');
        mkdirSync(path.dirname(jsTargetPath), { recursive: true });
        writeFileSync(jsTargetPath, rewriteInternalSpecifiers(transpiled.outputText));
      }

      if (!hasFile(dtsSourcePath) && shouldGenerateDeclarationStub(sourceText)) {
        const dtsTargetPath = path.join(distDir, relPath.slice(0, -3) + '.d.ts');
        mkdirSync(path.dirname(dtsTargetPath), { recursive: true });
        const dtsText = sourceText.endsWith('\n') ? sourceText : sourceText + '\n';
        writeFileSync(dtsTargetPath, rewriteInternalSpecifiers(dtsText));
      }
    }
  }
}

stageRuntimeFiles();

const exportsField = {
  './package.json': './package.json',
};

for (const [publicRoot, buildRoot] of Object.entries(rootMap)) {
  const absRoot = path.join(distDir, buildRoot);
  if (!hasFile(path.join(absRoot, 'index.js'))) {
    continue;
  }

  exportsField[`./${publicRoot}`] = {
    types: `./${toPosix(path.join(buildRoot, 'index.d.ts'))}`,
    default: `./${toPosix(path.join(buildRoot, 'index.js'))}`,
  };
  exportsField[`./${publicRoot}/*`] = {
    types: `./${toPosix(path.join(buildRoot, '*.d.ts'))}`,
    default: `./${toPosix(path.join(buildRoot, '*.js'))}`,
  };
}

const publishManifest = {
  name: sourceManifest.name,
  description: sourceManifest.description,
  version: sourceManifest.version,
  type: sourceManifest.type,
  sideEffects: sourceManifest.sideEffects,
  author: sourceManifest.author,
  license: sourceManifest.license,
  dependencies: resolveWorkspaceRanges(sourceManifest.dependencies),
  peerDependencies: resolveWorkspaceRanges(sourceManifest.peerDependencies),
  optionalDependencies: resolveWorkspaceRanges(sourceManifest.optionalDependencies),
  exports: Object.fromEntries(
    Object.entries(exportsField).sort((a, b) => a[0].localeCompare(b[0]))
  ),
};

for (const key of ['peerDependencies', 'optionalDependencies']) {
  if (!publishManifest[key] || Object.keys(publishManifest[key]).length === 0) {
    delete publishManifest[key];
  }
}

writeFileSync(
  path.join(distDir, 'package.json'),
  JSON.stringify(publishManifest, null, 2) + '\n'
);

console.log(`staged publish manifest for ${sourceManifest.name}`);
