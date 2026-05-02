import { LitElement, type PropertyValues } from 'lit';
declare const BlockSelection_base: typeof LitElement;
/**
 * Renders a the block selection.
 *
 * @example
 * ```ts
 * class Block extends LitElement {
 *   state override styles = css`
 *     :host {
 *       position: relative;
 *     }
 *
 *   render() {
 *      return html`<linvo-block-selection></linvo-block-selection>
 *   };
 * }
 * ```
 */
export declare class BlockSelection extends BlockSelection_base {
    static styles: import("lit").CSSResult;
    connectedCallback(): void;
    protected updated(changed: PropertyValues): void;
    accessor selected: boolean;
    accessor borderRadius: number;
    accessor borderWidth: number;
}
declare global {
    interface HTMLElementTagNameMap {
        'linvo-block-selection': BlockSelection;
    }
}
export {};
