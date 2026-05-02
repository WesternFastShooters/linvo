import type {
  PlainTextDelta,
  PlainTextLike,
  PlainTextSnapshot,
  LocalTextChangeEvent,
} from './types';

type PlainTextListener = (event: LocalTextChangeEvent) => void;

export class PlainText implements PlainTextLike {
  static from(
    input:
      | PlainText
      | PlainTextDelta[]
      | PlainTextSnapshot
      | string
      | undefined = ''
  ) {
    if (input instanceof PlainText) {
      return input.clone();
    }

    if (typeof input === 'string') {
      return new PlainText(input);
    }

    if (Array.isArray(input)) {
      return new PlainText(input.map(item => item.insert).join(''));
    }

    if (input?.type === 'plain-text') {
      return new PlainText(input.text);
    }

    return new PlainText('');
  }

  private readonly _listeners = new Set<PlainTextListener>();

  private _text: string;

  constructor(text: string = '') {
    this._text = PlainText.normalize(text);
  }

  private static normalize(text: string) {
    return text.replaceAll('\r\n', '\n');
  }

  private _emit(local: boolean) {
    const event = {
      local,
      text: this._text,
    } satisfies LocalTextChangeEvent;

    this._listeners.forEach(listener => {
      listener(event);
    });
  }

  get length() {
    return this._text.length;
  }

  observe(listener: PlainTextListener) {
    this._listeners.add(listener);
    return () => {
      this._listeners.delete(listener);
    };
  }

  clear(local = true) {
    if (this._text.length === 0) {
      return;
    }

    this._text = '';
    this._emit(local);
  }

  clone() {
    return new PlainText(this._text);
  }

  delete(index: number, length: number, local = true) {
    if (length <= 0) {
      return;
    }

    this._assertRange(index, length);
    this._text = this._text.slice(0, index) + this._text.slice(index + length);
    this._emit(local);
  }

  insert(index: number, text: string, local = true) {
    this._assertRange(index, 0);
    const normalized = PlainText.normalize(text);
    if (normalized.length === 0) {
      return;
    }

    this._text =
      this._text.slice(0, index) + normalized + this._text.slice(index);
    this._emit(local);
  }

  replace(index: number, length: number, text: string, local = true) {
    this._assertRange(index, length);
    const normalized = PlainText.normalize(text);
    this._text =
      this._text.slice(0, index) +
      normalized +
      this._text.slice(index + length);
    this._emit(local);
  }

  set(text: string, local = true) {
    const normalized = PlainText.normalize(text);
    if (normalized === this._text) {
      return;
    }

    this._text = normalized;
    this._emit(local);
  }

  toDelta(): PlainTextDelta[] {
    if (this._text.length === 0) {
      return [];
    }

    return [{ insert: this._text }];
  }

  toJSON(): PlainTextSnapshot {
    return {
      text: this._text,
      type: 'plain-text',
    };
  }

  toString() {
    return this._text;
  }

  private _assertRange(index: number, length: number) {
    if (index < 0 || length < 0 || index + length > this._text.length) {
      throw new RangeError(
        `PlainText range out of bounds: index=${index}, length=${length}, textLength=${this._text.length}`
      );
    }
  }
}
