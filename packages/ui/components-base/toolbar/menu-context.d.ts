import type { BlockStdScope, EditorHost } from '@linvo-core/std';
import type { GfxModel } from '@linvo-core/std/gfx';
import type { BlockModel, Store } from '@linvo-core/store';
export declare abstract class MenuContext {
    abstract get doc(): Store;
    get firstElement(): GfxModel | null;
    abstract get host(): EditorHost;
    abstract get selectedBlockModels(): BlockModel[];
    abstract get std(): BlockStdScope;
    close(): void;
    isElement(): boolean;
    abstract isEmpty(): boolean;
    abstract isMultiple(): boolean;
    abstract isSingle(): boolean;
}
