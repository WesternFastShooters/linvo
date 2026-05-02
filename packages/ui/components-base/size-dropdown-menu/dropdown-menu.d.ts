import type { ReadonlySignal, Signal } from '@preact/signals-core';
import { LitElement, type TemplateResult } from 'lit';
import { type EditorMenuButton } from '../toolbar';
type SizeItem = {
    key?: string | number;
    value: number;
};
declare const SizeDropdownMenu_base: typeof LitElement & import("@linvo-core/global/utils").Constructor<import("@linvo-core/global/lit").DisposableClass>;
export declare class SizeDropdownMenu extends SizeDropdownMenu_base {
    static styles: import("lit").CSSResult;
    accessor sizes: readonly SizeItem[];
    accessor size$: Signal<number> | ReadonlySignal<number>;
    accessor maxSize: number;
    accessor minSize: number;
    accessor format: ((e: number) => string) | undefined;
    accessor label: string;
    accessor icon: TemplateResult | undefined;
    accessor type: 'normal' | 'check';
    clamp(value: number, min?: number, max?: number): number;
    select(value: number): void;
    private readonly _onKeydown;
    accessor input: HTMLInputElement;
    accessor menuButton: EditorMenuButton;
    firstUpdated(): void;
    render(): TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'linvo-size-dropdown-menu': SizeDropdownMenu;
    }
}
export {};
