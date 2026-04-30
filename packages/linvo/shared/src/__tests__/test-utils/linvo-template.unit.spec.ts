import { TextSelection } from '@linvo/std';
import { describe, expect, it } from 'vitest';

import { linvo } from '../../test-utils';

describe('helpers/linvo-template', () => {
  it('should create a basic document structure from template', () => {
    const host = linvo`
      <linvo-page id="page">
        <linvo-note id="note">
          <linvo-paragraph id="paragraph-1">Hello, world</linvo-paragraph>
        </linvo-note>
      </linvo-page>
    `;

    expect(host.store).toBeDefined();

    const pageBlock = host.store.getBlock('page');
    expect(pageBlock).toBeDefined();
    expect(pageBlock?.flavour).toBe('linvo:page');

    const noteBlock = host.store.getBlock('note');
    expect(noteBlock).toBeDefined();
    expect(noteBlock?.flavour).toBe('linvo:note');

    const paragraphBlock = host.store.getBlock('paragraph-1');
    expect(paragraphBlock).toBeDefined();
    expect(paragraphBlock?.flavour).toBe('linvo:paragraph');
  });

  it('should handle nested blocks correctly', () => {
    const host = linvo`
      <linvo-page>
        <linvo-note>
          <linvo-paragraph>First paragraph</linvo-paragraph>
          <linvo-list>List item</linvo-list>
          <linvo-paragraph>Second paragraph</linvo-paragraph>
        </linvo-note>
      </linvo-page>
    `;

    const noteBlocks = host.store.getBlocksByFlavour('linvo:note');
    const paragraphBlocks = host.store.getBlocksByFlavour('linvo:paragraph');
    const listBlocks = host.store.getBlocksByFlavour('linvo:list');

    expect(noteBlocks.length).toBe(1);
    expect(paragraphBlocks.length).toBe(2);
    expect(listBlocks.length).toBe(1);

    const noteBlock = noteBlocks[0];
    const noteChildren =
      host.store.getBlock(noteBlock.id)?.model.children || [];
    expect(noteChildren.length).toBe(3);

    expect(noteChildren[0].flavour).toBe('linvo:paragraph');
    expect(noteChildren[1].flavour).toBe('linvo:list');
    expect(noteChildren[2].flavour).toBe('linvo:paragraph');
  });

  it('should handle empty blocks correctly', () => {
    const host = linvo`
      <linvo-page>
        <linvo-note>
          <linvo-paragraph></linvo-paragraph>
        </linvo-note>
      </linvo-page>
    `;

    const paragraphBlocks = host.store.getBlocksByFlavour('linvo:paragraph');
    expect(paragraphBlocks.length).toBe(1);

    const paragraphBlock = host.store.getBlock(paragraphBlocks[0].id);
    const paragraphText = paragraphBlock?.model.text?.toString() || '';
    expect(paragraphText).toBe('');
  });

  it('should throw error on invalid template', () => {
    expect(() => {
      linvo`
        <unknown-tag></unknown-tag>
      `;
    }).toThrow();
  });

  it('should handle text selection with anchor and focus', () => {
    const host = linvo`
      <linvo-page id="page">
        <linvo-note id="note">
          <linvo-paragraph id="paragraph-1">Hel<anchor />lo</linvo-paragraph>
          <linvo-paragraph id="paragraph-2">Wo<focus />rld</linvo-paragraph>
        </linvo-note>
      </linvo-page>
    `;

    const selection = host.selection.value[0] as TextSelection;
    expect(selection).toBeDefined();
    expect(selection.is(TextSelection)).toBe(true);
    expect(selection.from.blockId).toBe('paragraph-1');
    expect(selection.from.index).toBe(3);
    expect(selection.from.length).toBe(2);
    expect(selection.to?.blockId).toBe('paragraph-2');
    expect(selection.to?.index).toBe(0);
    expect(selection.to?.length).toBe(2);
  });

  it('should handle cursor position', () => {
    const host = linvo`
      <linvo-page id="page">
        <linvo-note id="note">
          <linvo-paragraph id="paragraph-1">Hello<cursor />World</linvo-paragraph>
        </linvo-note>
      </linvo-page>
    `;

    const selection = host.selection.value[0] as TextSelection;
    expect(selection).toBeDefined();
    expect(selection.is(TextSelection)).toBe(true);
    expect(selection.from.blockId).toBe('paragraph-1');
    expect(selection.from.index).toBe(5);
    expect(selection.from.length).toBe(0);
    expect(selection.to).toBeNull();
  });

  it('should handle selection in empty blocks', () => {
    const host = linvo`
      <linvo-page id="page">
        <linvo-note id="note">
          <linvo-paragraph id="paragraph-1"><cursor /></linvo-paragraph>
        </linvo-note>
      </linvo-page>
    `;

    const selection = host.selection.value[0] as TextSelection;
    expect(selection).toBeDefined();
    expect(selection.is(TextSelection)).toBe(true);
    expect(selection.from.blockId).toBe('paragraph-1');
    expect(selection.from.index).toBe(0);
    expect(selection.from.length).toBe(0);
    expect(selection.to).toBeNull();
  });

  it('should handle single point selection', () => {
    const host = linvo`
      <linvo-page id="page">
        <linvo-note id="note">
          <linvo-paragraph id="paragraph-1">Hello<anchor></anchor>World<focus></focus>Linvo</linvo-paragraph>
        </linvo-note>
      </linvo-page>
    `;

    const selection = host.selection.value[0] as TextSelection;
    expect(selection).toBeDefined();
    expect(selection.is(TextSelection)).toBe(true);
    expect(selection.from.blockId).toBe('paragraph-1');
    expect(selection.from.index).toBe(5);
    expect(selection.from.length).toBe(5);
    expect(selection.to).toBeNull();
  });
});
