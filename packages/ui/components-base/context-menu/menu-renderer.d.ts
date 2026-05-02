import { ShadowlessElement } from '@linvo-core/std';
import { type Middleware, type ReferenceElement } from '@floating-ui/dom';
import type { MenuFocusable } from './focusable';
import { Menu, type MenuConfig, type MenuOptions } from './menu';
import type { MenuComponentInterface } from './types';
declare const MenuComponent_base: typeof ShadowlessElement & import("@linvo-core/global/utils").Constructor<import("@linvo-core/global/lit").DisposableClass>;
export declare class MenuComponent extends MenuComponent_base implements MenuComponentInterface {
    static styles: import("lit").CSSResult;
    private readonly _clickContainer;
    private readonly searchRef;
    firstUpdated(): void;
    focusInput(): void;
    focusTo(ele?: MenuFocusable): void;
    getFirstFocusableElement(): HTMLElement | null;
    getFocusableElements(): HTMLElement[];
    render(): import("lit-html").TemplateResult<1>;
    renderSearch(): import("lit-html").TemplateResult<1>;
    renderTitle(): import("lit-html").TemplateResult<1> | undefined;
    accessor menu: Menu;
}
declare global {
    interface HTMLElementTagNameMap {
        'linvo-menu': MenuComponent;
    }
}
declare const MobileMenuComponent_base: typeof ShadowlessElement & import("@linvo-core/global/utils").Constructor<import("@linvo-core/global/lit").DisposableClass>;
export declare class MobileMenuComponent extends MobileMenuComponent_base implements MenuComponentInterface {
    static styles: import("lit").CSSResult;
    onClose: () => void;
    focusTo(ele?: MenuFocusable): void;
    getFirstFocusableElement(): HTMLElement | null;
    getFocusableElements(): HTMLElement[];
    render(): import("lit-html").TemplateResult<1>;
    renderTitle(): import("lit-html").TemplateResult<1>;
    accessor menu: Menu;
}
declare global {
    interface HTMLElementTagNameMap {
        'mobile-menu': MobileMenuComponent;
    }
}
export declare const getDefaultModalRoot: (ele: HTMLElement) => HTMLElement;
export declare const createModal: (container?: HTMLElement) => HTMLDivElement;
export type PopupTarget = {
    targetRect: ReferenceElement;
    root: HTMLElement;
    popupStart: () => () => void;
};
export declare const popupTargetFromElement: (element: HTMLElement) => PopupTarget;
export declare const createPopup: (target: PopupTarget, content: HTMLElement, options?: {
    onClose?: () => void;
    middleware?: Array<Middleware | null | undefined | false>;
    container?: HTMLElement;
}) => () => void;
export type MenuHandler = {
    close: () => void;
    menu: Menu;
    reopen: () => void;
};
export declare const popMenu: (target: PopupTarget, props: {
    options: MenuOptions;
    middleware?: Array<Middleware | null | undefined | false>;
    container?: HTMLElement;
}) => MenuHandler;
export declare const popFilterableSimpleMenu: (target: PopupTarget, options: MenuConfig[], onClose?: () => void) => void;
export {};
