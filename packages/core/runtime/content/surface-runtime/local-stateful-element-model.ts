import { Subject } from 'rxjs';

import { LocalElementModel } from './local-element-model';
import { runLocalDecorators } from './field-decorators';
import type {
  LocalElementState,
  LocalRecordValue,
} from '@linvo-core/shared/whiteboard/types';
import { cloneRecordValue } from '@linvo-core/shared/whiteboard/utils';
import type { LocalSurfaceModel } from './local-surface-model';

export class LocalStatefulElementModel<
  State extends LocalElementState = LocalElementState,
> extends LocalElementModel<State> {
  readonly propsUpdated = new Subject<{ key: string; local: boolean }>();

  protected readonly _local = new Map<string, unknown>();

  constructor(surface: LocalSurfaceModel, state: State) {
    super(surface, state);
  }

  _emitPropUpdated(key: string, local: boolean) {
    const value =
      key in this.state ? this.state[key] : this._local.get(key);
    runLocalDecorators(this, key, value, local);
    this.propsUpdated.next({ key, local });
  }

  _readField<V>(key: string, fallback?: V) {
    return (this.state[key] ?? fallback) as V | undefined;
  }

  _readLocal<V>(key: string, fallback?: V) {
    return (this._local.get(key) ?? fallback) as V | undefined;
  }

  _writeField(key: string, value: unknown) {
    this.patch(
      { [key]: value as LocalRecordValue } as Partial<Omit<State, 'id' | 'type'>>,
      { label: `set-${key}` }
    );
  }

  _writeLocal(key: string, value: unknown) {
    this._local.set(key, cloneRecordValue(value as LocalRecordValue));
    this._emitPropUpdated(key, true);
  }
}
