import { PlainTextEditor } from '@linvo-primitives/text';
import type { GroupElementModel } from '@linvo-core/content';
import { type BlockComponent, type BlockStdScope, ShadowlessElement } from '@linvo-core/std';
import { nothing } from 'lit';
export declare function mountGroupTitleEditor(group: GroupElementModel, edgeless: BlockComponent): void;
declare const EdgelessGroupTitleEditor_base: typeof ShadowlessElement & import("@linvo-core/global/utils").Constructor<import("@linvo-core/global/lit").DisposableClass>;
export declare class EdgelessGroupTitleEditor extends EdgelessGroupTitleEditor_base {
    get inlineEditor(): PlainTextEditor;
    get inlineEditorContainer(): HTMLDivElement;
    get gfx(): import("@linvo-core/std/gfx").GfxController;
    get selection(): import("@linvo-core/std/gfx").GfxSelectionManager;
    private _unmount;
    connectedCallback(): void;
    firstUpdated(): void;
    getUpdateComplete(): Promise<boolean>;
    render(): import("lit-html").TemplateResult<1> | typeof nothing;
    accessor group: GroupElementModel;
    accessor std: BlockStdScope;
    accessor plainTextEditor: PlainTextEditor;
}
export {};
