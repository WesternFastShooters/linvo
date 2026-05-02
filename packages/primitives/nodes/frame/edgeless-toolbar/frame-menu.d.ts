import { LitElement } from 'lit';
import { FrameTool } from '../frame-tool';
declare const EdgelessFrameMenu_base: typeof LitElement & import("@linvo-core/global/utils").Constructor<import("@linvo-ui/edgeless-toolbar").EdgelessToolbarToolClass>;
export declare class EdgelessFrameMenu extends EdgelessFrameMenu_base {
    static styles: import("lit").CSSResult;
    type: typeof FrameTool;
    get frameManager(): import("..").EdgelessFrameManager;
    render(): import("lit-html").TemplateResult<1>;
}
export {};
