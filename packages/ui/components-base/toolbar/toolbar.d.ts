import { LitElement } from 'lit';
declare const EditorToolbar_base: typeof LitElement & import("@linvo-core/global/utils").Constructor<import("@linvo-core/global/lit").DisposableClass>;
export declare class EditorToolbar extends EditorToolbar_base {
    static styles: import("lit").CSSResult;
    connectedCallback(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'editor-toolbar': EditorToolbar;
    }
}
export {};
