import { ShadowlessElement } from '@linvo-core/std';
export declare const TOGGLE_BUTTON_PARENT_CLASS = "linvo-toggle-button-parent";
declare const ToggleButton_base: typeof ShadowlessElement & import("@linvo-core/global/utils").Constructor<import("@linvo-core/global/lit").DisposableClass>;
export declare class ToggleButton extends ToggleButton_base {
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
    accessor collapsed: boolean;
    accessor updateCollapsed: (collapsed: boolean) => void;
}
declare global {
    interface HTMLElementTagNameMap {
        'linvo-toggle-button': ToggleButton;
    }
}
export {};
