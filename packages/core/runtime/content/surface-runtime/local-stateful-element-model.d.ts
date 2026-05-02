import { Subject } from 'rxjs';
import { LocalElementModel } from './local-element-model';
import type { LocalElementState } from '@linvo-core/shared/whiteboard/types';
import type { LocalSurfaceModel } from './local-surface-model';
export declare class LocalStatefulElementModel<State extends LocalElementState = LocalElementState> extends LocalElementModel<State> {
    readonly propsUpdated: Subject<{
        key: string;
        local: boolean;
    }>;
    protected readonly _local: Map<string, unknown>;
    constructor(surface: LocalSurfaceModel, state: State);
    _emitPropUpdated(key: string, local: boolean): void;
    _readField<V>(key: string, fallback?: V): V | undefined;
    _readLocal<V>(key: string, fallback?: V): V | undefined;
    _writeField(key: string, value: unknown): void;
    _writeLocal(key: string, value: unknown): void;
}
