import type { BlobEngine } from '@linvo/sync';
import type { Subject } from 'rxjs';
import type { Awareness } from 'y-protocols/awareness.js';
import type * as Y from 'yjs';

import type { IdGenerator } from '../../utils/id-generator';
import type { Doc } from './doc.js';
import type { WorkspaceMeta } from './workspace-meta.js';

export interface Workspace {
  readonly id: string;
  readonly meta: WorkspaceMeta;
  readonly idGenerator: IdGenerator;
  readonly blobSync: BlobEngine;
  readonly onLoadDoc?: (doc: Y.Doc) => void;
  readonly onLoadAwareness?: (awareness: Awareness) => void;

  get yDoc(): Y.Doc;
  get doc(): Doc;

  slots: {
    docListUpdated: Subject<void>;
  };

  dispose(): void;
}
