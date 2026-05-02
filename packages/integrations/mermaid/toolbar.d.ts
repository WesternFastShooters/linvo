import { DefaultTool } from '@linvo-core/block-surface';
import { LitElement } from 'lit';
declare const EdgelessMermaidButton_base: typeof LitElement & import("packages/framework/global/src/utils").Constructor<import("@linvo-ui/edgeless-toolbar").EdgelessToolbarToolClass>;
export declare class EdgelessMermaidButton extends EdgelessMermaidButton_base {
    static styles: import("lit").CSSResult;
    enableActiveBackground: boolean;
    type: typeof DefaultTool;
    render(): import("lit-html").TemplateResult<1>;
    private openModal;
}
export declare const mermaidSeniorTool: import("packages/framework/store/src").ExtensionType;
export {};
