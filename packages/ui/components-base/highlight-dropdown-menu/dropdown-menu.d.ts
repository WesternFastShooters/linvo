import type { LinvoTextStyleAttributes } from '@linvo-core/shared/types';
import { LitElement } from 'lit';
export type HighlightType = Pick<LinvoTextStyleAttributes, 'color' | 'background'>;
export declare class HighlightDropdownMenu extends LitElement {
    accessor updateHighlight: (styles: HighlightType) => void;
    private readonly _update;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'linvo-highlight-dropdown-menu': HighlightDropdownMenu;
    }
}
