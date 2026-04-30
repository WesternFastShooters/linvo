import { focusTextModel } from '@linvo/linvo-rich-text';
import { getLastNoteBlock } from '@linvo/linvo-shared/utils';
import type { Command } from '@linvo/std';
import { Text } from '@linvo/store';

/**
 * Append a paragraph block at the end of the whole page.
 */
export const appendParagraphCommand: Command<{ text?: string }> = (
  ctx,
  next
) => {
  const { std, text = '' } = ctx;
  const { store } = std;
  if (!store.root) return;

  const note = getLastNoteBlock(store);
  let noteId = note?.id;
  if (!noteId) {
    noteId = store.addBlock('linvo:note', {}, store.root.id);
  }
  const id = store.addBlock(
    'linvo:paragraph',
    { text: new Text(text) },
    noteId
  );

  focusTextModel(std, id, text.length);
  next();
};
