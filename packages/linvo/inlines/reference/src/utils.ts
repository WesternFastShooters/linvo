import { REFERENCE_NODE } from '@linvo/linvo-shared/consts';
import type { LinvoInlineEditor } from '@linvo/linvo-shared/types';

export function insertLinkedNode({
  inlineEditor,
  docId,
}: {
  inlineEditor: LinvoInlineEditor;
  docId: string;
}) {
  if (!inlineEditor) return;
  const inlineRange = inlineEditor.getInlineRange();
  if (!inlineRange) return;
  inlineEditor.insertText(inlineRange, REFERENCE_NODE, {
    reference: { type: 'LinkedPage', pageId: docId },
  });
  inlineEditor.setInlineRange({
    index: inlineRange.index + 1,
    length: 0,
  });
}
