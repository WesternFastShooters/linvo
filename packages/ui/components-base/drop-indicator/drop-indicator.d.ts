import { type Rect } from '@linvo-core/global/gfx';
import { LitElement } from 'lit';
export declare class DropIndicator extends LitElement {
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1> | null;
    accessor rect: Rect | null;
    accessor zIndex: number;
}
declare global {
    interface HTMLElementTagNameMap {
        'linvo-drop-indicator': DropIndicator;
    }
}
