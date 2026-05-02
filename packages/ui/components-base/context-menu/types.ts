import type { ClassInfo } from 'lit-html/directives/class-map.js';

import type { MenuFocusable } from './focusable';
import type { Menu, MenuConfig } from './menu';

export type MenuClass = ClassInfo & {
  'delete-item'?: boolean;
};
export type MenuItemRender<Props> = (props: Props) => MenuConfig;

export interface MenuComponentInterface extends HTMLElement {
  menu: Menu;

  remove(): void;

  getFocusableElements(): HTMLElement[];

  getFirstFocusableElement(): HTMLElement | null;

  focusTo(ele?: MenuFocusable): void;
}
