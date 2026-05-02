import { LinvoError, ErrorCode } from '@linvo-core/global/exceptions';
import { Subject } from 'rxjs';
import * as Y from './compat';

import { MemoryBlobCRUD } from './adapter/assets';
import type {
  AbstractDocSource,
  BlobSync,
  Doc,
  DocMeta,
  DocsPropertiesMeta,
  ExtensionType,
  GetStoreOptions,
  DocSourceMeta,
} from './extension';
import { StoreContainer } from './document';
import type { BlockRecord } from './document/block/types';
import { createYProxy } from './reactive/proxy';
import { type IdGenerator, nanoid } from './utils/id-generator';

type DocSourceMetaState = {
  doc?: DocMeta;
  properties?: DocsPropertiesMeta;
  name?: string;
  avatar?: string;
};

export type DocSourceOptions = {
  id?: string;
  idGenerator?: IdGenerator;
};

type DocRecordOptions = {
  doc: Y.Doc;
  id: string;
  source: DocSource;
};

class SourceMeta implements DocSourceMeta {
  private readonly _handleMetaEvents = (events: Y.YEvent<Y.AbstractType>[]) => {
    events.forEach(eventEntry => {
      const event = eventEntry as Y.YMapEvent<unknown>;
      const hasKey = (key: string) =>
        eventEntry.target === this._yMap && event.changes.keys.has(key);

      if (hasKey('doc')) {
        this._handleDocMetaEvent();
      }
    });
  };

  private _previousDocId: string | null = null;

  protected readonly _proxy: DocSourceMetaState;

  protected readonly _yMap: Y.Map<
    DocSourceMetaState[keyof DocSourceMetaState]
  >;

  readonly doc: Y.Doc;

  docMetaAdded = new Subject<string>();

  docMetaRemoved = new Subject<string>();

  docMetaUpdated = new Subject<void>();

  readonly id = 'meta';

  get docMetas() {
    return this._proxy.doc ? [this._proxy.doc] : [];
  }

  get properties(): DocsPropertiesMeta {
    const meta = this._proxy.properties;
    if (!meta) {
      return {
        tags: {
          options: [],
        },
      };
    }
    return meta;
  }

  constructor(doc: Y.Doc) {
    this.doc = doc;
    const map = doc.getMap(this.id) as Y.Map<
      DocSourceMetaState[keyof DocSourceMetaState]
    >;
    this._yMap = map;
    this._proxy = createYProxy(map);
    this._yMap.observeDeep(this._handleMetaEvents);
  }

  addDocMeta(doc: DocMeta) {
    this.doc.transact(() => {
      const existing = this._proxy.doc;
      if (existing && existing.id !== doc.id) {
        throw new Error(
          `single-doc source already initialized with doc id ${existing.id}`
        );
      }
      this._proxy.doc = doc;
    }, this.doc.clientID);
  }

  getDocMeta(id: string) {
    return this._proxy.doc?.id === id ? this._proxy.doc : undefined;
  }

  initialize() {
    if (!this._proxy.properties) {
      this._proxy.properties = {
        tags: {
          options: [],
        },
      };
    }
  }

  removeDocMeta(id: string) {
    if (this._proxy.doc?.id !== id) {
      return;
    }
    this.doc.transact(() => {
      this._proxy.doc = undefined;
    }, this.doc.clientID);
  }

  setDocMeta(id: string, props: Partial<DocMeta>) {
    if (this._proxy.doc?.id !== id) {
      return;
    }

    this.doc.transact(() => {
      const current = this._proxy.doc;
      if (!current) {
        return;
      }
      this._proxy.doc = {
        ...current,
        ...props,
      };
    }, this.doc.clientID);
  }

  setProperties(meta: DocsPropertiesMeta) {
    this._proxy.properties = meta;
    this.docMetaUpdated.next();
  }

  private _handleDocMetaEvent() {
    const currentDoc = this._proxy.doc;
    const currentId = currentDoc?.id ?? null;

    if (currentId && currentId !== this._previousDocId) {
      this.docMetaAdded.next(currentId);
    }

    if (this._previousDocId && this._previousDocId !== currentId) {
      this.docMetaRemoved.next(this._previousDocId);
    }

    this._previousDocId = currentId;
    this.docMetaUpdated.next();
  }
}

class DocRecord implements Doc {
  private readonly _source: DocSource;

  private readonly _storeContainer: StoreContainer;

  private _loaded = true;

  private _ready = false;

  protected readonly _yBlocks: Y.Map<BlockRecord>;

  readonly id: string;

  readonly docState: Y.Doc;

  get blobSync() {
    return this.docSource.blobSync;
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

  get docSource() {
    return this._source;
  }

  get blockMap() {
    return this._yBlocks;
  }

  constructor({ doc, id, source }: DocRecordOptions) {
    this.id = id;
    this.docState = doc;
    this._source = source;
    this._yBlocks = this.docState.getMap('blocks');
    this._storeContainer = new StoreContainer(this);
  }

  clear() {
    this._yBlocks.clear();
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
    const storeExtensions = this._source.storeExtensions.concat(
      extensions ?? []
    );

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

  get removeStore() {
    return this._storeContainer.removeStore;
  }

  remove() {
    this.clear();
    this._loaded = false;
  }
}

export class DocSource implements AbstractDocSource {
  storeExtensions: ExtensionType[] = [];

  readonly blobSync: BlobSync;

  readonly docState: Y.Doc;

  readonly id: string;

  readonly idGenerator: IdGenerator;

  meta: DocSourceMeta;

  slots = {
    docListUpdated: new Subject<void>(),
  };

  private _recordRef: DocRecord | null = null;

  constructor({ id, idGenerator }: DocSourceOptions = {}) {
    this.id = id || '';
    this.docState = new Y.Doc({ guid: id });
    this.blobSync = new MemoryBlobCRUD();
    this.idGenerator = idGenerator ?? nanoid;

    this.meta = new SourceMeta(this.docState);
    this.meta.docMetaUpdated.subscribe(() => this.slots.docListUpdated.next());
  }

  get doc(): Doc {
    const existing = this.meta.docMetas[0];
    if (!existing) {
      throw new LinvoError(
        ErrorCode.DocCollectionError,
        'single-doc source is not initialized'
      );
    }
    return this._ensureRecord(existing.id);
  }

  canGracefulStop() {
    return true;
  }

  dispose() {}

  forceStop() {
    this.blobSync.stop?.();
  }

  start() {
    this.blobSync.start?.();
  }

  waitForGracefulStop(abort?: AbortSignal) {
    if (abort?.aborted) {
      return Promise.reject(new DOMException('Aborted', 'AbortError'));
    }
    return Promise.resolve();
  }

  waitForSynced() {
    return Promise.resolve();
  }

  private _ensureRecord(docId: string): DocRecord {
    if (!this._recordRef) {
      this._recordRef = new DocRecord({
        id: docId,
        source: this,
        doc: this.docState,
      });
      return this._recordRef;
    }

    if (this._recordRef.id !== docId) {
      throw new LinvoError(
        ErrorCode.DocCollectionError,
        `single-doc source already initialized with doc id ${this._recordRef.id}`
      );
    }

    return this._recordRef;
  }
}

export function createDocSource(options: DocSourceOptions = {}): DocSource {
  return new DocSource(options);
}

export function initializeDocSource(
  source: AbstractDocSource,
  docId?: string
): Doc {
  const id = docId ?? source.idGenerator();
  const existing = source.meta.docMetas[0];

  if (existing && existing.id !== id) {
    throw new LinvoError(
      ErrorCode.DocCollectionError,
      `single-doc source already initialized with doc id ${existing.id}`
    );
  }

  if (!existing) {
    source.meta.addDocMeta({
      id,
      title: '',
      createDate: Date.now(),
      tags: [],
    });
  }

  return source.doc;
}

export function removeDocSourceDoc(
  source: AbstractDocSource,
  docId?: string
) {
  const existing = source.meta.docMetas[0];
  if (!existing) {
    throw new LinvoError(
      ErrorCode.DocCollectionError,
      'single-doc source is not initialized'
    );
  }

  const id = docId ?? existing.id;
  if (existing.id !== id) {
    throw new LinvoError(
      ErrorCode.DocCollectionError,
      `single-doc source does not contain doc id ${id}`
    );
  }

  source.doc.dispose();
  source.meta.removeDocMeta(id);
}
