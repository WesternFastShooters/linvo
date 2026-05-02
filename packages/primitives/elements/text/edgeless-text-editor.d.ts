import { type IModelCoord } from '@linvo-core/block-surface';
import { TextElementModel } from '@linvo-core/content';
import { type BlockComponent, type BlockStdScope, type PointerEventState, ShadowlessElement } from '@linvo-core/std';
import { PlainTextEditor } from './surface-text';
export declare function mountTextElementEditor(textElement: TextElementModel, edgeless: BlockComponent, focusCoord?: IModelCoord): void;
/**
 * @deprecated
 *
 * Canvas Text has been deprecated
 */
export declare function addText(edgeless: BlockComponent, event: PointerEventState): void;
declare const EdgelessTextEditor_base: typeof ShadowlessElement & import("@linvo-core/global/utils").Constructor<import("@linvo-core/global/lit").DisposableClass>;
export declare class EdgelessTextEditor extends EdgelessTextEditor_base {
    get crud(): import("@linvo-core/block-surface").EdgelessCRUDExtension;
    get gfx(): import("@linvo-core/std/gfx").GfxController;
    static BORDER_WIDTH: number;
    static PADDING_HORIZONTAL: number;
    static PADDING_VERTICAL: number;
    static PLACEHOLDER_TEXT: string;
    static styles: import("lit").CSSResult;
    private _isComposition;
    private _keeping;
    private readonly _updateRect;
    get inlineEditor(): PlainTextEditor;
    get inlineEditorContainer(): HTMLDivElement;
    connectedCallback(): void;
    firstUpdated(): void;
    getContainerOffset(): string;
    getCoordsOnCenterAlign(rect: {
        w: number;
        h: number;
        r: number;
        x: number;
        y: number;
    }, w1: number, h1: number): {
        x: number;
        y: number;
    };
    getCoordsOnLeftAlign(rect: {
        w: number;
        h: number;
        r: number;
        x: number;
        y: number;
    }, w1: number, h1: number): {
        x: number;
        y: number;
    };
    getCoordsOnRightAlign(rect: {
        w: number;
        h: number;
        r: number;
        x: number;
        y: number;
    }, w1: number, h1: number): {
        x: number;
        y: number;
    };
    getUpdateComplete(): Promise<boolean>;
    getVisualPosition(element: TextElementModel): import("@linvo-core/global/gfx").IVec;
    render(): import("lit-html").TemplateResult<1>;
    setKeeping(keeping: boolean): void;
    accessor std: BlockStdScope;
    accessor element: TextElementModel;
    accessor plainTextEditor: PlainTextEditor;
}
export {};
