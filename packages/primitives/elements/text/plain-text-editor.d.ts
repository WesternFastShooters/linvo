import { InlineEditor } from '@linvo-core/std/inline';
import { LitElement } from 'lit';
import { Subject } from 'rxjs';
import type { EditableTextLike } from '@linvo-core/store/reactive/text';
export declare class PlainTextEditor extends LitElement {
    static styles: import("lit").CSSResult;
    private _model;
    private _inlineEditor;
    private readonly _onCopy;
    private readonly _onCut;
    private readonly _onPaste;
    get inlineEditor(): InlineEditor<{
        bold?: true | null | undefined;
        link?: string | null | undefined;
        strike?: true | null | undefined;
        code?: true | null | undefined;
        italic?: true | null | undefined;
        underline?: true | null | undefined;
    }> | null;
    get length(): number;
    get rootElement(): HTMLDivElement;
    private accessor _inlineEditorContainer;
    accessor placeholder: string;
    accessor readonly: boolean;
    accessor text: EditableTextLike | null;
    accessor wrapMode: 'nowrap' | 'wrap';
    readonly slots: {
        renderComplete: Subject<void>;
    };
    protected createRenderRoot(): this;
    connectedCallback(): void;
    disconnectedCallback(): void;
    focusEnd(): void;
    focusIndex(index: number): void;
    getUpdateComplete(): Promise<boolean>;
    selectAll(): void;
    private _createEditor;
    private _destroyEditor;
    private _resetEditor;
    render(): import("lit-html").TemplateResult<1>;
    updated(changedProperties: Map<PropertyKey, unknown>): void;
}
