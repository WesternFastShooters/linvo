import { LinvoError, ErrorCode } from '@linvo/global/exceptions';
import { NoopLogger } from '@linvo/global/utils';
import {
  AwarenessEngine,
  type AwarenessSource,
  BlobEngine,
  type BlobSource,
  DocEngine,
  type DocSource,
  MemoryBlobSource,
  NoopDocSource,
} from '@linvo/sync';
import { Subject } from 'rxjs';
import { Awareness } from 'y-protocols/awareness.js';
import * as Y from 'yjs';

import type {
  Doc,
  ExtensionType,
  Workspace,
  WorkspaceMeta,
} from '../extension/index.js';
import { type IdGenerator, nanoid } from '../utils/id-generator.js';
import { AwarenessStore } from '../yjs/index.js';
import { TestDoc } from './test-doc.js';
import { TestMeta } from './test-meta.js';

export type DocCollectionOptions = {
  id?: string;
  idGenerator?: IdGenerator;
  docSources?: {
    main: DocSource;
    shadows?: DocSource[];
  };
  blobSources?: {
    main: BlobSource;
    shadows?: BlobSource[];
  };
  awarenessSources?: AwarenessSource[];
};

/**
 * @internal
 * Test only
 * Do not use this in production
 */
export class TestWorkspace implements Workspace {
  storeExtensions: ExtensionType[] = [];

  readonly awarenessStore: AwarenessStore;

  readonly awarenessSync: AwarenessEngine;

  readonly blobSync: BlobEngine;

  readonly yDoc: Y.Doc;

  readonly docSync: DocEngine;

  readonly id: string;

  readonly idGenerator: IdGenerator;

  meta: WorkspaceMeta;

  slots = {
    docListUpdated: new Subject<void>(),
  };

  private _docRef: TestDoc | null = null;

  constructor({
    id,
    idGenerator,
    awarenessSources = [],
    docSources = {
      main: new NoopDocSource(),
    },
    blobSources = {
      main: new MemoryBlobSource(),
    },
  }: DocCollectionOptions = {}) {
    this.id = id || '';
    this.yDoc = new Y.Doc({ guid: id });
    this.awarenessStore = new AwarenessStore(new Awareness(this.yDoc));

    const logger = new NoopLogger();

    this.awarenessSync = new AwarenessEngine(
      this.awarenessStore.awareness,
      awarenessSources
    );
    this.docSync = new DocEngine(
      this.yDoc,
      docSources.main,
      docSources.shadows ?? [],
      logger
    );
    this.blobSync = new BlobEngine(
      blobSources.main,
      blobSources.shadows ?? [],
      logger
    );

    this.idGenerator = idGenerator ?? nanoid;

    this.meta = new TestMeta(this.yDoc);
    this.meta.docMetaUpdated.subscribe(() => this.slots.docListUpdated.next());
  }

  get doc(): Doc {
    const existing = this.meta.docMetas[0];
    if (!existing) {
      throw new LinvoError(
        ErrorCode.DocCollectionError,
        'single-doc workspace is not initialized'
      );
    }
    return this._ensureDoc(existing.id);
  }

  private _ensureDoc(docId: string): TestDoc {
    if (!this._docRef) {
      this._docRef = new TestDoc({
        id: docId,
        collection: this,
        doc: this.yDoc,
        awarenessStore: this.awarenessStore,
      });
      return this._docRef;
    }

    if (this._docRef.id !== docId) {
      throw new LinvoError(
        ErrorCode.DocCollectionError,
        `single-doc workspace already initialized with doc id ${this._docRef.id}`
      );
    }

    return this._docRef;
  }

  /**
   * Verify that all data has been successfully saved to the primary storage.
   * Return true if the data transfer is complete and it is secure to terminate the synchronization operation.
   */
  canGracefulStop() {
    this.docSync.canGracefulStop();
  }

  dispose() {
    this.awarenessStore.destroy();
  }

  /**
   * Terminate the data sync process forcefully, which may cause data loss.
   * It is advised to invoke `canGracefulStop` before calling this method.
   */
  forceStop() {
    this.docSync.forceStop();
    this.blobSync.stop();
    this.awarenessSync.disconnect();
  }

  /**
   * Start the data sync process
   */
  start() {
    this.docSync.start();
    this.blobSync.start();
    this.awarenessSync.connect();
  }

  /**
   * Wait for all data has been successfully saved to the primary storage.
   */
  waitForGracefulStop(abort?: AbortSignal) {
    return this.docSync.waitForGracefulStop(abort);
  }

  waitForSynced() {
    return this.docSync.waitForSynced();
  }
}
