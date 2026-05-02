import { LineWidth, StrokeStyle } from '@linvo-core/content';
import { LitElement } from 'lit';
export type LineDetailType = {
    type: 'size';
    value: LineWidth;
} | {
    type: 'style';
    value: StrokeStyle;
};
declare const EdgelessLineStylesPanel_base: typeof LitElement & import("@linvo-core/global/utils").Constructor<import("@linvo-core/global/lit").DisposableClass>;
export declare class EdgelessLineStylesPanel extends EdgelessLineStylesPanel_base {
    static styles: import("lit").CSSResult;
    select(detail: LineDetailType): void;
    render(): import("lit-html").TemplateResult<1>;
    accessor lineStyle: StrokeStyle;
    accessor lineSize: LineWidth;
    accessor lineStyles: StrokeStyle[];
}
declare global {
    interface HTMLElementTagNameMap {
        'edgeless-line-styles-panel': EdgelessLineStylesPanel;
    }
}
export {};
