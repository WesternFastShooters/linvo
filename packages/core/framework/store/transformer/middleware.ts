import type { Subject } from 'rxjs';

import type { BlockModel, DraftModel, Store } from '../document';
import type { AssetsManager } from './assets';
import type { Slice } from './slice';
import type {
  BlockSnapshot,
  CollectionInfoSnapshot,
  DocCRUD,
  DocSnapshot,
  SliceSnapshot,
} from './type';

export type BeforeImportBlockPayload = {
  snapshot: BlockSnapshot;
  type: 'block';
  parent?: string;
  index?: number;
};

export type BeforeImportPayload =
  | BeforeImportBlockPayload
  | {
      snapshot: SliceSnapshot;
      type: 'slice';
    }
  | {
      snapshot: DocSnapshot;
      type: 'doc';
    }
  | {
      snapshot: CollectionInfoSnapshot;
      type: 'info';
    };

export type BeforeExportPayload =
  | {
      model: DraftModel;
      type: 'block';
    }
  | {
      page: Store;
      type: 'doc';
    }
  | {
      slice: Slice;
      type: 'slice';
    }
  | {
      type: 'info';
    };

export type AfterExportPayload =
  | {
      snapshot: BlockSnapshot;
      type: 'block';
      model: DraftModel;
      parent?: string;
      index?: number;
    }
  | {
      snapshot: DocSnapshot;
      type: 'doc';
      page: Store;
    }
  | {
      snapshot: SliceSnapshot;
      type: 'slice';
      slice: Slice;
    }
  | {
      snapshot: CollectionInfoSnapshot;
      type: 'info';
    };

export type AfterImportBlockPayload = {
  snapshot: BlockSnapshot;
  type: 'block';
  model: BlockModel;
  parent?: string;
  index?: number;
};

export type AfterImportPayload =
  | AfterImportBlockPayload
  | {
      snapshot: DocSnapshot;
      type: 'doc';
      page: Store;
    }
  | {
      snapshot: SliceSnapshot;
      type: 'slice';
      slice: Slice;
    }
  | {
      snapshot: CollectionInfoSnapshot;
      type: 'info';
    };

export type TransformerSlots = {
  beforeImport: Subject<BeforeImportPayload>;
  afterImport: Subject<AfterImportPayload>;
  beforeExport: Subject<BeforeExportPayload>;
  afterExport: Subject<AfterExportPayload>;
};

type TransformerMiddlewareOptions = {
  assetsManager: AssetsManager;
  slots: TransformerSlots;
  docCRUD: DocCRUD;
  adapterConfigs: Map<string, unknown>;
  transformerConfigs: Map<string, unknown>;
};

type TransformerMiddlewareCleanup = () => void;

export type TransformerMiddleware = (
  options: TransformerMiddlewareOptions
) => void | TransformerMiddlewareCleanup;
