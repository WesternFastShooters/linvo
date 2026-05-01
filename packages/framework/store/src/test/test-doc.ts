import * as Y from 'yjs';

import type { Doc, GetStoreOptions, Workspace } from '../extension/index.js';
import type { YBlock } from '../model/block/types.js';
import { StoreContainer } from '../model/index.js';
import type { AwarenessStore } from '../yjs/index.js';
import type { TestWorkspace } from './test-workspace.js';

type DocOptions = {
  id: string;
  collection: Workspace;
  doc: Y.Doc;
  awarenessStore: AwarenessStore;
};

export class TestDoc implements Doc {
  private readonly _collection: Workspace;

  private readonly _storeContainer: StoreContainer;

  private _loaded = true;

  /** Indicate whether the block tree is ready */
  private _ready = false;

  protected readonly _yBlocks: Y.Map<YBlock>;

  readonly awarenessStore: AwarenessStore;

  readonly id: string;

  readonly yDoc: Y.Doc;

  get blobSync() {
    return this.workspace.blobSync;
  }

  get workspace() {
    return this._collection;
  }

  get isEmpty() {
    return this._yBlocks.size === 0;
  }

  get loaded() {
    return this._loaded;
  }

  get meta() {
    return this.workspace.meta.getDocMeta(this.id);
  }

  get ready() {
    return this._ready;
  }

  get yBlocks() {
    return this._yBlocks;
  }

  constructor({ id, collection, doc, awarenessStore }: DocOptions) {
    this.id = id;
    this.yDoc = doc;
    this.awarenessStore = awarenessStore;
    this._collection = collection;
    this._yBlocks = this.yDoc.getMap('blocks');
    this._storeContainer = new StoreContainer(this);
  }

  clear() {
    this._yBlocks.clear();
  }

  get removeStore() {
    return this._storeContainer.removeStore;
  }

  dispose() {
    if (this.ready) {
      this._yBlocks.clear();
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
      this.workspace as TestWorkspace
    ).storeExtensions.concat(extensions ?? []);

    let storeId: string | undefined;

    if (id) {
      storeId = id;
    } else if (readonly !== undefined || query) {
      storeId = id;
    } else {
      storeId = this.yDoc.guid;
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
