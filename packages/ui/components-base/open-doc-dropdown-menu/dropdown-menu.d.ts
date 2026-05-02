import { type OpenDocMode, type ToolbarAction, ToolbarContext } from '@linvo-core/shared/services';
import { type ReadonlySignal } from '@preact/signals-core';
import { LitElement } from 'lit';
declare const OpenDocDropdownMenu_base: typeof LitElement & import("@linvo-core/global/utils").Constructor<import("@linvo-core/global/lit").DisposableClass>;
export declare class OpenDocDropdownMenu extends OpenDocDropdownMenu_base {
    static styles: import("lit").CSSResult;
    accessor actions: (ToolbarAction & {
        mode: OpenDocMode;
        shortcut?: string;
    })[];
    accessor context: ToolbarContext;
    accessor openDocMode$: ReadonlySignal<OpenDocMode>;
    accessor updateOpenDocMode: (mode: OpenDocMode) => void;
    currentAction$: ReadonlySignal<{
        id: string;
        score?: number;
        when?: ((cx: ToolbarContext) => boolean) | boolean;
        active?: ((cx: ToolbarContext) => boolean) | boolean;
        placement?: import("@linvo-core/shared/services").ActionPlacement;
    } & {
        label?: string;
        showLabel?: boolean;
        icon?: import("lit-html").TemplateResult;
        tooltip?: string | import("lit-html").TemplateResult;
        variant?: "destructive";
        disabled?: ((cx: ToolbarContext) => boolean) | boolean;
        content?: ((cx: ToolbarContext) => import("lit-html").TemplateResult | null) | (import("lit-html").TemplateResult | null);
        run?: (cx: ToolbarContext) => void;
    } & {
        mode: OpenDocMode;
        shortcut?: string;
    }>;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'linvo-open-doc-dropdown-menu': OpenDocDropdownMenu;
    }
}
export {};
