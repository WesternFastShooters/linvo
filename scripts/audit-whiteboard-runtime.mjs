import { execSync } from 'node:child_process';

const roots = [
  'app',
  'packages/blocks/root/src/edgeless',
  'packages/gfx/note',
  'packages/widgets/edgeless-selected-rect',
];

const bannedPatterns = [
  'linvo:paragraph',
  'linvo:list',
  'linvo:code',
  'linvo:divider',
  'LatexStoreExtension',
  'LatexViewExtension',
  'FootnoteStoreExtension',
  'FootnoteViewExtension',
  'InlinePresetStoreExtension',
  'InlinePresetViewExtension',
  'ReferenceStoreExtension',
  'ReferenceViewExtension',
  'LinkStoreExtension',
  'LinkViewExtension',
  'KeyboardToolbarViewExtension',
  'SlashMenuViewExtension',
];

let hasMatch = false;

for (const pattern of bannedPatterns) {
  try {
    const output = execSync(
      `rg -n --fixed-strings ${JSON.stringify(pattern)} ${roots.join(
        ' '
      )} -g '!**/dist/**'`,
      {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }
    ).trim();

    if (!output) {
      continue;
    }

    hasMatch = true;
    console.log(`\n## ${pattern}\n${output}`);
  } catch {
    // No matches.
  }
}

if (hasMatch) {
  process.exitCode = 1;
} else {
  console.log('Whiteboard runtime audit passed.');
}
