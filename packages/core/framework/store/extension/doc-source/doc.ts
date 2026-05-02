import { createIdentifier } from '@linvo-core/composition/di';

import type { Store, StoreOptions, BlockRecord } from '../../document';
import type {
  AbstractDocSource,
  BlockMap,
  DocState,
} from './doc-source';
import type { DocMeta } from './doc-source-meta';

export type GetStoreOptions = Omit<StoreOptions, 'schema' | 'doc'>;
export type RemoveStoreOptions = Pick<
  StoreOptions,
  'query' | 'id' | 'readonly'
>;

export interface Doc {
  readonly id: string;
  get meta(): DocMeta | undefined;

  remove(): void;
  load(initFn?: () => void): void;
  get ready(): boolean;
  dispose(): void;

  clear(): void;
  getStore(options?: GetStoreOptions): Store;
  removeStore(options: RemoveStoreOptions): void;

  get loaded(): boolean;

  get docSource(): AbstractDocSource;

  /**
   * The shared document state backing this Linvo document.
   */
  get docState(): DocState;
  get blockMap(): BlockMap<BlockRecord>;
}

export const DocIdentifier = createIdentifier<Doc>('store-doc');
