import type { BlockList, BlockMap } from '../../extension/doc-source/doc-source';

import type { BlockModel } from './block-model';
import type { Block } from '.';

export type BlockRecord = BlockMap<unknown> & {
  get(prop: 'sys:id' | 'sys:flavour'): string;
  get(prop: 'sys:children'): BlockList<string>;
  get<T = unknown>(prop: string): T;
};

export type BlockOptions = {
  onChange?: (block: Block, key: string, isLocal: boolean) => void;
};

export type BlockSysProps = {
  id: string;
  flavour: string;
  children?: BlockModel[];
};
export type BlockProps = BlockSysProps & Record<string, unknown>;

export type PropsOfModel<T> = T extends BlockModel<infer P> ? P : never;
