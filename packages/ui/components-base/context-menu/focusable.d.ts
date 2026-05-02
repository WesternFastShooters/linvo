import { MenuItem } from './item';
export declare abstract class MenuFocusable extends MenuItem {
    isFocused$: import("@preact/signals-core").ReadonlySignal<boolean>;
    connectedCallback(): void;
    focus(): void;
    abstract onPressEnter(): void;
}
