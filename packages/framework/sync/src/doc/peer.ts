import type { Logger } from '@linvo/global/utils';
import isEqual from 'lodash-es/isEqual';
import { Subject } from 'rxjs';
import type { Doc } from 'yjs';
import {
  applyUpdate,
  encodeStateAsUpdate,
  encodeStateVector,
  mergeUpdates,
} from 'yjs';

import {
  PriorityAsyncQueue,
  SharedPriorityTarget,
} from '../utils/async-queue.js';
import { MANUALLY_STOP, throwIfAborted } from '../utils/throw-if-aborted.js';
import { DocPeerStep } from './consts.js';
import type { DocSource } from './source.js';

export interface DocPeerStatus {
  step: DocPeerStep;
  totalDocs: number;
  loadedDocs: number;
  pendingPullUpdates: number;
  pendingPushUpdates: number;
}

/**
 * # DocPeer
 * A DocPeer is responsible for syncing one Storage with one Y.Doc.
 */
export class SyncPeer {
  private _status: DocPeerStatus = {
    step: DocPeerStep.LoadingRootDoc,
    totalDocs: 1,
    loadedDocs: 0,
    pendingPullUpdates: 0,
    pendingPushUpdates: 0,
  };

  readonly abort = new AbortController();

  handleStorageUpdates = (id: string, data: Uint8Array) => {
    if (id !== this.yDoc.guid) {
      return;
    }
    this.state.pullUpdatesQueue.push({
      id,
      data,
    });
    this.updateSyncStatus();
  };

  handleYDocUpdates = (update: Uint8Array, origin: string, doc: Doc) => {
    if (origin === this.name || doc.guid !== this.yDoc.guid) {
      return;
    }

    const existing = this.state.pushUpdatesQueue.find(
      ({ id }) => id === doc.guid
    );
    if (existing) {
      existing.data.push(update);
    } else {
      this.state.pushUpdatesQueue.push({
        id: doc.guid,
        data: [update],
      });
    }

    this.updateSyncStatus();
  };

  readonly onStatusChange = new Subject<DocPeerStatus>();

  readonly state: {
    connectedDocs: Map<string, Doc>;
    pushUpdatesQueue: PriorityAsyncQueue<{
      id: string;
      data: Uint8Array[];
    }>;
    pushingUpdate: boolean;
    pullUpdatesQueue: PriorityAsyncQueue<{
      id: string;
      data: Uint8Array;
    }>;
  } = {
    connectedDocs: new Map(),
    pushUpdatesQueue: new PriorityAsyncQueue([], this.priorityTarget),
    pushingUpdate: false,
    pullUpdatesQueue: new PriorityAsyncQueue([], this.priorityTarget),
  };

  get name() {
    return this.source.name;
  }

  private set status(s: DocPeerStatus) {
    if (!isEqual(s, this._status)) {
      this.logger.debug(`doc-peer:${this.name} status change`, s);
      this._status = s;
      this.onStatusChange.next(s);
    }
  }

  get status() {
    return this._status;
  }

  constructor(
    readonly yDoc: Doc,
    readonly source: DocSource,
    readonly priorityTarget = new SharedPriorityTarget(),
    readonly logger: Logger
  ) {
    this.logger.debug(`doc-peer:${this.name} start`);

    this.syncRetryLoop(this.abort.signal).catch(err => {
      console.error(err);
    });
  }

  async connectDoc(doc: Doc, abort: AbortSignal) {
    const { data: docData, state: inStorageState } =
      (await this.source.pull(doc.guid, encodeStateVector(doc))) ?? {};
    throwIfAborted(abort);

    if (docData && docData.length > 0) {
      applyUpdate(doc, docData, 'load');
    }

    this.state.pushUpdatesQueue.push({
      id: doc.guid,
      data: [encodeStateAsUpdate(doc, inStorageState)],
    });

    this.state.connectedDocs.set(doc.guid, doc);
    doc.on('update', this.handleYDocUpdates);
    doc.emit('sync', [true, doc]);

    this.updateSyncStatus();
  }

  disconnectDoc(doc: Doc) {
    doc.off('update', this.handleYDocUpdates);
    this.state.connectedDocs.delete(doc.guid);
    this.updateSyncStatus();
  }

  initState() {
    this.state.connectedDocs.clear();
    this.state.pushUpdatesQueue.clear();
    this.state.pullUpdatesQueue.clear();
    this.state.pushingUpdate = false;
  }

  stop() {
    this.logger.debug(`doc-peer:${this.name} stop`);
    this.abort.abort(MANUALLY_STOP);
  }

  async sync(abortOuter: AbortSignal) {
    this.initState();
    const abortInner = new AbortController();

    abortOuter.addEventListener('abort', reason => {
      abortInner.abort(reason);
    });

    let dispose: (() => void) | null = null;
    try {
      this.updateSyncStatus();

      dispose = await this.source.subscribe(
        this.handleStorageUpdates,
        reason => {
          abortInner.abort('subscribe disconnect:' + reason);
        }
      );
      throwIfAborted(abortInner.signal);

      await this.connectDoc(this.yDoc, abortInner.signal);

      await Promise.all([
        (async () => {
          while (throwIfAborted(abortInner.signal)) {
            const { id, data } = await this.state.pullUpdatesQueue.next(
              abortInner.signal
            );
            if (
              id === this.yDoc.guid &&
              !(
                data.byteLength === 0 ||
                (data.byteLength === 2 && data[0] === 0 && data[1] === 0)
              )
            ) {
              applyUpdate(this.yDoc, data, this.name);
            }
            this.updateSyncStatus();
          }
        })(),
        (async () => {
          while (throwIfAborted(abortInner.signal)) {
            const { id, data } = await this.state.pushUpdatesQueue.next(
              abortInner.signal
            );
            this.state.pushingUpdate = true;
            this.updateSyncStatus();

            const merged = mergeUpdates(data);

            if (
              id === this.yDoc.guid &&
              !(
                merged.byteLength === 0 ||
                (merged.byteLength === 2 && merged[0] === 0 && merged[1] === 0)
              )
            ) {
              await this.source.push(id, merged);
            }

            this.state.pushingUpdate = false;
            this.updateSyncStatus();
          }
        })(),
      ]);
    } finally {
      dispose?.();
      const connectedDocs = Array.from(this.state.connectedDocs.values());
      for (const doc of connectedDocs) {
        this.disconnectDoc(doc);
      }
    }
  }

  async syncRetryLoop(abort: AbortSignal) {
    while (abort.aborted === false) {
      try {
        await this.sync(abort);
      } catch (err) {
        if (err === MANUALLY_STOP || abort.aborted) {
          return;
        }

        this.logger.error(`doc-peer:${this.name} sync error`, err);
      }
      try {
        this.logger.error(`doc-peer:${this.name} retry after 5 seconds`);
        this.status = {
          step: DocPeerStep.Retrying,
          totalDocs: 1,
          loadedDocs: 0,
          pendingPullUpdates: 0,
          pendingPushUpdates: 0,
        };
        await Promise.race([
          new Promise<void>(resolve => {
            setTimeout(resolve, 5 * 1000);
          }),
          new Promise((_, reject) => {
            if (abort.aborted) {
              reject(abort.reason);
            }
            abort.addEventListener('abort', () => {
              reject(abort.reason);
            });
          }),
        ]);
      } catch (err) {
        if (err === MANUALLY_STOP || abort.aborted) {
          return;
        }
        throw err;
      }
    }
  }

  updateSyncStatus() {
    let step;
    if (this.state.connectedDocs.size === 0) {
      step = DocPeerStep.LoadingRootDoc;
    } else if (
      this.state.pullUpdatesQueue.length ||
      this.state.pushUpdatesQueue.length ||
      this.state.pushingUpdate
    ) {
      step = DocPeerStep.Syncing;
    } else {
      step = DocPeerStep.Synced;
    }

    this.status = {
      step,
      totalDocs: 1,
      loadedDocs: this.state.connectedDocs.size > 0 ? 1 : 0,
      pendingPullUpdates: this.state.pullUpdatesQueue.length,
      pendingPushUpdates:
        this.state.pushUpdatesQueue.length + (this.state.pushingUpdate ? 1 : 0),
    };
  }

  async waitForLoaded(abort?: AbortSignal) {
    if (this.status.step >= DocPeerStep.Loaded) {
      return;
    }
    await Promise.race([
      new Promise<void>(resolve => {
        this.onStatusChange.subscribe(status => {
          if (status.step >= DocPeerStep.Loaded) {
            resolve();
          }
        });
      }),
      new Promise((_, reject) => {
        if (abort?.aborted) {
          reject(abort.reason);
        }
        abort?.addEventListener('abort', () => {
          reject(abort.reason);
        });
      }),
    ]);
    throwIfAborted(abort);
  }

  async waitForSynced(abort?: AbortSignal) {
    if (this.status.step === DocPeerStep.Synced) {
      return;
    }
    await Promise.race([
      new Promise<void>(resolve => {
        this.onStatusChange.subscribe(status => {
          if (status.step === DocPeerStep.Synced) {
            resolve();
          }
        });
      }),
      new Promise((_, reject) => {
        if (abort?.aborted) {
          reject(abort.reason);
        }
        abort?.addEventListener('abort', () => {
          reject(abort.reason);
        });
      }),
    ]);
    throwIfAborted(abort);
  }
}
