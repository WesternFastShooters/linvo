import type { Observable } from 'rxjs';
import type { Subject } from 'rxjs';
import type * as Y from '../../compat';

import type { IdGenerator } from '../../utils/id-generator';
import type { Doc } from './doc';
import type { DocSourceMeta } from './doc-source-meta';

export type BlobState = {
  uploading?: boolean;
  downloading?: boolean;
  overSize?: boolean;
  needUpload?: boolean;
  errorMessage?: string | null;
};

export type DocState = Y.Doc;
export type BlockMap<Value = unknown> = Y.Map<Value>;
export type BlockList<Value = unknown> = Y.Array<Value>;

export interface BlobSync {
  get(key: string): Promise<Blob | null> | Blob | null;
  set(value: Blob): Promise<string> | string;
  set(key: string, value: Blob): Promise<string> | string;
  delete(key: string): Promise<void> | void;
  list(): Promise<string[]> | string[];
  blobState$?(key: string): Observable<BlobState> | null;
  upload?(key: string): Promise<boolean | void> | boolean | void | null;
  start?(): void;
  stop?(): void;
}

export interface AbstractDocSource {
  readonly id: string;
  readonly meta: DocSourceMeta;
  readonly idGenerator: IdGenerator;
  readonly blobSync: BlobSync;
  readonly onLoadDoc?: (doc: DocState) => void;

  get docState(): DocState;
  get doc(): Doc;

  slots: {
    docListUpdated: Subject<void>;
  };

  dispose(): void;
}
