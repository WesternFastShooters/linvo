import type { EditableTextLike } from '@linvo-core/store/reactive/text';
import { type BlockModel, Text } from '@linvo-core/store';

import type { BlockStdScope } from '../scope';
import type { InlineEditor } from './inline-editor';
import type { InlineRange } from './types';

type InlineHost = HTMLElement & {
  inlineEditor?: InlineEditor;
};

const textBindingCache = new WeakMap<Text, EditableTextLike>();

function normalizeText(text: string) {
  return text.replaceAll('\r\n', '\n');
}

function getCurrentNativeRange(selection = window.getSelection()) {
  if (!selection || selection.rangeCount === 0) {
    return null;
  }

  return selection.getRangeAt(0);
}

function getInlineHost(
  std: BlockStdScope,
  model: BlockModel | string
): InlineHost | null {
  const blockId = typeof model === 'string' ? model : model.id;
  const blockComponent = std.view.getBlock(blockId);
  if (!blockComponent) {
    return null;
  }

  return blockComponent.querySelector<InlineHost>('rich-text');
}

export function getInlineEditorByModel(
  std: BlockStdScope,
  model: BlockModel | string
) {
  return getInlineHost(std, model)?.inlineEditor ?? null;
}

export function bindTextModel(text: Text | null | undefined) {
  if (!text) {
    return null;
  }

  const cached = textBindingCache.get(text);
  if (cached) {
    return cached;
  }

  const binding: EditableTextLike = {
    get length() {
      return text.length;
    },
    observe(listener) {
      const observer = (event: { isLocal: boolean }) => {
        listener({
          local: event.isLocal,
          text: text.toString(),
        });
      };

      text.observe(observer);

      return () => {
        text.unobserve(observer);
      };
    },
    set(nextText: string) {
      const normalized = normalizeText(nextText);
      if (text.toString() === normalized) {
        return;
      }

      text.replace(0, text.length, normalized);
    },
    toString() {
      return text.toString();
    },
  };

  textBindingCache.set(text, binding);

  return binding;
}

export function insertContent(
  std: BlockStdScope,
  model: BlockModel,
  text: string,
  attributes?: Record<string, unknown>
) {
  if (!model.text) {
    console.error("Can't insert text! Text not found");
    return;
  }

  const inlineEditor = getInlineEditorByModel(std, model);
  if (!inlineEditor) {
    console.error("Can't insert text! Inline editor not found");
    return;
  }

  const inlineRange = inlineEditor.getInlineRange();
  const index = inlineRange ? inlineRange.index : model.text.length;
  model.text.insert(text, index, attributes);
  inlineEditor.setInlineRange({
    index: index + text.length,
    length: 0,
  });
}

export function cleanSpecifiedTail(
  std: BlockStdScope,
  inlineEditorOrModel: InlineEditor | BlockModel,
  text: string
) {
  if (!text) {
    console.warn('Failed to clean text! Unexpected empty string');
    return;
  }

  const inlineEditor =
    'yText' in inlineEditorOrModel
      ? inlineEditorOrModel
      : getInlineEditorByModel(std, inlineEditorOrModel);
  if (!inlineEditor) {
    return;
  }

  const inlineRange = inlineEditor.getInlineRange();
  if (!inlineRange) {
    return;
  }

  const index = inlineRange.index - text.length;
  const actualText = inlineEditor.yText.toString().slice(
    index,
    index + text.length
  );
  if (actualText !== text) {
    console.warn(
      `Failed to clean text! Text mismatch expected: ${text} but actual: ${actualText}`
    );
    return;
  }

  inlineEditor.deleteText({ index, length: text.length });
  inlineEditor.setInlineRange({ index, length: 0 });
}

export function getTextContentFromInlineRange(
  inlineEditor: InlineEditor,
  startRange: InlineRange | null
) {
  const nativeRange = getCurrentNativeRange();
  if (!nativeRange) {
    return null;
  }
  if (nativeRange.startContainer !== nativeRange.endContainer) {
    return null;
  }

  const currentRange = inlineEditor.getInlineRange();
  if (!startRange || !currentRange) {
    return null;
  }
  if (currentRange.index < startRange.index) {
    return null;
  }

  const text = inlineEditor.yText.toString();
  return text.slice(startRange.index, currentRange.index);
}
