import * as Y from '../compat';

import type { ProxyOptions } from './types';

export abstract class BaseReactiveYData<
  T,
  YSource extends Y.AbstractType,
> {
  protected _getOrigin = (
    doc: Y.Doc
  ): {
    doc: Y.Doc;
    proxy: true;

    target: BaseReactiveYData<any, any>;
  } => {
    return {
      doc,
      proxy: true,
      target: this,
    };
  };

  protected _onObserve = (event: Y.YEvent<any>, handler: () => void) => {
    const origin = (event.transaction.origin ?? null) as
      | { force?: boolean; proxy?: boolean }
      | null;
    if (
      origin?.force === true ||
      (origin?.proxy !== true && !event.transaction.local)
    ) {
      handler();
    }

    const isLocal =
      !event.transaction.origin ||
      !this._ySource.doc ||
      origin?.proxy
        ? true
        : event.transaction.origin === this._ySource.doc.clientID;

    this._options?.onChange?.(this._proxy, isLocal);
  };

  protected abstract readonly _options?: ProxyOptions<T>;

  protected abstract readonly _proxy: T;

  protected _skipNext = false;

  protected abstract readonly _source: T;

  protected readonly _stashed = new Set<string | number>();

  protected _transact = (doc: Y.Doc, fn: () => void) => {
    doc.transact(fn, this._getOrigin(doc));
  };

  protected _updateWithSkip = (fn: () => void) => {
    if (this._skipNext) {
      return;
    }
    this._skipNext = true;
    fn();
    this._skipNext = false;
  };

  protected abstract readonly _ySource: YSource;

  get proxy() {
    return this._proxy;
  }

  abstract pop(prop: string | number): void;
  abstract stash(prop: string | number): void;
}
