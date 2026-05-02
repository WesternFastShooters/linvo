import { INLINE_ROOT_ATTR } from '../consts';
import type { InlineEditor, InlineRootElement } from '../inline-editor';

export function getInlineEditorInsideRoot(
  element: Element
): InlineEditor | null {
  const rootElement = element.closest(
    `[${INLINE_ROOT_ATTR}]`
  ) as InlineRootElement;
  if (!rootElement) {
    console.error('element must be inside a v-root');
    return null;
  }
  const inlineEditor = rootElement.inlineEditor;
  if (!inlineEditor) {
    console.error('element must be inside a v-root with inline-editor');
    return null;
  }
  return inlineEditor;
}
