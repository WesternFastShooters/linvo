import type { DocMode } from '@linvo-core/content';
import type { BlockStdScope } from '@linvo-core/std';
import { ShadowlessElement } from '@linvo-core/std';
import type { BlockModel, Store } from '@linvo-core/store';
import { nothing } from 'lit';
export interface BlockCaptionProps {
    caption: string | null | undefined;
}
declare const BlockCaptionEditor_base: typeof ShadowlessElement & import("@linvo-core/global/utils").Constructor<import("@linvo-core/global/lit").DisposableClass>;
export declare class BlockCaptionEditor<Model extends BlockModel<BlockCaptionProps> = BlockModel<BlockCaptionProps>> extends BlockCaptionEditor_base {
    static styles: import("lit").CSSResult;
    private _focus;
    show: () => void;
    get mode(): DocMode;
    private _onCaptionKeydown;
    private _onInputBlur;
    private _onInputChange;
    private _onInputFocus;
    connectedCallback(): void;
    render(): import("lit-html").TemplateResult<1> | typeof nothing;
    accessor caption: string | null | undefined;
    accessor display: boolean;
    accessor doc: Store;
    accessor input: HTMLInputElement;
    accessor model: Model;
    accessor std: BlockStdScope;
}
declare global {
    interface HTMLElementTagNameMap {
        'block-caption-editor': BlockCaptionEditor;
    }
}
export {};
