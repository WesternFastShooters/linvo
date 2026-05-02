import type { Schema } from '../../schema';
import type { Store } from '../store/store';
import { FlatSyncController } from './flat-sync-controller';
import { SyncController } from './sync-controller';
import type { BlockOptions, BlockRecord } from './types';

export type BlockViewType = 'bypass' | 'display' | 'hidden';

export class Block {
  private readonly _syncController: SyncController | FlatSyncController;

  blockViewType: BlockViewType = 'display';

  get flavour() {
    return this._syncController.flavour;
  }

  get id() {
    return this._syncController.id;
  }

  get model() {
    return this._syncController.model;
  }

  get pop() {
    return this._syncController.pop;
  }

  get stash() {
    return this._syncController.stash;
  }

  get version() {
    return this._syncController.version;
  }

  constructor(
    readonly schema: Schema,
    readonly yBlock: BlockRecord,
    readonly doc?: Store,
    readonly options: BlockOptions = {}
  ) {
    const onChange = !options.onChange
      ? undefined
      : (key: string, isLocal: boolean) => {
          if (!this._syncController || !this.model) {
            return;
          }
          options.onChange?.(this, key, isLocal);
        };
    const flavour = yBlock.get('sys:flavour') as string;
    const blockSchema = this.schema.get(flavour);
    if (blockSchema?.model.isFlatData) {
      this._syncController = new FlatSyncController(
        schema,
        yBlock,
        doc,
        onChange
      );
    } else {
      this._syncController = new SyncController(schema, yBlock, doc, onChange);
    }
  }
}
