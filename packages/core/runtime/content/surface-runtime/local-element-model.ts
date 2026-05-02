import type { SerializedXYWH } from '@linvo-core/global/gfx';

import type {
  LocalElementSnapshot,
  LocalElementState,
  LocalRecordValue,
} from '@linvo-core/shared/whiteboard/types';
import {
  cloneElementState,
  serializeElementState,
} from '@linvo-core/shared/whiteboard/utils';
import type { LocalSurfaceModel } from './local-surface-model';

export class LocalElementModel<
  State extends LocalElementState = LocalElementState,
> {
  constructor(
    protected readonly surface: LocalSurfaceModel,
    protected readonly state: State
  ) {}

  get id() {
    return this.state.id;
  }

  get index() {
    return this.state.index;
  }

  get seed() {
    return this.state.seed;
  }

  get type() {
    return this.state.type;
  }

  get xywh(): SerializedXYWH | undefined {
    return this.state.xywh;
  }

  delete(options?: { captureHistory?: boolean; label?: string }) {
    this.surface.deleteElement(this.id, options);
  }

  get<K extends keyof State>(key: K): State[K] {
    return this.state[key];
  }

  getState(): State {
    return cloneElementState(this.state) as State;
  }

  patch(
    props: Partial<Omit<State, 'id' | 'type'>>,
    options?: { captureHistory?: boolean; label?: string }
  ) {
    this.surface.updateElement<State>(this.id, props, options);
  }

  serialize(): LocalElementSnapshot {
    return serializeElementState(this.state);
  }

  set<K extends keyof Omit<State, 'id' | 'type'>>(
    key: K,
    value: State[K],
    options?: { captureHistory?: boolean; label?: string }
  ) {
    this.surface.updateElement<State>(
      this.id,
      { [key]: value } as unknown as Partial<Omit<State, 'id' | 'type'>>,
      options
    );
  }

  setRecord(
    key: keyof Omit<State, 'id' | 'type'>,
    value: LocalRecordValue,
    options?: { captureHistory?: boolean; label?: string }
  ) {
    this.surface.updateElement<State>(
      this.id,
      { [key]: value } as unknown as Partial<Omit<State, 'id' | 'type'>>,
      options
    );
  }
}
