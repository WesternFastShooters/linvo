import { type Placement } from '@floating-ui/dom';
import type { CSSResult } from 'lit';
import { LitElement } from 'lit';
import { type HoverOptions } from '../hover';
/**
 * @example
 * ```ts
 * // Simple usage
 * html`
 * <linvo-tooltip>Content</linvo-tooltip>
 * `
 * // With placement
 * html`
 * <linvo-tooltip tip-position="top">
 *   Content
 * </linvo-tooltip>
 * `
 *
 * // With custom properties
 * html`
 * <linvo-tooltip
 *   .zIndex=${0}
 *   .offset=${4}
 *   .autoFlip=${true}
 *   .arrow=${true}
 *   .tooltipStyle=${css`:host { z-index: 0; --linvo-tooltip: #fff; }`}
 *   .allowInteractive=${false}
 * >
 *   Content
 * </linvo-tooltip>
 * `
 * ```
 */
export declare class Tooltip extends LitElement {
    static styles: CSSResult;
    private _hoverController;
    private readonly _setUpHoverController;
    private _getStyles;
    connectedCallback(): void;
    getPortal(): HTMLDivElement | undefined;
    /**
     * Allow the tooltip to be interactive.
     * eg. allow the user to select text in the tooltip.
     */
    accessor allowInteractive: boolean;
    /**
     * Show a triangle arrow pointing to the reference element.
     */
    accessor arrow: boolean;
    /**
     * changes the placement of the floating element in order to keep it in view,
     * with the ability to flip to any placement.
     *
     * See https://floating-ui.com/docs/flip
     */
    accessor autoFlip: boolean;
    /**
     * Hide the tooltip when the reference element is not in view.
     *
     * See https://floating-ui.com/docs/hide
     */
    accessor autoHide: boolean;
    /**
     * shifts the floating element to keep it in view.
     * this prevents the floating element from
     * overflowing along its axis of alignment,
     * thereby preserving the side it’s placed on.
     *
     * See https://floating-ui.com/docs/shift
     */
    accessor autoShift: boolean;
    accessor hoverOptions: Partial<HoverOptions>;
    /**
     * Default is `4px`
     *
     * See https://floating-ui.com/docs/offset
     */
    accessor offsetY: number;
    accessor offsetX: number;
    accessor placement: Placement;
    accessor tooltipStyle: CSSResult;
    accessor zIndex: number | string;
}
declare global {
    interface HTMLElementTagNameMap {
        'linvo-tooltip': Tooltip;
    }
}
