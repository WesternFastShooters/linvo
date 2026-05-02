import { FrameBlockModel } from '@linvo-core/content';
import { type BlockComponent, ShadowlessElement } from '@linvo-core/std';
import { PlainTextEditor } from '@linvo-primitives/text';
import { nothing } from 'lit';
declare const EdgelessFrameTitleEditor_base: typeof ShadowlessElement & import("@linvo-core/global/utils").Constructor<import("@linvo-core/global/lit").DisposableClass>;
export declare class EdgelessFrameTitleEditor extends EdgelessFrameTitleEditor_base {
    static styles: import("lit").CSSResult;
    get editorHost(): import("@linvo-core/std").EditorHost;
    get inlineEditor(): PlainTextEditor | null;
    get gfx(): import("@linvo-core/std/gfx").GfxController;
    get selection(): import("@linvo-core/std/gfx").GfxSelectionManager;
    private _unmount;
    connectedCallback(): void;
    firstUpdated(): void;
    getUpdateComplete(): Promise<boolean>;
    render(): import("lit-html").TemplateResult<1> | typeof nothing;
    accessor edgeless: BlockComponent;
    accessor frameModel: FrameBlockModel;
    accessor plainTextEditor: PlainTextEditor | null;
}
export {};
