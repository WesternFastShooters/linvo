import { defineCustomElement } from '@linvo-core/global/utils';
import { MenuButton, MobileMenuButton } from './button';
import { MenuInput, MobileMenuInput } from './input';
import { MenuDivider } from './menu-divider';
import { MenuComponent, MobileMenuComponent } from './menu-renderer';
import { MenuSubMenu, MobileSubMenu } from './sub-menu';
export * from './button';
export * from './focusable';
export * from './group';
export * from './input';
export * from './item';
export * from './menu';
export * from './menu-all';
export * from './menu-divider';
export * from './menu-renderer';
export * from './sub-menu';
export function effects() {
    defineCustomElement('linvo-menu', MenuComponent);
    defineCustomElement('mobile-menu', MobileMenuComponent);
    defineCustomElement('linvo-menu-button', MenuButton);
    defineCustomElement('mobile-menu-button', MobileMenuButton);
    defineCustomElement('linvo-menu-input', MenuInput);
    defineCustomElement('mobile-menu-input', MobileMenuInput);
    defineCustomElement('linvo-menu-sub-menu', MenuSubMenu);
    defineCustomElement('mobile-sub-menu', MobileSubMenu);
    defineCustomElement('menu-divider', MenuDivider);
}
export * from './types';
