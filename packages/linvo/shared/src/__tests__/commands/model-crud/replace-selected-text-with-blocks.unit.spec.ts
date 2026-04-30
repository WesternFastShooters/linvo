/**
 * @vitest-environment happy-dom
 */
import type { TextSelection } from '@linvo/std';
import { describe, expect, it } from 'vitest';

import { replaceSelectedTextWithBlocksCommand } from '../../../commands/model-crud/replace-selected-text-with-blocks';
import { linvo, block } from '../../../test-utils';

describe('commands/model-crud', () => {
  describe('replaceSelectedTextWithBlocksCommand', () => {
    it('should replace selected text with blocks when both first and last blocks are mergable blocks', () => {
      const host = linvo`
        <linvo-page id="page">
          <linvo-note id="note">
            <linvo-paragraph id="paragraph-1">Hel<anchor />lo</linvo-paragraph>
            <linvo-paragraph id="paragraph-2">Wor<focus />ld</linvo-paragraph>
          </linvo-note>
        </linvo-page>
      `;

      const blocks = [
        block`<linvo-paragraph id="111">111</linvo-paragraph>`,
        block`<linvo-code id="code"></linvo-code>`,
        block`<linvo-paragraph id="222">222</linvo-paragraph>`,
      ]
        .filter((b): b is NonNullable<typeof b> => b !== null)
        .map(b => b.model);

      const textSelection = host.selection.value[0] as TextSelection;

      host.command.exec(replaceSelectedTextWithBlocksCommand, {
        textSelection,
        blocks,
      });

      const expected = linvo`
        <linvo-page id="page">
          <linvo-note id="note">
            <linvo-paragraph id="paragraph-1">Hel111</linvo-paragraph>
            <linvo-code id="code"></linvo-code>
            <linvo-paragraph id="paragraph-2">222ld</linvo-paragraph>
          </linvo-note>
        </linvo-page>
      `;

      expect(host.store).toEqualDoc(expected.store);
    });

    it('should replace selected text with blocks when both first and last blocks are mergable blocks in single paragraph', () => {
      const host = linvo`
        <linvo-page id="page">
          <linvo-note id="note">
            <linvo-paragraph id="paragraph-1">Hel<anchor></anchor>lo Wor<focus></focus>ld</linvo-paragraph>
          </linvo-note>
        </linvo-page>
      `;

      const blocks = [
        block`<linvo-paragraph id="111">111</linvo-paragraph>`,
        block`<linvo-code id="code"></linvo-code>`,
        block`<linvo-paragraph id="222">222</linvo-paragraph>`,
      ]
        .filter((b): b is NonNullable<typeof b> => b !== null)
        .map(b => b.model);

      const textSelection = host.selection.value[0] as TextSelection;

      host.command.exec(replaceSelectedTextWithBlocksCommand, {
        textSelection,
        blocks,
      });

      const expected = linvo`
        <linvo-page id="page">
          <linvo-note id="note">
            <linvo-paragraph id="paragraph-1">Hel111</linvo-paragraph>
            <linvo-code id="code"></linvo-code>
            <linvo-paragraph id="222">222ld</linvo-paragraph>
          </linvo-note>
        </linvo-page>
      `;

      expect(host.store).toEqualDoc(expected.store);
    });

    it('should replace selected text with blocks when blocks contains only one mergable block', () => {
      const host = linvo`
        <linvo-page id="page">
          <linvo-note id="note">
            <linvo-paragraph id="paragraph-1">Hel<anchor />lo</linvo-paragraph>
            <linvo-paragraph id="paragraph-2">Wor<focus />ld</linvo-paragraph>
          </linvo-note>
        </linvo-page>
      `;

      const blocks = [block`<linvo-paragraph id="111">111</linvo-paragraph>`]
        .filter((b): b is NonNullable<typeof b> => b !== null)
        .map(b => b.model);

      const textSelection = host.selection.value[0] as TextSelection;

      host.command.exec(replaceSelectedTextWithBlocksCommand, {
        textSelection,
        blocks,
      });

      const expected = linvo`
        <linvo-page id="page">
          <linvo-note id="note">
            <linvo-paragraph id="paragraph-1">Hel111ld</linvo-paragraph>
          </linvo-note>
        </linvo-page>
      `;

      expect(host.store).toEqualDoc(expected.store);
    });

    it('should replace selected text with blocks when blocks contains only one mergable block in single paragraph', () => {
      const host = linvo`
        <linvo-page id="page">
          <linvo-note id="note">
            <linvo-paragraph id="paragraph-1">Hel<anchor></anchor>lo Wor<focus></focus>ld</linvo-paragraph>
          </linvo-note>
        </linvo-page>
      `;

      const blocks = [block`<linvo-paragraph id="111">111</linvo-paragraph>`]
        .filter((b): b is NonNullable<typeof b> => b !== null)
        .map(b => b.model);

      const textSelection = host.selection.value[0] as TextSelection;

      host.command.exec(replaceSelectedTextWithBlocksCommand, {
        textSelection,
        blocks,
      });

      const expected = linvo`
        <linvo-page id="page">
          <linvo-note id="note">
            <linvo-paragraph id="paragraph-1">Hel111ld</linvo-paragraph>
          </linvo-note>
        </linvo-page>
      `;

      expect(host.store).toEqualDoc(expected.store);
    });

    it('should replace selected text with blocks when only first block is mergable block', () => {
      const host = linvo`
        <linvo-page>
          <linvo-note>
            <linvo-paragraph>Hel<anchor />lo</linvo-paragraph>
            <linvo-paragraph>Wor<focus />ld</linvo-paragraph>
          </linvo-note>
        </linvo-page>
      `;

      const blocks = [
        block`<linvo-paragraph>111</linvo-paragraph>`,
        block`<linvo-code></linvo-code>`,
        block`<linvo-code></linvo-code>`,
      ]
        .filter((b): b is NonNullable<typeof b> => b !== null)
        .map(b => b.model);

      const textSelection = host.selection.value[0] as TextSelection;

      host.command.exec(replaceSelectedTextWithBlocksCommand, {
        textSelection,
        blocks,
      });

      const expected = linvo`
        <linvo-page>
          <linvo-note >
            <linvo-paragraph>Hel111</linvo-paragraph>
            <linvo-code></linvo-code>
            <linvo-code></linvo-code>
            <linvo-paragraph>ld</linvo-paragraph>
          </linvo-note>
        </linvo-page>
      `;

      expect(host.store).toEqualDoc(expected.store);
    });

    it('should replace selected text with blocks when only first block is mergable block in single paragraph', () => {
      const host = linvo`
        <linvo-page>
          <linvo-note>
            <linvo-paragraph>Hel<anchor></anchor>lo Wor<focus></focus>ld</linvo-paragraph>
          </linvo-note>
        </linvo-page>
      `;

      const blocks = [
        block`<linvo-paragraph>111</linvo-paragraph>`,
        block`<linvo-code></linvo-code>`,
        block`<linvo-code></linvo-code>`,
      ]
        .filter((b): b is NonNullable<typeof b> => b !== null)
        .map(b => b.model);

      const textSelection = host.selection.value[0] as TextSelection;

      host.command.exec(replaceSelectedTextWithBlocksCommand, {
        textSelection,
        blocks,
      });

      const expected = linvo`
        <linvo-page>
          <linvo-note>
            <linvo-paragraph>Hel111</linvo-paragraph>
            <linvo-code></linvo-code>
            <linvo-code></linvo-code>
            <linvo-paragraph>ld</linvo-paragraph>
          </linvo-note>
        </linvo-page>
      `;

      expect(host.store).toEqualDoc(expected.store);
    });

    it('should replace selected text with blocks when only last block is mergable block', () => {
      const host = linvo`
        <linvo-page>
          <linvo-note>
            <linvo-paragraph>Hel<anchor />lo</linvo-paragraph>
            <linvo-paragraph>Wor<focus />ld</linvo-paragraph>
          </linvo-note>
        </linvo-page>
      `;

      const blocks = [
        block`<linvo-code></linvo-code>`,
        block`<linvo-code></linvo-code>`,
        block`<linvo-paragraph>111</linvo-paragraph>`,
      ]
        .filter((b): b is NonNullable<typeof b> => b !== null)
        .map(b => b.model);

      const textSelection = host.selection.value[0] as TextSelection;

      host.command.exec(replaceSelectedTextWithBlocksCommand, {
        textSelection,
        blocks,
      });

      const expected = linvo`
        <linvo-page>
          <linvo-note >
            <linvo-paragraph>Hel</linvo-paragraph>
            <linvo-code></linvo-code>
            <linvo-code></linvo-code>
            <linvo-paragraph>111ld</linvo-paragraph>
          </linvo-note>
        </linvo-page>
      `;
      expect(host.store).toEqualDoc(expected.store);
    });

    it('should replace selected text with blocks when only last block is mergable block in single paragraph', () => {
      const host = linvo`
        <linvo-page>
          <linvo-note>
            <linvo-paragraph>Hel<anchor></anchor>lo Wor<focus></focus>ld</linvo-paragraph>
          </linvo-note>
        </linvo-page>
      `;

      const blocks = [
        block`<linvo-code></linvo-code>`,
        block`<linvo-code></linvo-code>`,
        block`<linvo-paragraph>111</linvo-paragraph>`,
      ]
        .filter((b): b is NonNullable<typeof b> => b !== null)
        .map(b => b.model);

      const textSelection = host.selection.value[0] as TextSelection;

      host.command.exec(replaceSelectedTextWithBlocksCommand, {
        textSelection,
        blocks,
      });

      const expected = linvo`
        <linvo-page>
          <linvo-note>
            <linvo-paragraph>Hel</linvo-paragraph>
            <linvo-code></linvo-code>
            <linvo-code></linvo-code>
            <linvo-paragraph>111ld</linvo-paragraph>
          </linvo-note>
        </linvo-page>
      `;
      expect(host.store).toEqualDoc(expected.store);
    });

    it('should replace selected text with blocks when neither first nor last block is mergable block', () => {
      const host = linvo`
        <linvo-page>
          <linvo-note>
            <linvo-paragraph>Hel<anchor />lo</linvo-paragraph>
            <linvo-paragraph>Wor<focus />ld</linvo-paragraph>
          </linvo-note>
        </linvo-page>
      `;

      const blocks = [
        block`<linvo-code></linvo-code>`,
        block`<linvo-code></linvo-code>`,
      ]
        .filter((b): b is NonNullable<typeof b> => b !== null)
        .map(b => b.model);

      const textSelection = host.selection.value[0] as TextSelection;

      host.command.exec(replaceSelectedTextWithBlocksCommand, {
        textSelection,
        blocks,
      });

      const expected = linvo`
        <linvo-page>
          <linvo-note >
            <linvo-paragraph>Hel</linvo-paragraph>
            <linvo-code></linvo-code>
            <linvo-code></linvo-code>
            <linvo-paragraph>ld</linvo-paragraph>
          </linvo-note>
        </linvo-page>
      `;
      expect(host.store).toEqualDoc(expected.store);
    });

    it('should replace selected text with blocks when neither first nor last block is mergable block in single paragraph', () => {
      const host = linvo`
        <linvo-page>
          <linvo-note>
            <linvo-paragraph>Hel<anchor></anchor>lo Wor<focus></focus>ld</linvo-paragraph>
          </linvo-note>
        </linvo-page>
      `;

      const blocks = [
        block`<linvo-code></linvo-code>`,
        block`<linvo-code></linvo-code>`,
      ]
        .filter((b): b is NonNullable<typeof b> => b !== null)
        .map(b => b.model);

      const textSelection = host.selection.value[0] as TextSelection;

      host.command.exec(replaceSelectedTextWithBlocksCommand, {
        textSelection,
        blocks,
      });

      const expected = linvo`
        <linvo-page>
          <linvo-note>
            <linvo-paragraph>Hel</linvo-paragraph>
            <linvo-code></linvo-code>
            <linvo-code></linvo-code>
            <linvo-paragraph>ld</linvo-paragraph>
          </linvo-note>
        </linvo-page>
      `;
      expect(host.store).toEqualDoc(expected.store);
    });

    it('should replace selected text with blocks when both first and last blocks are mergable blocks with different types', () => {
      const host = linvo`
        <linvo-page>
          <linvo-note>
            <linvo-paragraph>Hel<anchor />lo</linvo-paragraph>
            <linvo-paragraph>Wor<focus />ld</linvo-paragraph>
          </linvo-note>
        </linvo-page>
      `;

      const blocks = [
        block`<linvo-list>1.</linvo-list>`,
        block`<linvo-list>2.</linvo-list>`,
      ]
        .filter((b): b is NonNullable<typeof b> => b !== null)
        .map(b => b.model);

      const textSelection = host.selection.value[0] as TextSelection;

      host.command.exec(replaceSelectedTextWithBlocksCommand, {
        textSelection,
        blocks,
      });

      const expected = linvo`
        <linvo-page>
          <linvo-note >
            <linvo-paragraph>Hel</linvo-paragraph>
            <linvo-list>1.</linvo-list>
            <linvo-list>2.</linvo-list>
            <linvo-paragraph>ld</linvo-paragraph>
          </linvo-note>
        </linvo-page>
      `;
      expect(host.store).toEqualDoc(expected.store);
    });

    it('should replace selected text with blocks when both first and last blocks are paragraphs, and cursor is at the end of the text-block with different types', () => {
      const host = linvo`
        <linvo-page>
          <linvo-note>
            <linvo-list>Hel<anchor />lo</linvo-list>
            <linvo-list>Wor<focus />ld</linvo-list>
          </linvo-note>
        </linvo-page>
      `;

      const blocks = [
        block`<linvo-paragraph>111</linvo-paragraph>`,
        block`<linvo-paragraph>222</linvo-paragraph>`,
      ]
        .filter((b): b is NonNullable<typeof b> => b !== null)
        .map(b => b.model);

      const textSelection = host.selection.value[0] as TextSelection;

      host.command.exec(replaceSelectedTextWithBlocksCommand, {
        textSelection,
        blocks,
      });

      const expected = linvo`
        <linvo-page>
          <linvo-note >
            <linvo-list>Hel111</linvo-list>
            <linvo-list>222ld</linvo-list>
          </linvo-note>
        </linvo-page>
      `;
      expect(host.store).toEqualDoc(expected.store);
    });

    it('should replace selected text with blocks when first block is paragraph, and cursor is at the end of the text-block with different type  ', () => {
      const host = linvo`
        <linvo-page>
          <linvo-note>
            <linvo-list>Hel<anchor />lo</linvo-list>
            <linvo-list>Wor<focus />ld</linvo-list>
          </linvo-note>
        </linvo-page>
      `;

      const blocks = [
        block`<linvo-paragraph>111</linvo-paragraph>`,
        block`<linvo-code></linvo-code>`,
      ]
        .filter((b): b is NonNullable<typeof b> => b !== null)
        .map(b => b.model);

      const textSelection = host.selection.value[0] as TextSelection;

      host.command.exec(replaceSelectedTextWithBlocksCommand, {
        textSelection,
        blocks,
      });

      const expected = linvo`
        <linvo-page>
          <linvo-note >
            <linvo-list>Hel111</linvo-list>
            <linvo-code></linvo-code>
            <linvo-list>ld</linvo-list>
          </linvo-note>
        </linvo-page>
      `;
      expect(host.store).toEqualDoc(expected.store);
    });

    it('should replace selected text with blocks when last block is paragraph, and cursor is at the end of the text-block with different type  ', () => {
      const host = linvo`
        <linvo-page>
          <linvo-note>
            <linvo-list>Hel<anchor />lo</linvo-list>
            <linvo-list>Wor<focus />ld</linvo-list>
          </linvo-note>
        </linvo-page>
      `;

      const blocks = [
        block`<linvo-code></linvo-code>`,
        block`<linvo-paragraph>222</linvo-paragraph>`,
      ]
        .filter((b): b is NonNullable<typeof b> => b !== null)
        .map(b => b.model);

      const textSelection = host.selection.value[0] as TextSelection;

      host.command.exec(replaceSelectedTextWithBlocksCommand, {
        textSelection,
        blocks,
      });

      const expected = linvo`
        <linvo-page>
          <linvo-note >
            <linvo-list>Hel</linvo-list>
            <linvo-code></linvo-code>
            <linvo-list>222ld</linvo-list>
          </linvo-note>
        </linvo-page>
      `;
      expect(host.store).toEqualDoc(expected.store);
    });
  });
});
