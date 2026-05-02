import { FrameBlockModel } from '@linvo-core/content';
import { type BlockStdScope } from '@linvo-core/std';
import { LitElement } from 'lit';
export declare const LINVO_FRAME_TITLE = "linvo-frame-title";
declare const LinvoFrameTitle_base: typeof LitElement & import("@linvo-core/global/utils").Constructor<import("@linvo-core/global/lit").DisposableClass>;
export declare class LinvoFrameTitle extends LinvoFrameTitle_base {
    static styles: import("lit").CSSResult;
    private _cachedHeight;
    private _cachedWidth;
    get colors(): {
        background: string;
        text: string;
    };
    get doc(): import("@linvo-core/store").Store;
    get gfx(): import("@linvo-core/std/gfx").GfxController;
    private _isInsideFrame;
    private _updateFrameTitleSize;
    private _updateStyle;
    connectedCallback(): void;
    firstUpdated(): void;
    render(): string;
    updated(_changedProperties: Map<string, unknown>): void;
    private accessor _editing;
    private accessor _frameTitle;
    private accessor _nestedFrame;
    private accessor _xywh;
    private accessor _zoom;
    accessor model: FrameBlockModel;
    accessor std: BlockStdScope;
}
export {};
