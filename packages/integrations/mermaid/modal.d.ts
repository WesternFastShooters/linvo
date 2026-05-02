import { LitElement } from 'lit';
import type { MermaidInsertController } from './controller';
declare const MermaidInsertModal_base: typeof LitElement;
export declare class MermaidInsertModal extends MermaidInsertModal_base {
    static styles: import("lit").CSSResult;
    accessor controller: MermaidInsertController;
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): import("lit-html").TemplateResult<1> | null;
    private onBackdropClick;
    private onInput;
    private onKeyDown;
    private onWindowKeyDown;
}
export {};
