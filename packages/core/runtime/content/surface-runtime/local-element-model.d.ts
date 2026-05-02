import type { SerializedXYWH } from '@linvo-core/global/gfx';
import type { LocalElementSnapshot, LocalElementState, LocalRecordValue } from '@linvo-core/shared/whiteboard/types';
import type { LocalSurfaceModel } from './local-surface-model';
export declare class LocalElementModel<State extends LocalElementState = LocalElementState> {
    protected readonly surface: LocalSurfaceModel;
    protected readonly state: State;
    constructor(surface: LocalSurfaceModel, state: State);
    get id(): string;
    get index(): string;
    get seed(): number;
    get type(): string;
    get xywh(): SerializedXYWH | undefined;
    delete(options?: {
        captureHistory?: boolean;
        label?: string;
    }): void;
    get<K extends keyof State>(key: K): State[K];
    getState(): State;
    patch(props: Partial<Omit<State, 'id' | 'type'>>, options?: {
        captureHistory?: boolean;
        label?: string;
    }): void;
    serialize(): LocalElementSnapshot;
    set<K extends keyof Omit<State, 'id' | 'type'>>(key: K, value: State[K], options?: {
        captureHistory?: boolean;
        label?: string;
    }): void;
    setRecord(key: keyof Omit<State, 'id' | 'type'>, value: LocalRecordValue, options?: {
        captureHistory?: boolean;
        label?: string;
    }): void;
}
