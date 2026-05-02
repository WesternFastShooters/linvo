import { ErrorCode, LinvoError } from '@linvo-core/global/exceptions';
import {
  type AbstractDocSource,
  type BlobSync,
  type Doc,
  type DocSourceMeta,
  type ExtensionType,
  type IdGenerator,
  MemoryBlobCRUD,
  nanoid,
} from '@linvo-core/store';
import * as Y from '@linvo-core/store/compat';
import { Subject } from 'rxjs';

import { TestDoc } from './test-doc';
import { TestMeta } from './test-meta';

export type TestDocSourceOptions = {
  id?: string;
  idGenerator?: IdGenerator;
};

export class TestDocSource implements AbstractDocSource {
  storeExtensions: ExtensionType[] = [];

  readonly blobSync: BlobSync;

  readonly docState: Y.Doc;

  readonly id: string;

  readonly idGenerator: IdGenerator;

  meta: DocSourceMeta;

  slots = {
    docListUpdated: new Subject<void>(),
  };

  private _docRef: TestDoc | null = null;

  constructor({ id, idGenerator }: TestDocSourceOptions = {}) {
    this.id = id || '';
    this.docState = new Y.Doc({ guid: id });
    this.blobSync = new MemoryBlobCRUD();

    this.idGenerator = idGenerator ?? nanoid;

    this.meta = new TestMeta(this.docState);
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
    return this._ensureDoc(existing.id);
  }

  private _ensureDoc(docId: string): TestDoc {
    if (!this._docRef) {
      this._docRef = new TestDoc({
        id: docId,
        source: this,
        doc: this.docState,
      });
      return this._docRef;
    }

    if (this._docRef.id !== docId) {
      throw new LinvoError(
        ErrorCode.DocCollectionError,
        `single-doc source already initialized with doc id ${this._docRef.id}`
      );
    }

    return this._docRef;
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
}
