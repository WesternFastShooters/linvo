import type { EditableTextLike } from '@linvo-core/store/reactive/text';
import { PlainTextEditor } from './plain-text-editor';
import { SURFACE_TEXT_UNIQ_IDENTIFIER } from '@linvo-core/std/gfx';

export type SurfaceTextDelta = {
  attributes?: Record<string, unknown>;
  insert: string;
};

export type SurfaceTextLike = {
  length: number;
  toDelta(): SurfaceTextDelta[];
  toString(): string;
};

type ObservableSurfaceTextLike = SurfaceTextLike & {
  delete?(index: number, length: number): void;
  insert?(index: number, text: string): void;
  observe?(listener: (...args: unknown[]) => void): (() => void) | void;
  set?(text: string, local?: boolean): void;
  unobserve?(listener: (...args: unknown[]) => void): void;
};

export type SurfaceTextSnapshot = {
  [SURFACE_TEXT_UNIQ_IDENTIFIER]: true;
  delta: SurfaceTextDelta[];
};

const surfaceTextBindingCache = new WeakMap<object, EditableTextLike>();

function normalizeText(text: string) {
  return text.replaceAll('\r\n', '\n');
}

export function bindSurfaceText(
  text: ObservableSurfaceTextLike | null | undefined
): EditableTextLike | null {
  if (!text || typeof text !== 'object') {
    return null;
  }

  const cached = surfaceTextBindingCache.get(text as object);
  if (cached) {
    return cached;
  }

  const binding: EditableTextLike = {
    get length() {
      return text.length;
    },
    observe(listener: (event: { local: boolean; text: string }) => void) {
      if (typeof text.observe !== 'function') {
        return;
      }

      const observer = () => {
        listener({
          local: true,
          text: text.toString(),
        });
      };
      const maybeDispose = text.observe(observer);

      if (typeof maybeDispose === 'function') {
        return maybeDispose;
      }

      if (typeof text.unobserve === 'function') {
        return () => {
          text.unobserve?.(observer);
        };
      }
    },
    set(nextText: string, local = true) {
      const normalized = normalizeText(nextText);

      if (typeof text.set === 'function') {
        text.set(normalized, local);
        return;
      }

      if (text.toString() === normalized) {
        return;
      }

      if (typeof text.delete !== 'function' || typeof text.insert !== 'function') {
        throw new Error('Surface text is not editable.');
      }

      if (text.length > 0) {
        text.delete(0, text.length);
      }
      if (normalized.length > 0) {
        text.insert(0, normalized);
      }
    },
    toString() {
      return text.toString();
    },
  };

  surfaceTextBindingCache.set(text as object, binding);

  return binding;
}

export function createSurfaceText(text = ''): SurfaceTextSnapshot {
  const normalized = normalizeText(text);

  return {
    [SURFACE_TEXT_UNIQ_IDENTIFIER]: true,
    delta: normalized.length > 0 ? [{ insert: normalized }] : [],
  };
}

export { PlainTextEditor };
