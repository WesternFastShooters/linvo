import { PlainTextEditor } from '@linvo-primitives/text';
import type { ConnectorElementModel } from '@linvo-core/content';
import { type IVec } from '@linvo-core/global/gfx';
import { type BlockComponent, type BlockStdScope, ShadowlessElement } from '@linvo-core/std';
export declare function mountConnectorLabelEditor(connector: ConnectorElementModel, edgeless: BlockComponent, point?: IVec): void;
declare const EdgelessConnectorLabelEditor_base: typeof ShadowlessElement & import("@linvo-core/global/utils").Constructor<import("@linvo-core/global/lit").DisposableClass>;
export declare class EdgelessConnectorLabelEditor extends EdgelessConnectorLabelEditor_base {
    static styles: import("lit").CSSResult;
    get crud(): import("@linvo-core/block-surface").EdgelessCRUDExtension;
    get gfx(): import("@linvo-core/std/gfx").GfxController;
    get selection(): import("@linvo-core/std/gfx").GfxSelectionManager;
    private _isComposition;
    private _keeping;
    private _resizeObserver;
    private readonly _updateLabelRect;
    get inlineEditor(): PlainTextEditor;
    get inlineEditorContainer(): HTMLDivElement;
    connectedCallback(): void;
    disconnectedCallback(): void;
    firstUpdated(): void;
    getUpdateComplete(): Promise<boolean>;
    render(): import("lit-html").TemplateResult<1>;
    setKeeping(keeping: boolean): void;
    accessor connector: ConnectorElementModel;
    accessor std: BlockStdScope;
    accessor plainTextEditor: PlainTextEditor;
}
export {};
