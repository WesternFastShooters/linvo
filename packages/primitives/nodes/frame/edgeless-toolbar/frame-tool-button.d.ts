import { LitElement } from 'lit';
import { FrameTool } from '../frame-tool';
declare const EdgelessFrameToolButton_base: typeof LitElement & import("@linvo-core/global/utils").Constructor<import("@linvo-ui/edgeless-toolbar").QuickToolMixinClass>;
export declare class EdgelessFrameToolButton extends EdgelessFrameToolButton_base {
    static styles: import("lit").CSSResult;
    type: typeof FrameTool;
    private _toggleFrameMenu;
    render(): import("lit-html").TemplateResult<1>;
}
export {};
