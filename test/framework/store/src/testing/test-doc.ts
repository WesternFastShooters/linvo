import type { AbstractDocSource, Doc, GetStoreOptions } from '@linvo-core/store';
import { StoreContainer, type BlockRecord } from '@linvo-core/store';
import * as Y from '@linvo-core/store/compat';

import type { TestDocSource } from './test-doc-source';

type DocOptions = {
  id: string;
  source: AbstractDocSource;
  doc: Y.Doc;
};

export class TestDoc implements Doc {
  private readonly _source: AbstractDocSource;

  private readonly _storeContainer: StoreContainer;

  private _loaded = true;

  private _ready = false;

  protected readonly _blockMap: Y.Map<BlockRecord>;

  readonly id: string;

  readonly docState: Y.Doc;

  get blobSync() {
    return this.docSource.blobSync;
  }

  get docSource() {
    return this._source;
  }

  get isEmpty() {
    return this._blockMap.size === 0;
  }

  get loaded() {
    return this._loaded;
  }

  get meta() {
    return this.docSource.meta.getDocMeta(this.id);
  }

  get ready() {
    return this._ready;
  }

  get blockMap() {
    return this._blockMap;
  }

  constructor({ id, source, doc }: DocOptions) {
    this.id = id;
    this.docState = doc;
    this._source = source;
    this._blockMap = this.docState.getMap('blocks');
    this._storeContainer = new StoreContainer(this);
  }

  clear() {
    this._blockMap.clear();
  }

  get removeStore() {
    return this._storeContainer.removeStore;
  }

  dispose() {
    if (this.ready) {
      this._blockMap.clear();
    }
  }

  getStore({
    readonly,
    query,
    provider,
    extensions,
    id,
  }: GetStoreOptions = {}) {
    const storeExtensions = (
      this.docSource as TestDocSource
    ).storeExtensions.concat(extensions ?? []);

    let storeId: string | undefined;

    if (id) {
      storeId = id;
    } else if (readonly !== undefined || query) {
      storeId = id;
    } else {
      storeId = this.docState.guid;
    }

    return this._storeContainer.getStore({
      id: storeId,
      readonly,
      query,
      provider,
      extensions: storeExtensions,
    });
  }

  load(initFn?: () => void): this {
    if (this.ready) {
      return this;
    }

    initFn?.();

    this._ready = true;

    return this;
  }

  remove() {
    this.clear();
    this._loaded = false;
  }
}
