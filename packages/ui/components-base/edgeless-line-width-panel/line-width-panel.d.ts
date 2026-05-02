import { LitElement } from 'lit';
declare const EdgelessLineWidthPanel_base: typeof LitElement & import("@linvo-core/global/utils").Constructor<import("@linvo-core/global/lit").DisposableClass>;
export declare class EdgelessLineWidthPanel extends EdgelessLineWidthPanel_base {
    private _onSelect;
    render(): import("lit-html").TemplateResult<1>;
    accessor disabled: boolean;
    accessor hasTooltip: boolean;
    accessor lineWidths: number[];
    accessor selectedSize: number;
}
declare global {
    interface HTMLElementTagNameMap {
        'edgeless-line-width-panel': EdgelessLineWidthPanel;
    }
}
export {};
