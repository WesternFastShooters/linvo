import { type ToolbarAction, ToolbarContext } from '@linvo-core/shared/services';
import type { ReadonlySignal, Signal } from '@preact/signals-core';
import { LitElement } from 'lit';
declare const ViewDropdownMenu_base: typeof LitElement;
export declare class ViewDropdownMenu extends ViewDropdownMenu_base {
    accessor actions: ToolbarAction[];
    accessor context: ToolbarContext;
    accessor viewType$: Signal<string> | ReadonlySignal<string>;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'linvo-view-dropdown-menu': ViewDropdownMenu;
    }
}
export {};
