import { LitElement } from 'lit';
import { ShapeTool } from '../shape-tool';
declare const EdgelessShapeToolButton_base: typeof LitElement & import("@linvo-core/global/utils").Constructor<import("@linvo-ui/edgeless-toolbar").EdgelessToolbarToolClass>;
export declare class EdgelessShapeToolButton extends EdgelessShapeToolButton_base {
    static styles: import("lit").CSSResult;
    private readonly _handleShapeClick;
    private readonly _handleWrapperClick;
    type: typeof ShapeTool;
    private _toggleMenu;
    private _updateOverlay;
    firstUpdated(): void;
    render(): import("lit-html").TemplateResult<1>;
}
export {};
